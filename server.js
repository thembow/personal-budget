// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use('/', express.static('public'));

app.use(cors());

const budget = {
    myBudget: [
        {
            title: 'Eat out',
            budget: 35
        },
        {
            title: 'Rent',
            budget: 575
        },
        {
            title: 'Grocery',
            budget: 210
        },
    ]
};


app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});