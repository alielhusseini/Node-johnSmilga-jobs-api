// require
require('dotenv/config')
require('express-async-errors')
const express = require('express');
const connect = require('./db/connect');
//const mongoose = require('mongoose');
//
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
//

// setup
const app = express();
//mongoose.connect(process.env.DB_CONNECTION).then(() => app.listen(process.env.PORT)).catch(err => console.log(err))
const start = async() => {
    try {
        await connect(process.env.DB_CONNECTION); // 1st connect to DB then listen to any requests
        app.listen(process.env.PORT, () => console.log('connected...'))
    } catch (error) {
        console.log(`error connection:`, error)
    }
}
start();
app.use(express.json());
//
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100 // limit each ip to 100 req/windowsMs
}));
app.use(helmet());
app.use(cors());
app.use(xss());
//

// route
app.get('/', (req, res) => res.json({ msg: 'jobs api' }));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/jobs', require('./middlewares/authentication'), require('./routes/jobs'));
app.use(require('./middlewares/not-found'));
app.use(require('./middlewares/error-handler'));

/* Security: (for hosting, npm i)
 - helmet (prevents numerous attacks)
 - cors (api is accessible from different domain)
 - xss-clean (sanatizes the user's input to protect us from cross side scripting attacks(injection of melicious code))
 - express-rate-limit (# of requests a user can make)
*/