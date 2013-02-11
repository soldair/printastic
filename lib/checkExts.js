
module.exports = function (p,exts){
  for(var i = 0;i<exts.length;++i){
    if(p.toLowerCase().lastIndexOf(exts[i]) === p.length-exts[i].length) return true;
  }
  return false;
}

