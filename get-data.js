// 
require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
const fs = require('fs');

/**
 * a function to get data from a Google Sheet
 * @returns {array} data
 */
async function getData(filename = 'gs-data.json') {
    // console.log('Trying to access Google Sheet data...')
    try {
        await doc.useServiceAccountAuth({
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.API_KEY.replace(/\\n/g, '\n'),
        });
        await doc.loadInfo();
        // console.log('Got access to Google Sheet data!')
    } catch (error) {
        // console.log('ERROR: Could not access Google Sheet data!')
        console.log(error)
        return
    }

    // console.log('Getting the sheet...')
    const sheet = doc.sheetsByIndex[0];
    // console.log('Got sheet!')
    // const sheet = doc.sheetsByTitle['Sheet1'];
    // console.log('Getting sheet data...')
    const rows = await sheet.getRows();
    // console.log('Got sheet data!')

    // console.log('Processing data...')
    const data = rows.map(row => {
        const obj = {};
        sheet.headerValues.forEach(header => {
            const value = row[header];
            obj[header] = value !== null ? value : NaN;
        });
        return obj;
    });
    // console.log('Data processed!')

    // console.log('Writing data to file...')
    // fs.writeFileSync(filename, JSON.stringify(data));
    // console.log('Data written to file!')
    console.log(JSON.stringify(data))
    return JSON.stringify(data)
}

getData()