var test = require('tap').test
, watch = require('../../lib/watch')
, fs = require('fs')
, path = require('path')
, rimraf = require('rimraf')
, fixturesDir = path.join(__dirname,"..","fixtures","watch")
, toClean = []
;

test("watching root not exists works when it exists later",function(t){
  
  var dir = path.join(fixturesDir,Date.now()+'_'+Math.random());
  var testFile = path.join(dir,'test')
  var em = watch(dir);
  var file = 0;
  var files = [];

  t.plan(6);

  em.once('dir-error',function(){
    makeTest(dir,function(err){
      t.ok(!err,"should not have error making test folder");
      fs.writeFile(testFile,function(){
      //  expectEvent(function(){
      //    return files > 0;
      //  },"should have had a file event after creating file.");
      });
    });
  });

  em.on('change',function() {
    t.ok(true,'should have had change event.');
  });

  em.on('files',function(f){
    if(f.length){
      t.ok(f.indexOf(testFile) > -1,' should have one file in files array. ');
    }
  });

  em.on('file',function(f,cur,prev){
    file++;
    t.ok(!prev,'should not have previous stat because i just created the file.');
    fs.unlink(testFile,function(err){
      t.ok(!err,'shjould not have error unlinking test file '+testFile);
    });
  });

  em.on('delete',function(f){
    t.equals(f,testFile,'test file should be the only delete event');
    em.close();
  });

});


function makeTest(dir,cb){
  if(!cb) {
    cb = dir;
    dir = path.join(fixturesDir,Date.now()+'_'+Math.random());
  }
  fs.mkdir(dir,function(err){
    toClean.push(dir);
    if(err) throw err;
    cb(err,dir);
  }); 
}


function expectEvent(assert,msg,time){
  setTimeout(function(){
    var res = assert();
    if(!res) throw "expect event failed. "+msg;
  },time||5020);
}


process.on('exit',function(){
  toClean.forEach(function(p){
    rimraf.sync(p);
  });
});
