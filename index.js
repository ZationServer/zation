const zationServer = require('zation-server');

module.exports.start = (options) =>
{
    zationServer.start(options);
};

//Api Classes
module.exports.Bag = zationServer.Bag;
module.exports.SmallBag = zationServer.SmallBag;
module.exports.Controller = zationServer.Controller;
module.exports.Result = zationServer.Result;
module.exports.TaskError = zationServer.TaskError;
module.exports.TaskErrorBag = zationServer.TaskErrorBag;

module.exports.ErrorType = zationServer.ErrorType;