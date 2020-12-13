#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const errorMiddleware = require('./middleware/error');

const libRouter = require('./routes/library-router');
const libApiRouter = require('./routes/api/library-router');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/books', express.static(path.join(__dirname, 'books')));
app.set('view engine', 'ejs');

app.use('/', libRouter);
app.use('/api/', libApiRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`=== start server PORT ${PORT} ===`);
});
