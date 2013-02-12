var events = require('events')
;


module.exports = function(printasticProtocol){
  var em = new events.EventEmitter();

  em.printers = {};  
  em.addPrinter = function(p){
    var id = p.id||++em.printerId;
    p = printer(p,em);
    em.printers[p.id] = p;
    em.emit('printer',printer);
  };

  em.getPrinters = function(criteria){
    var i,j,matches = [],keys,matched;
    var ids = Object.keys(this.printers),p;
    for(i=0;i<ids.length;++i){
      p = this.printers[ids[i]];
      keys = Object.keys(criteria);
      matched = true;
      for(j=0;j<keys.length;++j){
        if(p.criteria[ck] !== criteria[ck]) {
          matched = false;
        }
      }
      if(matched) matches.push(p);
    }

    return matches;
  };

  em.print = function(file,criteria,cb){
    var matches = this.getPrinters(criteria);
    // sort on pending jobs.
    var printer = matches[Math.floor(Math.random()*1000)%5];
    printer.print(file,cb);
  };

  printasticProtocol.on('message',function(msg){
    // lets not accept file transfers from this direction for now.
    if(msg.type === "file"){
      em.emit('end');
    } else if(msg.type == "printer") {
      em.addPrinter(msg);
    } else if(msg.type == "job"){
      // call the correct printer job callabck.  
    } else {
      em.emit('message',msg);
    }
  });

  // when protos ended end on the client object
  printasticProtocol.on('end',function(){
    em.end();
  });

  em.end = function(){
    em.printers.forEach(function(p){
      p.end();
    });
    em.end = function(){};
    em.emit('end');
    printasticProtocol.end();
  };

  return em;
}


