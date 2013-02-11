
module.exports = function (p,exts){
  for(var i = 0;i<exts.length;++i){
    if(p.toLowerCase().lastIndexOf(ext) === p.length-ext.length) return true;
  }
  return false;
}

