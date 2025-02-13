import streamlit as st
import pandas as pd
import base64
from utils.sentiment_analyzer import SentimentAnalyzer
from assets.smileys import SMILEY_ICONS

# Page configuration
st.set_page_config(
    page_title="Retrospective Sentiment Analysis",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown(
    """
    <style>
    .stDataFrame {
        font-size: 14px;
    }
    .sentiment-score {
        font-weight: bold;
        padding: 4px 8px;
        border-radius: 4px;
    }
    </style>
    """,
    unsafe_allow_html=True
)

def get_smiley_html(category: str) -> str:
    """Convert SVG to base64 for HTML embedding"""
    svg = SMILEY_ICONS.get(category, SMILEY_ICONS['neutral'])
    b64 = base64.b64encode(svg.encode('utf-8')).decode('utf-8')
    return f'<img src="data:image/svg+xml;base64,{b64}" width="24" height="24">'

def analyze_retrodata(df: pd.DataFrame) -> pd.DataFrame:
    """Analyze sentiment for each row in the dataframe"""
    analyzer = SentimentAnalyzer()

    sentiment_columns = [
        'What Did Not Go Well?',
        'What Went Well?',
        'Reason for Churn',
        'Improvement opportunity',
        'Reason for reported success rate'
    ]

    for col in sentiment_columns:
        if col in df.columns:
            sentiments = []
            for text in df[col]:
                sentiment = analyzer.analyze_text(str(text))  # handle potential non-string values
                sentiments.append(sentiment)
            df[f'{col}_Sentiment_Score'] = [s['compound'] for s in sentiments]
            df[f'{col}_Sentiment_Category'] = [s['category'] for s in sentiments]
            df[f'{col}_Color'] = [s['color'] for s in sentiments]

    return df

def main():
    st.title("Retrospective Sentiment Analysis")

    # File upload
    uploaded_file = st.file_uploader("Upload your retrospective Excel file", type=['xlsx'])

    if uploaded_file is not None:
        try:
            # Read Excel with explicit engine and error handling
            df = pd.read_excel(
                uploaded_file,
                engine='openpyxl',
                encoding_override='utf-8-sig'
            )

            # Analyze sentiments
            df = analyze_retrodata(df)

            # Filtering options
            st.subheader("Filter Options")
            col1, col2 = st.columns(2)

            with col1:
                sentiment_filter = st.multiselect(
                    "Filter by sentiment",
                    options=['very_negative', 'negative', 'neutral', 'positive', 'very_positive'],
                    default=[]
                )

            with col2:
                sort_by = st.selectbox(
                    "Sort by",
                    options=[col for col in df.columns if '_Sentiment_Score' in col],
                    index=0
                )

            # Apply filters
            if sentiment_filter:
                filtered_dfs = []
                for col in df.columns:
                    if '_Sentiment_Category' in col:
                        filtered_df = df[df[col].isin(sentiment_filter)]
                        filtered_dfs.append(filtered_df)
                if filtered_dfs:
                    df = pd.concat(filtered_dfs).drop_duplicates()

            # Sort dataframe
            df = df.sort_values(by=sort_by, ascending=False)

            # Display results
            st.subheader("Analysis Results")

            # Custom display function for the dataframe
            def format_row(row):
                sentiment_cols = [col for col in row.index if '_Sentiment_Category' in col]
                sentiment_html = []
                for col in sentiment_cols:
                    score_col = col.replace('_Category', '_Score')
                    color_col = col.replace('_Category', '_Color')
                    score_html = f'<span style="background-color: {row[color_col]}; color: black" class="sentiment-score">{row[score_col]:.2f}</span>'
                    smiley_html = get_smiley_html(row[col])
                    sentiment_html.append(f'{score_html} {smiley_html}')
                return pd.Series({
                    **{col: row[col] for col in row.index if '_Sentiment' not in col},
                    **{col: sentiment_html[i] for i, col in enumerate(sentiment_cols)}
                })

            display_df = df.apply(format_row, axis=1)
            st.write(display_df.to_html(escape=False), unsafe_allow_html=True)

            # Display statistics
            st.subheader("Summary Statistics")
            col1, col2, col3 = st.columns(3)

            with col1:
                avg_sentiment = df[[col for col in df.columns if '_Sentiment_Score' in col]].mean().mean()
                st.metric("Average Sentiment", f"{avg_sentiment:.2f}" if not pd.isna(avg_sentiment) else "N/A")

            with col2:
                most_common_sentiment = df[[col for col in df.columns if '_Sentiment_Category' in col]].mode().iloc[0, 0]
                st.metric("Most Common Sentiment", most_common_sentiment if not pd.isna(most_common_sentiment) else "N/A")

            with col3:
                st.metric("Total Rows", len(df))

        except Exception as e:
            st.error(f"Error processing file: {str(e)}")

if __name__ == "__main__":
    main()
