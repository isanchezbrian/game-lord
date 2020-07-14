const express = require('express');
const methorOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 4000;

// ---------------- Controllers -------------------------

const libraryCtrl = require('./controllers/libraryController');
const adminCtrl = require('./controllers/adminController');

// ---------------- Set View Engine ---------------------

app.set('view engine', 'ejs');

// ---------------- Middleware --------------------------

// Static Assets
app.use(express.static(`${__dirname}/public`));

// Method Override
app.use(methorOverride('_method'));

// Express BodyParser
app.use(express.urlencoded({extended: false}));

//Custom Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} ${new Date().toLocaleTimeString()}`);
    next();
});

// ---------------- Routes ------------------------------

// Home Route
app.get('/', (req, res) => {
    res.render('index');
});

// Library Route
// app.use('/library', libraryCtrl);
//     res.send()
app.use('/library', (req, res) => {
    res.send('<h1>Welcome to the library.</h1>')
})

// Admin Route
app.use('/admin', adminCtrl);

// ---------------- Server Listener ---------------------

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));