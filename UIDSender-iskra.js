var led = require('@amperka/led').connect(P9);
///////////////////////////////////////////////////////////////////

// Настраиваем интерфейс UART
PrimarySerial.setup(115200);

// логин и пароль WiFi-сети
var SSID = 'Pepette';
var PSWD = 'nNmKcrbk';

var uid = '1f1f1f';

var options = {
    host: '192.168.1.37', // host name
    port: 3000,            // (optional) port, defaults to 80
//    path: '/UID'+uid,           // path sent to server
    method: 'GET',       // HTTP command sent to server (must be uppercase 'GET', 'POST', etc)
    protocol: 'http:',   // optional protocol - https: or http:
//    headers: { key : 'value'} // (optional) HTTP headers
  };

var http = require("http"); 

var wifi  = require('@amperka/wifi').setup(function(err){
  wifi.connect(SSID, PSWD, function(err) {
    wifi.getIP(function(err, ip) { 
      print(ip);
      led.brightness(0.5);
      led.blink(0.8);
    });     
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// настраиваем I2C1 для работы модуля
I2C1.setup({sda: SDA, scl: SCL, bitrate: 400000});
 
// подключаем модуль к I2C1 и пину прерывания
var nfc = require('@amperka/nfc').connect({i2c: I2C1, irqPin: P2});
 
// активируем модуль
nfc.wakeUp(function(error) {
  if (error) {
    print('wake up error', error);
  } else {
    print('wake up OK');
    // слушаем новые метки
    nfc.listen();
    led.brightness(0.35);
    led.blink(1);
  }
});

nfc.on('tag', function(error, data) {
  if (error) {
    print('tag read error');
  } else {
    led.blink(0.3);
    // выводим в консоль полученные данные 
    var uid = JSON.stringify(data.uid);
//    uid = uid.substring(1,uid.length-1);
//    print('Sending '+JSON.stringify(data.uid));
    print('Sending '+uid);
    options.path = '/UID'+uid;
    http.get(options, function(res) { print('Something');
      res.on('data', function(data) {
        console.log("HTTP> "+data);
      });
      res.on('close', function(data) {
        console.log("Connection closed");
      });
    }); 
  }
  setTimeout(function () {
    nfc.listen();
  }, 1000);
});