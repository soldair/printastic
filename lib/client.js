var events = require('events')
;


module.exports = function(printasticProtocol){
  var em = new events.EventEmitter();

  em.printers = [];  
  em.addPrinter = function(printer){
    var id = printer.id||++em.printerId;
    printer.queue = [];
    em.printers.push(printer);
  }

  em.canPrint = function(criteria){
    var i,j,matches = [],keys,matched;

    for(i=0;i<this.printers.length;++i){
      keys = Object.keys(criteria);
      matched = true;
      for(j=0;j<keys.length;++j){
        if(p.criteria[ck] !== criteria[ck]) {
          matched = false;
        }
      }
      if(matched) matches.push(p);
    }

    return matches.length?matches:null;
  }

  printasticProtocol.on('message',function(){
    // lets not accept file transfers from this direction for now.
    if(msg.type === "file"){
      em.emit('end');
    } else if(msg.type == "printer") {
      em.addPrinter(msg);
    }
  });

  // when protos ended end on the client object
  printasticProtocol.on('end',function(){
    em.emit('end');
  });

  return em;
}


