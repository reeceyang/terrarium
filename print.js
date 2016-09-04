var output = dom("DIV", {id: "printOutput"});
document.body.appendChild(output);

function print() {
  var result = [];
  forEach(arguments, function(arg){result.push(String(arg));});
  output.appendChild(dom("PRE", null, result.join("")));
}
