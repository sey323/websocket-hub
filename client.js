const io = require('socket.io-client');

var command = 'ls -la';
var socket = io.connect('http://localhost:8023');

console.log(command);

socket.on('connect' ,function (data) {
  socket.emit('exec',command,function(msg){
    console.log(msg);
  });

  socket.on('response',function(msg){
    msg = msg['data'];
    console.log(msg);
  });

  socket.on('exit',function(msg){
    console.log(msg);
    socket.disconnect()
  });
});
