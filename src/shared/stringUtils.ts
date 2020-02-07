export function toCamelCase(str : string) : string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();}).replace(/\s+/g, '');
}

export function toPascalCase(str : string) : string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word) {
        return word.toUpperCase();}).replace(/\s+/g, '');
}

export function toKebabCase(str : string) : string {
    const match = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
    if(match !== null) {
        return match.map(x => x.toLowerCase()).join('-');
    }
    return "";
}