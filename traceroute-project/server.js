// adapted from https://github.com/mimiyin/collective-play-s18/blob/master/00_helloworld/02_helloworld-sockets/server.js

const ipKey = require('./SECRETS')
// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let path = require('path');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});
const cors = require('cors');

const fs = require('fs');
const request = require('request');

// Tell server where to look for files

//app.use()
app.use(express.static('public'))
app.use(cors());
// traceroute

const Traceroute = require('nodejs-traceroute');


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
    
    socket.on('hops', function(msg){
      let newHops = msg;
      let hopps =[]
      for(var i =0; i <newHops.length; i++){
        let hopObj = newHops[i]
        // hopObj["asn"] = "blah"
        hopObj["asn"] = getASN(newHops[i].ip)
        console.log(newHops[i].ip)
        hopps.push(hopObj);
      }

      fs.readFile('public/hops.json', function(err, data){


        let json ={}
        
        
        json["hops"]=hopps;
        // console.log(json, "why am i not saving")
        fs.writeFile("public/hops.json", JSON.stringify(json), (err)=>{
          // console.log(json, "after wrting file")
          if (err) throw err;
          console.log("saved")
        })

      })
      

      
    })
	}
);

app.get('/i.html', cors(), function (req, res) {
  res.sendFile(path.join(__dirname, '../traceroute-project/public', 'index.html'))
  // res.send('hi')
  console.log("bla bla blah")
  //res.json({msg: 'This is CORS-enabled for a Single Route'})
})

app.get('/2.html', (req,res)=>{
  res.send("hi")
})

function getASN(i){
    let asnlookup = "https://api.hackertarget.com/aslookup/?q="
    // let asnlookup = "http://google.com"
    // let asnlookup = "https://api.iptoasn.com/v1/as/ip/"
    console.log(asnlookup + i, "inside asn")
    request(asnlookup + i, (err, res, body)=>{
      if(!err && res.statusCode == 200){
        // console.log(asnlookup+i)
        let asn=body;

        asn="tata"
        console.log(body, "tata")
        return asn
      } else {
        console.log("err "+ express.statusCode)
        console.log("Jflk")
        let asn="something went wrong but it someone does own this."
        return asn
      }
    console.log(asn, "after getasn")
    return asn
    })

}
