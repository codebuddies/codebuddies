/**
 * Truncate String
 * truncate string after `len` characters
 * @param {number} [len = 50]  len
 */
String.prototype.truncate = function(len = 50){

  var regx = new RegExp('^.{0,'+ len +'}[\S]*')
  var matches_array = this.match(regx);
  var str_length = matches_array[0].length;
  var replacement = matches_array[0].replace(/\s$/,'');

  return ((str_length > this.length) ? (replacement) : (replacement + "...") )

}
