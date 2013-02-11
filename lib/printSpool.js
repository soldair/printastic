var watch = require('./watch.js')
, events = require('events')
;

module.exports = function(config){
  var em = new events.EventEmitter();
  em.watcher = watch(config.dir,config.exts||['.pdf']);
  em.criteria = config.criteria||{};
  em.changes = {};
  em.files = [];

  // prepare watcher.
  em.watcher.on('file',function(f,cur,prev){
    var s = em.changes[f]||0;
    em.changes[f] = ++s;

    setTimeout(function(){
      if(em.changes[f] !== s) return;
      if(em.files.indexOf(f) == -1) em.files.push(f);
      em.emit('file',f,em.criteria);
    },config.delay||1001);
  });

  em.watcher.on('delete',function(f){
    var i = em.files.indexOf(f);
    if(i > -1) em.files.splice(i,1);
    delete em.changes[f];
  });

  em.close = function(){
    this.emit = function(){};
    this.watcher.close();
  };

  return em;
}


