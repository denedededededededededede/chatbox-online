const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    // Handle new user
    socket.on('new user', function(data){
        console.log(data.username + ' joined the chat');
        // Broadcast the new user to all clients except the new user itself
        socket.broadcast.emit('user joined', { username: data.username });
    });

    // Handle chat message
    socket.on('chat message', function(data){
        console.log('message: ' + data.message);
        io.emit('chat message', { username: data.username, message: data.message });
    });

    // Handle user disconnect
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
