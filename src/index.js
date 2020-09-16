
const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('new web sokect connection !!');

    socket.emit('message', 'wellcome');
    socket.broadcast.emit('message', 'new user has joined!');

    socket.on('sendMessage', (message, call) => {
        const filter = new Filter();

        if(filter.isProfane(message)) {
            return call('Profanity is not allowed');
        }
        io.emit('message', message);
        call();
    });

    socket.on('sendLocation', (coords, call) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
        call();
    });

    socket.on('disconnect', () => {
        io.emit('message', 'user has left!');
    });
});

server.listen(port, () => {
    console.log('server running');
});
