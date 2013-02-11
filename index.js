var printerManager = require('./lib/printerManager')
, printSpool = require('./lib/printSpool')
, printasticProtocol = require('printastic-protocol');
, net = require('net')
;

module.exports = function(config){
  // todo spools entity
  // queue
  // calls getPrinter on clients.
  config.spools.forEach(function(){

  });

  var server = net.createServer(function(client){
    var serverStream = printasticProtocol();
    client.pipe(serverStream).pipe(client);

    serverStream.on('message',function(message){
      message,type == "printer"
    });

  });

  return server;
}
