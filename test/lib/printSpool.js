var test = require('tap').test
, fs = require('fs')
, printSpool = require('../../lib/printSpool')
, toClean = []
, path = require('path')
, rimraf = require('rimraf')
, fixturesDir = path.join(__dirname,"..","fixtures","spool")
;

test('can create print spool',function(t){
  var d = path.join(fixturesDir,Math.random()+'_'+Date.now());
  var f = path.join(d,"test.pdf");

  fs.mkdir(d,function(err){
    t.ok(!err,"should not have error creating fixtures dir");
    toClean.push(d);
    fs.writeFile(f,"im a fake pdf",function(err){
      t.ok(!err,"should not have error adding fake pdf");
      var spool = printSpool({dir:d,criteria:{paper:'letter',color:true}});
      spool.on('file',function(_f,criteria){
        t.equals(_f,f,"should have found correct file in spool");
        t.ok(criteria.paper,"should have passed criteria object to file event");

        spool.close();

        t.end();
      });
    });
  })
});


process.on('exit',function(){
  toClean.forEach(function(p){
    rimraf.sync(p);
  });
});
