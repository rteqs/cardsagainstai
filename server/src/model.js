var torchjs = require('@arition/torch-js');
// model_path = './resources/models/April17Model.pt'
model_path = './resources/models/simple_script_cpu_2021-04-18_09-45.pt' //simple_script_2021-04-18_09-18.pt'
// model_path 
const fs = require('fs')
fs.stat(model_path, (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(stats)
  //we have access to the file stats in `stats`
})
var script_module = new torchjs.ScriptModule(model_path);

async function score(texts) {
    var tensor = torchjs.rand(1, 768);
    // var randoms = [...Array(768)].map(() => Math.floor(Math.random() * 9));

    let output = await script_module.forward(tensor)
    score = output.toObject()['data'][0]
    console.log(score);
    return score
}

module.exports = {
    score,
};  