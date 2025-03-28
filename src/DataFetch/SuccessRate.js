import React, {useEffect, useState} from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { merge } from 'lodash';
// import { fetchBacklogHealth } from '../src/fetchData';


export default function SuccessRate({ selectedTeam, isStyleMode, themeConfig }) {
    const [chartOptions, setChartOptions] = useState({});
    const modeConfig = {
        chart: {
            styledMode: isStyleMode,
        },
    };

    const fetchSuccessRate = async () => {
        try {
            const response = await fetch('http://sd-671h-4rv0:3030/api/successRate');
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
            const data = await fetchSuccessRate();
            console.log('raw data:', data);
            const filteredData = selectedTeam
                ? data.filter(item => {
                    // console.log('checking item:', item);
                    return item.team_id === selectedTeam;
                })
                : data;
            console.log('filteredData:', filteredData);
            const formattedSRData = filteredData.map(item => [new Date(item.load_date).getTime(), item.success_rate]);
            console.log('formattedSRData:', formattedSRData);
            const options = {
                chart: {
                    height: 200,
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
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                series: [
                {
                    name: 'Success Rate',
                    data: formattedSRData,
                }],
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
                immutable={true}
            />
        </div>
    );
}