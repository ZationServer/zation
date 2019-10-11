/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const fsExtra = require('fs-extra');
const fs = require('fs');

class EasyTemplateEngine
{
    constructor(prefix = '{{', postfix = '}}')
    {
        this._prefix = prefix;
        this._postfix = postfix;

        this._map = {};
    }

    addToMap(key,value)
    {
        this._map[key] = value;
    }

    templateString(str)
    {
        for(let k in this._map)
        {
            if(this._map.hasOwnProperty(k))
            {
                str = str.replace(new RegExp(`${this._prefix}${k}${this._postfix}`, 'g'), this._map[k]);
            }
        }

        return str;
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
