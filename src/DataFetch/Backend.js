const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const app = express();
app.use(bodyParser.json());

const dbConfig = {
    user: 'PBWMEIL_FID_DEV',
    password: 'HU14Th5j',
    connectString: 'oraasgtd106-scan.nam.nsroot.net:8889/NAEIL1D'
};

app.use(cors());

app.get('/api/backlogHealth', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const query = `SELECT team_id, TRUNC(load_date) AS load_date, 
                        ROUND(COALESCE((story_points / NULLIF(capacity, 0)), 0), 2)*100 AS Backlog_Health 
                       FROM pbwmeil.SPRINT_METRICS_BACKLOG_HEALTH /*where team_id='26228'*/
                       ORDER BY load_date`;
        const result = await connection.execute(query);
        const rows = result.rows.map(row => ({
            team_id: row[0],
            load_date: row[1],
            backlog_health: row[2]
        }));
        res.json(rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
});
app.get('/api/successRate', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const query = `select team_id, trunc(load_date) as load_date, 
                        ROUND(COALESCE((completed / NULLIF(planned, 0)),0), 2)*100  AS Success_Rate 
                        FROM pbwmeil.SPRINT_METRICS_FINAL_DATA where issue_type ='Story'
                        AND load_date >= ADD_MONTHS(SYSDATE, -12)
                        ORDER BY load_date`;
        const result = await connection.execute(query);
        const rows = result.rows.map(row => ({
            team_id: row[0],
            load_date: row[1],
            success_rate: row[2]
        }));
        res.json(rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
});

app.get('/api/churnRate', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const query = `select team_id, trunc(load_date) as load_date, 
                        ROUND(COALESCE(((added+removed) / NULLIF(planned, 0)),0), 2)*100  AS Churn_Rate 
                        FROM pbwmeil.SPRINT_METRICS_FINAL_DATA where issue_type ='Story'
                        AND load_date >= ADD_MONTHS(SYSDATE, -12)
                        ORDER BY load_date`;
        const result = await connection.execute(query);
        const rows = result.rows.map(row => ({
            team_id: row[0],
            load_date: row[1],
            churn_rate: row[2]
        }));
        res.json(rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
});

app.get('/api/capacityUtilization', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const query = `select team_id, trunc(load_date) as load_date, 
                        ROUND(COALESCE((completed / NULLIF(capacity, 0)),0), 2)*100 AS Capacity_Utilization 
                        FROM pbwmeil.SPRINT_METRICS_FINAL_DATA 
                        WHERE load_date >= ADD_MONTHS(SYSDATE, -12)
                        ORDER BY load_date`;
        const result = await connection.execute(query);
        const rows = result.rows.map(row => ({
            team_id: row[0],
            load_date: row[1],
            Capacity_Utilization: row[2]
        }));
        res.json(rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
});

app.get('/api/teams', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const query = `select distinct smf.team_id, smf.scrum_team as TEAM_NAME 
                        from pbwmeil.SPRINT_METRICS_FINAL_DATA smf, pbwmeil.SPRINT_METRICS_BACKLOG_HEALTH smb 
                        where (smf.scrum_team!='' or smf.scrum_team!='0') and smf.team_id = smb.team_id`;
        const result = await connection.execute(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
});

// app.get('/api/sentiment', async (req, res) => {
//     let connection;
//     try {
//         connection = await oracledb.getConnection(dbConfig);
//         const query = `SELECT * FROM PBWMEIL.SPRINT_METRICS_RETROSPECTIVE_DATA`;
//         const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
//         const rowsWithSentiment = result.rows.map(row => {
//             const positiveText = [
//                 row.REASON_GO_WELL || '',
//                 row.REASON_FOR_CHURN || '',
//                 row.REASON_SUCCESS_RATE || ''
//             ].join(' ');
//             const positiveAnalysis = sentiment.analyze(positiveText);
            
//             const negativeText = [
//                 row.REASON_NOT_GO_WELL || ''
//             ].join(' ');
//             const negativeAnalysis = sentiment.analyze(negativeText);
            
//             const neutralText = [
//                 row.REASON_GO_WELL || '',
//                 row.REASON_FOR_CHURN || '',
//                 row.REASON_SUCCESS_RATE || '',
//                 row.REASON_NOT_GO_WELL || ''
//             ].join(' ');
//             const neutralAnalysis = sentiment.analyze(neutralText);
            
//             const score = positiveAnalysis.score + negativeAnalysis.score;
            
//             return { ...row, combineScore: score, positiveScore: positiveAnalysis.score, negativeScore: negativeAnalysis.score, neutralScore: neutralAnalysis.score};
//         });
//         res.json(rowsWithSentiment);
//         // res.json(result.rows);
//     } catch (error) {
//         console.error('Error executing query', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     } finally {
//         if (connection) {
//             try {
//                 await connection.close();
//             } catch (err) {
//                 console.error('Error closing connection', err);
//             }
//         }
//     }
// });

app.get('/api/sentiment', async (_, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const query = `SELECT * FROM PBWMEIL.SPRINT_METRICS_RETROSPECTIVE_DATA
                        WHERE updated >= ADD_MONTHS(SYSDATE, -12)
                        ORDER BY updated`;
        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        //Columns to analyze
        const columns = [
            'REASON_GO_WELL', 
            'REASON_FOR_CHURN', 
            'REASON_SUCCESS_RATE', 
            'REASON_NOT_GO_WELL'
        ];

        //process each row
        const rowsWithSentiment = result.rows.map(row => {
            //initialize an reset counters in each row
            let negativeCount = 0;
            let neutralCount = 0;
            let positiveCount = 0;
            columns.forEach(column => {
                const text = row[column] || '';
                const analysis = sentiment.analyze(text);
                if (analysis.score < 0) {
                    negativeCount++;
                } else if (analysis.score > 0) {
                    positiveCount++;
                } else {
                    neutralCount++;
                }
                 
            });
            return { ...row,
                        positive: positiveCount,
                        neutral: neutralCount,
                        negative: negativeCount  
                    }
            // const positiveText = [
            //     row.REASON_GO_WELL || '',
            //     row.REASON_FOR_CHURN || '',
            //     row.REASON_SUCCESS_RATE || ''
            // ].join(' ');
            // const positiveAnalysis = sentiment.analyze(positiveText);
            
            // const negativeText = [
            //     row.REASON_NOT_GO_WELL || ''
            // ].join(' ');
            // const negativeAnalysis = sentiment.analyze(negativeText);
            
            // const neutralText = [
            //     row.REASON_GO_WELL || '',
            //     row.REASON_FOR_CHURN || '',
            //     row.REASON_SUCCESS_RATE || '',
            //     row.REASON_NOT_GO_WELL || ''
            // ].join(' ');
            // const neutralAnalysis = sentiment.analyze(neutralText);
            
            // const score = positiveAnalysis.score + negativeAnalysis.score;
            
            // return { ...row, positive: positiveCount,
            //     neutral: neutralCount,
            //     negative: negativeCount 
            //     // combineScore: score, 
            //     // positiveScore: positiveAnalysis.score, 
            //     // negativeScore: negativeAnalysis.score, 
            //     // neutralScore: neutralAnalysis.score
            // };
        });
        res.json(rowsWithSentiment);
        // res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
});


// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});