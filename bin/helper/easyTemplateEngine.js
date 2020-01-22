/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const fsExtra = require('fs-extra');
const fs = require('fs');

class EasyTemplateEngine
{
    constructor() {
        this._map = {};
    }

    addToMap(key,value)
    {
        this._map[key] = value;
    }

    templateString(str) {
        return str.replace(/{{(\w+)}}/g, (_,key) => {
            return this._map[key];
        });
    }

    static templateFile(source,templateEngine)
    {
        const file = fs.readFileSync(source).toString();
        // noinspection JSUnresolvedFunction
        fsExtra.removeSync(source);
        fs.appendFileSync(source,templateEngine.templateString(file));
    }

    static templateFromFile(source,dist,templateEngine)
    {
        const file = fs.readFileSync(source).toString();
        // noinspection JSUnresolvedFunction
        fsExtra.outputFileSync(dist,templateEngine.templateString(file));
    }

}

module.exports = EasyTemplateEngine;
