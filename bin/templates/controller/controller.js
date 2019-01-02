const {Config,Controller,Result,TaskError,TaskErrorBag} = require('zation-server');
class {{name}} extends Controller
{
    async handle(bag,{})
    {

    }

    async initialize(smallBag)
    {

    }

    async wrongInput(bag,input)
    {

    }

}

{{name}}.config = Config.controllerConfig({

});

module.exports = {{name}};