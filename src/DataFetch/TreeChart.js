// import React from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsOrganization from 'highcharts/modules/organization';

// // Initialize the organization chart module
// HighchartsOrganization(Highcharts);

// const App = () => {
//   // Define the chart data
//   const chartData = [
//     {
//       id: 'DGL-AMV-ACCOUNT',
//       name: 'DGL-AMV-ACCOUNT...',
//       color: '#0000FF', // Blue
//     },
//     {
//       id: 'PPD-CUSTOMER',
//       name: 'PPD-CUSTOMER...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#000000', // Black
//     },
//     {
//       id: 'DGL-SCT-D-TIENRO',
//       name: 'DGL-SCT-D-TIENRO...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#FF0000', // Red
//     },
//     {
//       id: 'BRD-FDN-C-BEHAVI',
//       name: 'BRD-FDN-C-BEHAVI...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#00FF00', // Green
//     },
//     {
//       id: 'BRD-AN-C-SENDO',
//       name: 'BRD-AN-C-SENDO...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#0000FF', // Blue
//     },
//     {
//       id: 'XLN-PP-D-CUSTOM',
//       name: 'XLN-PP-D-CUSTOM...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#0000FF', // Blue
//     },
//     {
//       id: 'BRD-AN-C-NOTES',
//       name: 'BRD-AN-C-NOTES...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#00FFFF', // Cyan
//     },
//     {
//       id: 'DGL-SCT-P-CCS',
//       name: 'DGL-SCT-P-CCS...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#FFA500', // Orange
//     },
//     {
//       id: 'DM-CORRESPOND',
//       name: 'DM-CORRESPOND...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#FF0000', // Red
//     },
//     {
//       id: 'XLG-SCT-P-SESSIO',
//       name: 'XLG-SCT-P-SESSIO...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#00FFFF', // Cyan
//     },
//     {
//       id: 'DGL-AM-V-ACCOUNT',
//       name: 'DGL-AM-V-ACCOUNT...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#00FFFF', // Cyan
//     },
//     {
//       id: 'XLG-SCT-P-STS',
//       name: 'XLG-SCT-P-STS...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#FF00FF', // Magenta
//     },
//     {
//       id: 'FDN-P-PSG-DIGITAL',
//       name: 'FDN-P-PSG-DIGITAL...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#0000FF', // Blue
//     },
//     {
//       id: 'XLG-SCT-P-SESSIO-2',
//       name: 'XLG-SCT-P-SESSIO...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#FF0000', // Red
//     },
//     {
//       id: 'XLG-SCT-P-USERE',
//       name: 'XLG-SCT-P-USERE...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#00FF00', // Green
//     },
//     {
//       id: 'DGL-PP-V-CUSTOM',
//       name: 'DGL-PP-V-CUSTOM...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#0000FF', // Blue
//     },
//     {
//       id: 'XLG-FDN-P-USERP',
//       name: 'XLG-FDN-P-USERP...',
//       parent: 'DGL-AMV-ACCOUNT',
//       color: '#00FFFF', // Cyan
//     },
//   ];

//   // Chart configuration
//   const chartOptions = {
//     title: {
//       text: 'Organizational Chart',
//     },
//     series: [
//       {
//         type: 'organization',
//         data: chartData,
//         keys: ['id', 'parent', 'name', 'color'],
//         nodes: chartData.map(node => ({
//           id: node.id,
//           name: node.name,
//           color: node.color,
//         })),
//         nodeWidth: 120,
//         link: {
//           color: '#000000', // Color of the connecting lines
//         },
//       },
//     ],
//     exporting: {
//       enabled: true,
//     },
//   };

//   return (
//     <div>
//       <HighchartsReact highcharts={Highcharts} options={chartOptions} />
//     </div>
//   );
// };

// export default App;