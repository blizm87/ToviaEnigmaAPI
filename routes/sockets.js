
function sockets(io){
  io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('room', function(data) {

    })

  });

}

module.exports = sockets;
