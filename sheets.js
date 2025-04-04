const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS); 

const SHEET_ID = '1xC6qaHmZhlVWQlOpHCCrh0Eu7nZZJ3fBNlK5qjCXbQg'; 
const doc = new GoogleSpreadsheet(SHEET_ID);

async function accessSpreadsheet() {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    console.log(`Connected to Spreadsheet: ${doc.title}`);
}


async function getAverageScore(teamName) {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // Assuming data is in the first sheet
    const rows = await sheet.getRows();

    let totalScore = 0;
    let count = 0;

    for (const row of rows) {
        if (row.Team.toLowerCase() === teamName.toLowerCase()) {
            totalScore += parseFloat(row.Score);
            count++;
        }
    }

    if (count > 0) {
        return (totalScore / count).toFixed(2);
    } else {
        return null;
    }
}


module.exports = { accessSpreadsheet, getAverageScore };
