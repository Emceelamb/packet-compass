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

let hops =[];
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
    // console.log(data);
    /// console.log(Object.keys(data).length);
    // for (let i = 0; i< Object.keys(data).length; i++){
    //   // console.log(data[i].ip);
    //   if (data[i].ip != "*"){
    //     ips.push(data[i].ip);
    //   }
    // }
    // // console.log(ips);
    // let ipStack = ipURL + ips.join() + ipKey;
    // loadJSON(ipStack, gotIPdata);

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
    // let ipStack = ipURL + ips[10] + ipKey;
    // loadJSON(ipStack, gotIPdata);
  });

}

//Get the lat, long, city data with ipStack's API
function geolocate(data){
  // if (data.latitude != null){
  //   lats.push(data.latitude);
  // }
  // if (data.longitude != null){
  //   longs.push(data.longitude);
  // }

  hops.push(data)

  if (data.longitude == null || data.latitude == null) {
      fmtRenamethislater -= 1
    lats.push(0);
    longs.push(0);
  }

  if (data.longitude != null && data.latitude != null){
    // console.log(data)
    lats.push(data.latitude);
    longs.push(data.longitude);
    // distance();

    if (lats.length == fmtRenamethislater) {
      distance();
    }
  }


}

function distance(){
  let from;
  let to;
  let options = {units: 'miles'};

  for (let i=0; i<lats.length; i++){
    if (lats[i+1]) {
      from = turf.point([lats[i], longs[i]]);
      to = turf.point([lats[i+1], longs[i+1]]);
      // console.log("from", from.geometry.coordinates);
      // console.log("to", to.geometry.coordinates);
      let distance = turf.distance(from, to, options);
      distances.push(distance);
    let bearing = turf.bearing(from,to);
    bearings.push(bearing);

    }
  }
  console.log("distances", distances);
}

function bearing(){
  for (let i=0; i<lats.length; i++){
    from = turf.point([lats[i], longs[i]]);
    to = turf.point([lats[i+1], longs[i+1]]);
    let bearing = turf.bearing(point1,point2);
    bearings.push(bearing);
  }
    console.log("bearings", bearings);
}


// Callback to draw position when new position is received
// function gotHops(data){
//   console.log(data);
// }
