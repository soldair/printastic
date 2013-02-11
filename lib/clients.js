var events = require('events')
, client = require('./client.js')
;


module.exports = function(){
  var em = new events.EventEmitter();
  em.clients = {};
  em.clientId = 0;
  em.addClient = function(clientProtocol){
    var id = ++em.clientId
    , z = this
    , c = client(clientProtocol)
    ;

    c.id = id;
    z.clients[id] = c;

    z.emit('client',c);

    c.on('end',function(){
      // any unsent printer jobs need to be reassigned. 
      // if work ever gets assigned that cant be done yet....
      z.emit('client-end',c);
      delete z.clients[id];
    });
  }

  return em;
}

