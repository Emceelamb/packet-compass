// Open and connect socket
let socket = io();
// ipStack API for city,
let ipURL = "http://api.ipstack.com/";
let ips = [];
let ipKey;
let fields = "&fields=ip,city,region_code,country_code,latitude,longitude"
// IPs' lat, long, city from ipStack API
let ipsData = {};
//turf.js to calculate bearing(https://turfjs.org/docs/#bearing)
//First lat, long is the values from 370 Jay Street, Brooklyn
let lats = [40.76];
let longs = [-73.984];
let distances = [];
let bearings = [];

let renamethislater = 0
let fmtRenamethislater = renamethislater

let hops_=[]
let hops=[]
function myFunc(){
  let site = document.getElementById("site").value;
  console.log("Button is pressed!", site);
  socket.emit("website", site);
}
function setup(){
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Listen for confirmation of connection
  socket.on('connect', function() {
    console.log("Connected");
    socket.on("key", function(data){
      ipKey = data;
    })
  });

  // Receive message from server
  socket.on('traceroute', function(data){
  });

//Create array after 'finishTracing' when the traceroute has been completed -> .on ('close') in server side, instead of when it was running, otherwise will get more items than needed in array
  socket.on('finishTracing', function(data) {
    for (let i = 0; i< Object.keys(data).length; i++){
      if (data[i].ip != "*"){
        ips.push(data[i].ip);
      }
    }
    renamethislater = ips.length
    fmtRenamethislater = renamethislater
    //Pass all IPs into ipStack's API
    for (let i = 0; i<renamethislater; i++){
      let ipStack = ipURL + ips[i] + ipKey.ipKey + fields;
      loadJSON(ipStack, geolocate);
    }
    // delay so temp hops are populated
    setTimeout(populateHops, 1000)
  });
}

// temporarily store hops 
function geolocate(data){
 hops_.push(data) 
}

//Get the lat, long, city data with ipStack's API
function distance(e,f){
  let from;
  let to;
  let options = {units: 'miles'};

      // only do distance if not null
      if(e.latitude!=null){
        from = turf.point([e.latitude, e.longitude]);
        to = turf.point([f.latitude, f.longitude]);
        let distance = turf.distance(from, to, options);
        return distance;
      }
}

// only get bearing if not null
function bearing(e,f){
      if(e.latitude!=null){
        from = turf.point([e.latitude, e.longitude]);
        to = turf.point([f.latitude, f.longitude]);
        let bearing = turf.bearing(from, to );
        return bearing;
      }
}


// Call distance bearing functions

function getDB(i,j){
  let hop;
  let server = {
    ip: i.ip,
    city: i.city,
    latitude: i.latitude,
    longitude: i.longitude
  }
  let nextServer = {
    ip: j.ip,
    city: j.city,
    latitude: j.latitude,
    longitude: j.longitude
  }
  if(server.latitude!=null&&nextServer.latitude!=null){
    hop=server;
    hop["distance"]=distance(i,j);
    hop["bearing"]=bearing(i,j)
  } else {
    hop = server
    hop["distance"]=0
    hop["bearing"]=null
    //console.log(hop)
  }
  hops.push(hop)
}

// call get db on hop list

async function populateHops(){
    for(let i = 0;i< hops_.length-1;i++){
      getDB(hops_[i],hops_[i+1])
    }
    console.log("Finished traceroute.")
    socket.emit('hops', hops )
    hops=[]
  }