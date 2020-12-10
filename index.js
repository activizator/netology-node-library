#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const libRouter = require('./routes/library-router');

const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

app.use('/api/', libRouter);

app.listen(3000);
