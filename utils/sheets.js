const { GoogleSpreadsheet } = require('google-spreadsheet');

// Load spreadsheet
const doc = new GoogleSpreadsheet('1xC6qaHmZhlVWQlOpHCCrh0Eu7nZZJ3fBNlK5qjCXbQg');

async function getTeamScores(teamName) {
    await doc.useServiceAccountAuth(require('../credentials.json'));
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // Assuming first sheet

    const rows = await sheet.getRows();
    const scores = rows.filter(row => row.team === teamName).map(row => parseInt(row.score, 10));
    return scores;
}

async function calculateAverage(teamName) {
    const scores = await getTeamScores(teamName);
    if (scores.length === 0) return `No scores found for ${teamName}`;

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return `The average score for ${teamName} is ${average.toFixed(2)}`;
}

module.exports = { getTeamScores, calculateAverage };
