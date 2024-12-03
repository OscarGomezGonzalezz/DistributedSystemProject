
const axios = require('axios');

async function getPriceData(isin) {
    try {
        console.log(isin)
        const validISINs = ["US5949181045", "IE00BHZPJ569", "US0378331005", "US30303M1027"];

        if (!validISINs.includes(isin)) {
            console.log('not valid isin');
            throw new Error("ISIN no válido");
        }
        //url with delay for checking the asyncrony
        const response = await axios.get(`https://onlineweiterbildung-reutlingen-university.de/vswsp5/index.php?isin=${isin}`);
        return response.data;

    } catch (error) {

    console.error("Price data could not be retrieved");
    throw new Error("Error retrieving price data");
    }
}


module.exports = {
    getPriceData
};