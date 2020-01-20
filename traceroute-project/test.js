var IPToASN = require('ip-to-asn');
 
var client = new IPToASN();
 
var addresses = [
  '68.22.187.5',
  '207.229.165.18',
  '216.58.216.224',
  '198.6.1.65'
];
 
client.query(addresses, function (err, results) {
  if (err) {
    console.error(err);
    return;
  }
 
  console.log(results);
});
