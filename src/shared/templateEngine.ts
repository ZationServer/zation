/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as fs from "fs";
import * as fsExtra from "fs-extra";
import {toCamelCase, toKebabCase, toPascalCase} from "./stringUtils";

export default class TemplateEngine {

    private readonly map : Record<string,string | undefined> = {};

    constructor(map : Record<string,string | undefined>) {
        this.map = map;
    }

    public templateString(value : string) : string {
        return value.replace(/{{(\w+)}(\/(\w*))?}/g, (_,key,__,type) => {
            let value = this.map[key] || "";
            if(type !== undefined){
                switch((type as string).toLowerCase()){
                    case "camelCase":
                    case "cc":
                        value = toCamelCase(value);
                        break;
                    case "kebabCase":
                    case "kc":
                        value = toKebabCase(value);
                        break;
                    case "pascalCase":
                    case "pc":
                        value = toPascalCase(value);
                        break;
                }
            }
            return value;
        });
    }

    public templateFile(filePath : string) : void {
        const file = fs.readFileSync(filePath).toString();
        fsExtra.removeSync(filePath);
        fs.appendFileSync(filePath,this.templateString(file));
    }

    public async templateFiles(filePaths : string[],progressCallback : (current : number,length : number) => void | Promise<any>) : Promise<void> {
        const length = filePaths.length;
        await progressCallback(0,length);
        for(let i = 0; i < length; i++) {
            progressCallback(i + 1,length);
            this.templateFile(filePaths[i]);
        }
    }
}