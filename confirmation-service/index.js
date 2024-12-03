const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const { 
    getPriceData
} = require('./ConfirmationModel');


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/confirmation/:isin', async (req, res) => {

    try {
       const {isin} = req.params
       const dataPrice = await getPriceData(isin);
       const confirmed = true; //confirmation logic
       console.log(dataPrice)//error checking
       if (!dataPrice) {
            return res.status(404).send({ confirmed: false, error: 'no data price information' });
       }
       
        res.status(200).send({ confirmed, dataPrice: dataPrice });

    } catch (error) {
        res.status(500).send({ confirmed: false,error: 'Error retrieving confirmation.' });
    }
});

//Start Server
const PORT = 3334
app.listen(PORT, () => {
console.info(`ConfirmationService Server is running on port ${PORT}`);
});