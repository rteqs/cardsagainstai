const torch = require('libtorchjs');

function test() {
    const input = torch.randn([1, 10]);
    // const input = torch.randn([1, 10]);
    torch.load('./resources/models/traced_distilbert.pt', function(err, model) {
        model.forward(torch.randn([1, 10]), torch.randn([1, 10]), function(err, result) {
            const output = result.toUint8Array();
            console.log(output);
        });
    });
}


module.exports = {
    test,
};  
