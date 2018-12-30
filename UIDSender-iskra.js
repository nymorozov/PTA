// Настраиваем интерфейс UART
PrimarySerial.setup(115200);
 
// логин и пароль WiFi-сети
var SSID = 'Pepette';
var PSWD = 'nNmKcrbk';

var uid = '1f1f1f';

var options = {
    host: '192.168.1.40', // host name
    port: 3000,            // (optional) port, defaults to 80
    path: '/UID'+uid,           // path sent to server
    method: 'GET',       // HTTP command sent to server (must be uppercase 'GET', 'POST', etc)
    protocol: 'http:',   // optional protocol - https: or http:
    headers: { key : 'value'} // (optional) HTTP headers
  };

var wifi  = require('@amperka/wifi').setup(function(err){
  wifi.connect(SSID, PSWD, function(err) {
    wifi.getIP(function(err, ip) { 
      print(ip);
    });
    var http = require("http");    
    http.get(options, function(res) {
      res.on('data', function(data) {
        console.log("HTTP> "+data);
      });
      res.on('close', function(data) {
        console.log("Connection closed");
      });
    });   
  });
});
