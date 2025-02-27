// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "www" folder
app.use(express.static('www'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // When a chat message is received, broadcast it to everyone
    socket.on('chat message', (msg) => {
        io.emit('chat message', { senderId: socket.id, text: msg });
    });

    // When clear chat is requested, instruct all clients to clear their chat
    socket.on('clear chat', () => {
        io.emit('clear chat');
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});



// Listen on IP 10.11.4.110, port 8021
server.listen(8021, () => {
    console.log('Server listening on http://10.11.4.110:8021');
});