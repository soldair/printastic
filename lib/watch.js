var fs = require('fs')
, path = require('path')
, events = require('events')
, checkExts = require('./checkExts.js')
;


var createWatcher;

createWatcher = function(dir,exts){
  var watchers = {}
  , em = new events.EventEmitter
  , listener = function(cur,prev){
    em.emit('change',cur,prev);
  }
  ,realPath
  ,listeners = {};
  
  createWatcher.watchFile(dir,listener);

  em.close = function(){
    fs.unwatchFile(dir,listener);
    Object.keys(listeners).forEach(function(p){
      fs.unwatchFile(p,listeners[p].listener);
    });
    this.emit('end');
  };

  em.on('change',function(){

    fs.readdir(dir,function(err,files){
      if(err) {
        em.emit('dir-error',err);
        return;
      }

      var processPaths = function(){
        var out = [],f;
        for( var i=0;i<files.length;++i){
          f = path.join(dir,files[i]);
          if(exts){
            // filter by extension.
            if(checkExts(f,exts)) {
              out.push(f);
            }
          } else {
            out.push(f);
          }
        }

        em.emit('files',out);
      }

      if(!realPath) {
        fs.realpath(dir,function(err,rp){
          if(!err) dir = rp;
          realPath = true;
          processPaths();
        });
      } else {
        processPaths();
      }

    });
  });

  em.on('files',function(files){
    files.forEach(function(f){

      if(listeners[f]) return;
      
      var l = function (cur,prev){
        if (prev === null) {
          // f is a new file. with this
          em.emit('file',f,cur,prev);

        } else if (cur.nlink === 0) {
          // f was removed
          createWatcher.watchFile(f,listeners[f].listener);
          em.emit('delete',f,cur,prev);
          delete listeners[f];

        } else {
          // f was changed
          em.emit('file',f,cur,prev);
        }
      };

      fs.stat(f,function(err,stat){
        // if i get an error here i probably cant read the file for some reason.
        // can i expect the watcher to fire at some point in the future?
        // or is it just going to be a memory leak
        if(!err) l(stat);
        else if(err.code === 'ENOENT') {
          fs.unwatchFile(f,listeners[f].listener);
          delete listeners[f];
        }
      });

      listeners[f] = {listener:l};
      createWatcher.watchFile(f,l);

    });
    
  });

  // expose listeners 
  em.listeners = listeners;

  em.emit('change');

  return em;
}


module.exports = createWatcher;

createWatcher.watchFile = function(p,cb){
  fs.watchFile(p,{persistent:false,interval:1000},cb);
} 
