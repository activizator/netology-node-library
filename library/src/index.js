#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const mongoUrl = `mongodb+srv://${process.env.MDBUSER}:${process.env.MDBPASS}@cluster0.0isj7.azure.mongodb.net/MyLibDB?retryWrites=true&w=majority`;

const errorMiddleware = require('./middleware/error');

const libRouter = require('./routes/library-router');
const libApiRouter = require('./routes/api/library-router');
const libUserRouter = require('./routes/user/user-router');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/books', express.static(path.join(__dirname, 'books')));
app.set('view engine', 'ejs');

app.use(require('express-session')({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', libRouter);
app.use('/api/', libApiRouter);
app.use('/api/', libUserRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

async function start () {
    try {
        await
        mongoose.connect(mongoUrl, { useNewUrlParser: true });

        io.on('connection', (socket) => {
            const { id } = socket;
            console.log(`Socket connected: ${id}`);
            socket.on('disconnect', () => {
                console.log(`Socket disconnected: ${id}`);
            });
            // работа с комнатами
            const { roomName } = socket.handshake.query;
            console.log(`Socket roomName: ${roomName}`);
            socket.join(roomName);
            socket.on('message-to-room', (msg) => {
                msg.type = `room: ${roomName}`;
                socket.to(roomName).emit('message-to-room', msg);
                socket.emit('message-to-room', msg);
            });
        });

        server.listen(PORT, () => {
            console.log(`== Server is running on port ${PORT} ==`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
