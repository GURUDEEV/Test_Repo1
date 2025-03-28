import React, { useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { merge } from 'lodash';

export default function CapacityUtil({ selectedTeam, isStyleMode, themeConfig }) {
    const [chartOptions, setChartOptions] = useState({});
    const modeConfig = {
        chart: {
            styledMode: isStyleMode,
        },
    };

    const fetchCapacityUtil = async () => {
        try {
            const response = await fetch('http://sd-671h-4rv0:3030/api/capacityUtilization');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching successRate data:', error);
            return []; // Return an empty array or handle the error as needed
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchCapacityUtil();
            console.log('raw data:', data);
            const filteredData = selectedTeam
                ? data.filter(item => {
                    // console.log('checking item:', item);
                    return item.team_id === selectedTeam;
                })
                : data;
            console.log('filteredData:', filteredData);
            const formattedCUData = filteredData.map(item => [new Date(item.load_date).getTime(), item.Capacity_Utilization]);
            console.log('formattedCUData:', formattedCUData);
            const options = {
                chart: {
                    height: 190,
                    type: 'line'
                },
                title: {
                    text: ' '
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: ''
                    },
                    maxZoom: 30 * 24 * 3600000, // Set the maximum zoom level to 30 days
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                series: [
                    {
                        name: 'Capacity Utilization',
                        data: formattedCUData,
                    }
                ],
                accessibility: {
                    enabled: false // Disable accessibility to remove the warning
                }
            };
            setChartOptions(options);
        };

        loadData();
    }, [selectedTeam]);

    return (
        <div id="container-line">
            <HighchartsReact
                highcharts={Highcharts}
                options={merge({}, chartOptions, isStyleMode ? {} : themeConfig, modeConfig)}
                // immutable={true}
            />
        </div>
    );
}