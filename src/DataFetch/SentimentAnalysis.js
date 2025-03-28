import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { merge } from 'lodash';

export default function SentimentBarChart({ selectedTeam, isStyleMode, themeConfig }) {
    const [chartOptions, setChartOptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log('selectedTeam:', selectedTeam);

    const modeConfig = {
        chart: {
            styledMode: isStyleMode,
        },
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log('fetching data...');
            const response = await fetch('http://sd-671h-4rv0:3030/api/sentiment');
            console.log('response:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching successRate data:', error);
            return []; // Return an empty array or handle the error as needed
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        const loadData = async () => {
        // const fetchData = async () => {
        //     try {
        //         const response = await fetch('http://sd-671h-4rv0:3030/api/sentiment');
        //         if (!response.ok) throw new Error('Failed to fetch data');
        //         const data = await response.json();
            const data = await fetchData();
            console.log('raw data:', data);
            const filteredData = selectedTeam
            ? data.filter(item => {
                // console.log('checking item:', item);
                return item.TEAM_ID === selectedTeam;
            })
            : data;

            const negativeCount = filteredData.reduce((acc, item) => acc + (item.negative || 0), 0);
            const neutralCount = filteredData.reduce((acc, item) => acc + (item.neutral || 0), 0);
            const positiveCount = filteredData.reduce((acc, item) => acc + (item.positive || 0), 0);

            const overallSentiment = positiveCount > (negativeCount + neutralCount)
                ? 'Positive'
                : negativeCount > (positiveCount + neutralCount)
                    ? 'Negative'
                    : 'Neutral';

            

            // let negativeCount = 0;
            // let neutralCount = 0;
            // let positiveCount = 0;

            // filteredData.forEach(item => {
            //     negativeCount += item.negativeScore || 0;
            //     neutralCount += item.neutralScore || 0;
            //     positiveCount += item.positiveScore || 0;
            // });
            // let overallSentiment = 'Neutral';
            // if (positiveCount > negativeCount && positiveCount > neutralCount) {
            //     overallSentiment = 'Positive';
            // } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
            //     overallSentiment = 'Negative';
            // }


            // const formattedSentiData = filteredData.map(item => {
            //     return {
            //         x: item.combineScore || 0,
            //         y: [
            //             { name: 'combineScore', value: item.combineScore || 0 },
            //             { name: 'positiveScore', value: item.positiveScore || 0 },
            //             { name: 'negativeScore', value: item.negativeScore || 0 },
            //             { name: 'neutralScore', value: item.neutralScore || 0 }
            //         ]
            //     };
            // });
            // console.log('formattedSentiData:', formattedSentiData);

            // // Categorize sentiment
            // const categories = {
            //     negative: 0,
            //     neutral: 0,
            //     positive: 0
            // };

            // formattedSentiData.forEach(item => {
            //     const score = item.combineScore || 0;
            //     if (score > 0) categories.positive++;
            //     else if (score < 0) categories.negative++;
            //     else categories.neutral++;
            // });

            // // Determine overall sentiment
            // const maxCategory = Object.entries(categories).reduce(
            //     (max, [key, value]) => value > max[1] ? [key, value] : max,
            //     ['neutral', -Infinity]
            // )[0];

            const options = {
                chart: {
                    type: 'bar',
                    renderTo: 'container-bar',
                    // backgroundColor: '#ffffff',
                    height: 200,
                    inverted: true // Make horizontal
                },
                title: {
                    text: 'TEAM SENTIMENT ANALYSIS',
                    // align: 'left',
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }
                },
                subtitle: {
                    text: overallSentiment,
                    // align: 'left',
                    style: {
                        color: 
                            overallSentiment === 'Positive' 
                                ? '#28a745' 
                                : overallSentiment === 'Negative' 
                                    ? '#dc3545' 
                                    : '#333',
                        fontSize: '14px',
                    }
                },
                xAxis: {
                    categories: [
                        '😊 Negative',
                        '😐 Neutral',
                        '😠 Positive'
                    ],
                    min: 0,
                    title: { text: null },
                    gridLineWidth: 0,
                    labels: {
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }
                    }
                },
                yAxis: {
                    visible : false,
                    categories: [
                        '😠 Negative',
                        '😐 Neutral',
                        '😊 Positive'
                    ],
                    labels: { enabled: false } 
                    //     style: {
                    //         fontSize: '14px',
                    //         fontWeight: 'bold'
                    //     }
                    // }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 8,
                        colorByPoint: true,
                        dataLabels: {
                            enabled: true,
                            format: '{y}',
                            align: 'left',
                            style: {
                                fontSize: '14px',
                                textOutline: 'none',
                                color: '#333'
                            }
                        }
                    }
                },
                colors: ['#0f1632', '#73c2fc', '#255be3'], // Red, Orange, Green
                series: [{
                    name: 'Sentiment Count',
                    data: [
                        negativeCount,
                        neutralCount,
                        positiveCount
                    ]
                }],
                legend: { enabled: false },
                credits: { enabled: false },
                tooltip: {
                    headerFormat: '<b>{point.key}</b><br/>',
                    pointFormat: 'Count: {point.y}'
                }
            };

            setChartOptions(options);
            // setError(null);
            };

            loadData();
        }, [selectedTeam]);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        }

    return (
        <div id="container-line">
            <HighchartsReact
                highcharts={Highcharts}
                options={merge({}, chartOptions, isStyleMode ? {}: themeConfig , modeConfig)}
                immutable={true}
            />
        </div>
    );
}