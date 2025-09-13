// Budget API

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use('/', express.static('public'));

app.use(cors());



app.get('/budget', (req, res) => {
    fs.readFile('budget.json', function(err, data) {
        if (err) {
            throw err;
        } else {
            const budget = JSON.parse(data);
            res.json(budget);
        }
    });
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});