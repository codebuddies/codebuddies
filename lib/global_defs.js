String.prototype.truncate = function(){
    var re = this.match(/^.{0,70}[\S]*/);
    var l = re[0].length;
    var re = re[0].replace(/\s$/,'');
    if(l < this.length)
        re = re + "...";
    return re;
}
