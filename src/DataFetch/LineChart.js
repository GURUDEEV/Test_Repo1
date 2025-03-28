import React, {useEffect, useState} from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { merge } from 'lodash';
// import { fetchBacklogHealth } from '../src/fetchData';


export default function LineChart({ selectedTeam, isStyleMode, themeConfig }) {
    const [chartOptions, setChartOptions] = useState({});
    const modeConfig = {
        chart: {
            styledMode: isStyleMode,
        },
    };

    const fetchBacklogHealth = async () => {
        try {
            const response = await fetch('http://sd-671h-4rv0:3030/api/backlogHealth');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching backlog health data:', error);
            return []; // Return an empty array or handle the error as needed
        }
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

    const fetchCapacityUtil = async () => {
        try {
            const response = await fetch('http://sd-671h-4rv0:3030/api/capacityUtilization');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching capacity utilization data:', error);
            return []; // Return an empty array or handle the error as needed
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await fetch('http://sd-671h-4rv0:3030/api/teams');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching teams data:', error);
            return []; // Return an empty array or handle the error as needed
        }
    };

    const fetchAllMetrics = async () => {
        try {
            const [backlogHealth, successRate, capacityUtil] = await Promise.all([fetchBacklogHealth(), fetchSuccessRate(), fetchCapacityUtil()]);
            return { backlogHealth, successRate, capacityUtil };
        } catch (error) {
            console.error('Error fetching metrics:', error);
            return { backlogHealth: [], successRate: [], capacityUtil: [] }; // Return an empty array or handle the error as needed
        }
    }
    
    useEffect(() => {
        const loadData = async () => {
            const data = await fetchBacklogHealth();
            console.log('raw data:', data);
            const filteredData = selectedTeam
                ? data.filter(item => {
                    // console.log('checking item:', item);
                    return item.team_id === selectedTeam;
                })
                : data;
            const formattedBLData = filteredData.map(item => [new Date(item.load_date).getTime(), item.backlog_health]);
            const data1 = await fetchSuccessRate();
            console.log('raw data:', data1);
            const filteredData1 = selectedTeam
                ? data1.filter(item => {
                    // console.log('checking item:', item);
                    return item.team_id === selectedTeam;
                })
                : data1;
            const formattedSRData = filteredData1.map(item => [new Date(item.load_date).getTime(), item.success_rate]);
            const data2 = await fetchCapacityUtil();
            console.log('raw data:', data2);
            const filteredData2 = selectedTeam
                ? data2.filter(item => {
                    // console.log('checking item:', item);
                    return item.team_id === selectedTeam;
                })
                : data2;
            const formattedCUData = filteredData2.map(item => [new Date(item.load_date).getTime(), item.Capacity_Utilization]);
            const data3 = await fetchTeams();
            const formatteamsData = data3.map(item => [new Date(item[0]), item[1]]);
            // console.log('formattedBLData:', formattedBLData);
    //         const modeConfig = {
    //     chart: {
    //         styledMode: isStyleMode,
    //     },
    // };
            const options = {
                chart: {
                    height: 300,
                    type: 'line'
                },
                title: {
                    text: ' '
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Percent'
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Backlog Health',
                    data: formattedBLData,
                },
                {
                    name: 'Success Rate',
                    data: formattedSRData,
                },
                {
                    name: 'Capacity Utilization',
                    data: formattedCUData,
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