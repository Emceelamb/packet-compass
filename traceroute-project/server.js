// adapted from https://github.com/mimiyin/collective-play-s18/blob/master/00_helloworld/02_helloworld-sockets/server.js

const ipKey = require('./SECRETS')
// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// traceroute
const Traceroute = require('nodejs-traceroute');
//
// try {
//     const tracer = new Traceroute();
//     let hops = [];
//     tracer
//         // .on('pid', (pid) => {
//         //     // console.log(`pid: ${pid}`);
//         // })
//         // .on('destination', (destination) => {
//         //     console.log(`destination: ${destination}`);
//         // })
//         .on('hop', (hop) => {
//           hops.push(hop)
//
//             // console.log(`hop: ${JSON.stringify(hop)}`);
//         })
//         .on('close', (code) => {
//             console.log(`close: code ${code}`);
//             console.log(hops);
//         });
//
//     tracer.trace('example.com');
// } catch (ex) {
//     console.log(ex);
// }


// Create socket connection
let io = require('socket.io').listen(server);

// Listen for individual clients to connect
io.sockets.on('connection',
	// Callback function on connection
  // Comes back with a socket object
	function (socket) {
    
    socket.emit("key", ipKey);

		console.log("We have a new client: " + socket.id);
    let hops = [];
    // Listen for data from this client
		socket.on('website', function(url) {
      // Data can be numbers, strings, objects
			console.log("Received: 'data' " + url);

      try {
          const tracer = new Traceroute();
          tracer
              .on('pid', (pid) => {
                  // console.log(`pid: ${pid}`);
              })
              .on('destination', (destination) => {
                  console.log(`destination: ${destination}`);
              })
              .on('hop', (hop) => {
                hops.push(hop);
                // if the last 5 hops are *, socket.emit 'badTrace'
                // console.log(`hop: ${JSON.stringify(hop)}`);
                //console.log(hops);
                // socket.emit('traceroute', hops);
              })
              .on('close', (code) => {
                  console.log(`close: code ${code}`);
                  socket.emit('finishTracing', hops);
              });

          tracer.trace(url);
          // console.log(hops);
      } catch (ex) {
          console.log(ex);
      }

			// Send it to all clients, including this one
			// io.sockets.emit('data', data);

      // Send it to all other clients, not including this one
      //socket.broadcast.emit('data', data);

      // Send it just this client

		});

    // Listen for this client to disconnect
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);
