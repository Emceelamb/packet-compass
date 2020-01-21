// adapted from https://github.com/mimiyin/collective-play-s18/blob/master/00_helloworld/02_helloworld-sockets/server.js

const ipKey = require('./SECRETS');
// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http')
  .createServer(app)
  .listen(port, function() {
    console.log('Server listening at port: ', port);
  });

const fs = require('fs');
const https = require('https');

const IPToASN = require('ip-to-asn');
const client = new IPToASN();

// Tell server where to look for files
app.use(express.static('public'));

// traceroute
const Traceroute = require('nodejs-traceroute');

// Create socket connection
let io = require('socket.io').listen(server);

// Listen for individual clients to connect
io.sockets.on(
  'connection',
  // Callback function on connection
  // Comes back with a socket object
  function(socket) {
    socket.emit('key', ipKey);

    console.log('We have a new client: ' + socket.id);
    let hops = [];
    // Listen for data from this client
    socket.on('website', function(url) {
      // Data can be numbers, strings, objects
      console.log("Received: 'data' " + url);

      try {
        const tracer = new Traceroute();
        tracer
          .on('pid', pid => {
            // console.log(`pid: ${pid}`);
          })
          .on('destination', destination => {
            console.log(`destination: ${destination}`);
          })
          .on('hop', hop => {
            hops.push(hop);
          })
          .on('close', code => {
            console.log(`close: code ${code}`);
            socket.emit('finishTracing', hops);
          });

        tracer.trace(url);
        // console.log(hops);
      } catch (ex) {
        console.log(ex);
      }
    });

    // Listen for this client to disconnect
    socket.on('disconnect', function() {
      console.log('Client has disconnected ' + socket.id);
    });

    socket.on('hops', function(msg) {
      let newHops = msg;
      var asns = [];
      let addresses = [];
      let finishedLookup = [];
      console.log(finishedLookup.length, 'after')
      // console.log(asns);
      newHops.forEach(address => {
        addresses.push(address.ip);
        console.log(address.ip);
      });

      function outHop() {
        console.log(asns, 'eek');
      }

      var i = 0;

      for (var j = 0; j < newHops.length; j++) {
        let hopip = [newHops[j].ip];
        i++;
        let curhop = newHops[j];
        client.query(hopip, function(err, res) {
          if (err) {
            console.error(err);
            return;
          }
          // console.log( res)
          asns.push(res);
          // newHops[j].push(res)
          curhop['asn'] = res;
          finishedLookup.push(curhop);
          // if (i == newHops.length) {
          //   // console.log(finishedLookup);
          //   writeHops(finishedLookup)
          }
        });
      }
      //   asyncFunction((hop, () =>{
      //     let hopip = [hop.ip];
      //     i++;
      //     client.query(hopip, function(err, res) {
      //       if (err) {
      //         console.error(err);
      //         return;
      //       }
      //       // console.log( res)
      //       asns.push(res);
      //     });
      //     if(i === newHops.length){
      //       console.log(asns, "ee")
      //     }
      //   }));
      // });
    });
  },
);

function writeHops(finishedLookup) {
  console.log('skrrt');

  fs.readFile('public/hops.json', function(err, data) {
    let json = {};

    delete json.hops;
    json['hops'] = finishedLookup;
    fs.writeFile('public/hops.json', JSON.stringify(json), err => {
      if (err) throw err;
      console.log('saved');
    });
  });
}
