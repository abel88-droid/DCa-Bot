const { GoogleSpreadsheet } = require('google-spreadsheet');

// Load spreadsheet
const doc = new GoogleSpreadsheet('1xC6qaHmZhlVWQlOpHCCrh0Eu7nZZJ3fBNlK5qjCXbQg');

async function getTeamScores() {
    await doc.useServiceAccountAuth(require('../credentials.json'));
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // Assuming first sheet

    const rows = await sheet.getRows();

    // Extract all scores, assuming column name is "Score"
    const scores = rows.map(row => parseInt(row.Score.replace(',', ''), 10));

    return scores;
}

async function calculateAverage() {
    const scores = await getTeamScores();
    if (scores.length === 0) return `No scores found in the spreadsheet`;

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return `The average score is ${average.toFixed(2)}`;
}

module.exports = { getTeamScores, calculateAverage };
