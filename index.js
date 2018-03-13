const process = require('process');
const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const emailValidator = require("email-validator");

const express = require('express');
const bodyParser = require('body-parser');

const subscriptionsFile = path.join(__dirname, 'subscriptions.txt');

// this will create (if not existing) and open the file for appending
const subscriptionsStream = fs.createWriteStream(subscriptionsFile, { flags: 'a' });
subscriptionsStream.write('\n\n\n### Started on ' + new Date().toLocaleString() + '\n\n\n');

const app = express();

// By default express-static will sends the specified directory index file (defaults to 'index.html')
// so for "/" - "/index.html" will be served
app.use(express.static('public'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/subscribe', (req, res) => {
    let email = req.body.email;

    email = validateEmail(email);
    if (email) {
        subscriptionsStream.write(new Date().toLocaleString() + '\t-\t');
        subscriptionsStream.write(email + '\n');
    }

    res.json({ success: !!email });
});

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000!'));
app.on('error', () => {
    subscriptionsStream.close();
    process.exit(1);
})


const validateEmail = (email) => {
    if (_.isString(email)) {
        email = email.trim();
    }

    return emailValidator.validate(email) ? email : false;
}