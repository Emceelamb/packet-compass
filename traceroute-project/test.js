const https = require('https');

let ipaddr="192.205.32.170";

https.get(`https://api.iptoasn.com/v1/as/ip/${ipaddr}`, (res)=>{
  let data = '';
  res.on('data', (chunk)=>{
    data += chunk;
  });

  res.on('end', () => {
    console.log(JSON.parse(data));
  });
  
}).on("error", (err) =>{
  console.log("Error: " + err.message);
});
