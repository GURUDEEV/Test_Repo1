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
            df = pd.read_excel(uploaded_file)

            # Add error logging
            st.write("Attempting to read Excel file...")

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
                    options=['What Did Not Go Well?_Sentiment_Score', 'What Went Well?_Sentiment_Score', 
                             'Reason for Churn_Sentiment_Score', 'Improvement opportunity_Sentiment_Score', 
                             'Reason for reported success rate_Sentiment_Score'],
                    index=0
                )

            # Apply filters
            if sentiment_filter:
                f = df[df['What Did Not Go Well?_Sentiment_Category'].isin(sentiment_filter) |
                    df[df['What Went Well?_Sentiment_Category'].isin(sentiment_filter)] |
                    df[df['Reason for Churn_Sentiment_Category'].isin(sentiment_filter)] |
                    df[df['Improvement opportunity_Sentiment_Category'].isin(sentiment_filter)] |
                    df[df['Reason for reported success rate_Sentiment_Category'].isin(sentiment_filter)]

            # Sort dataframe
            df = df.sort_values(by=sort_by, ascending=False)

            # Display results
            st.subheader("Analysis Results")

            # Custom display function for the dataframe
            def format_row(row):
                formatted_row = {}
                sentiment_columns = [
                    'What Did Not Go Well?',
                    'What Went Well?',
                    'Reason for Churn',
                    'Improvement opportunity',
                    'Reason for reported success rate'
                ]
                for col in sentiment_columns:
                    if f'{col}_Sentiment_Score' in row:
                        score_html = f'<span style="background-color: {row[f"{col}_Color"]}; color: black" class="sentiment-score">{row[f"{col}_Sentiment_Score"]:.2f}</span>'
                        smiley_html = get_smiley_html(row[f'{col}_Sentiment_Category'])
                        formatted_row[col] = f'{score_html} {smiley_html}'
                return pd.Series(formatted_row)

            display_df = df.apply(format_row, axis=1)
            st.write(display_df.to_html(escape=False), unsafe_allow_html=True)

            # Display statistics
            st.subheader("Summary Statistics")
            col1, col2, col3 = st.columns(3)

            with col1:
                st.metric("Average Sentiment", f"{df['What Did Not Go Well?_Sentiment_Score'].mean():.2f}" if 'What Did Not Go Well?_Sentiment_Score' in df.columns else "N/A")

            with col2:
                st.metric("Most Common Sentiment", df['What Did Not Go Well?_Sentiment_Category'].mode()[0] if 'What Did Not Go Well?_Sentiment_Category' in df.columns else "N/A")

            with col3:
                st.metric("Total Rows", len(df))

        except Exception as e:
            st.error(f"Error processing file: {str(e)}")

if __name__ == "__main__":
    main()
