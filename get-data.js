// console.log(process.env.CLIENT_EMAIL)
// console.log(process.env.API_KEY)
// console.log(process.env.SHEET_ID)
// console.log(process.env.XXXX)

const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

/**
 * a function to get data from a Google Sheet
 * @returns {array} data
 */
async function getData() {
    try {
        await doc.useServiceAccountAuth({
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.API_KEY.replace(/\\n/g, '\n'),
        });
        await doc.loadInfo(); 
        console.log('--- Google Sheet data accessed ---')
    } catch (error) {
        console.log('! Cant access Google Sheet data')
        console.log(error)
        return
    }

    console.log('--- Getting data from Google Sheet ---')
    const sheet = doc.sheetsByIndex[0];
    console.log('--- Got data from Google Sheet ---')
    // const sheet = doc.sheetsByTitle['Sheet1'];
    console.log('--- Getting sheet data ---')
    const rows = await sheet.getRows();
    console.log('--- Got sheet data ---')

    console.log('--- Processing data ---')
    const data = rows.map(row => {
        const obj = {};
        sheet.headerValues.forEach(header => {
            const value = row[header];
            obj[header] = value !== null ? value : NaN;
        });
        return obj;
    });
    console.log('--- Data processed ---')
		console.log(data)

    return data
}

getData()
