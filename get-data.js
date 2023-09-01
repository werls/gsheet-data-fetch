require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

/**
 * a function to get data from a Google Sheet
 * @returns {array} data
 */
async function getData(filename = 'data.json') {

    try {
        await doc.useServiceAccountAuth({
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.API_KEY.replace(/\\n/g, '\n'),
        });
        await doc.loadInfo();
    } catch (error) {
        console.log(error)
        return
    }

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const data = JSON.stringify(rows.map(row => {
        const obj = {};
        sheet.headerValues.forEach(header => {
            const value = row[header];
            obj[header] = value !== null ? value : NaN;
        });
        return obj;
    })
    );
    
    console.log(data)
    return data
}

getData()