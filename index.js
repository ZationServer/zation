const zationServer = require('zation-server');

module.exports.start = (options1,options2) =>
{
    zationServer.start(options1,options2);
};

//Api Classes
module.exports.Bag = zationServer.Bag;
module.exports.Controller = zationServer.Controller;
module.exports.Result = zationServer.Result;
module.exports.TaskError = zationServer.TaskError;
module.exports.TaskErrorBag = zationServer.TaskErrorBag;