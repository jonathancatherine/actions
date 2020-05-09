const yaml = require('yaml')
const fs = require('fs')

const file = fs.readFileSync('./file.yml', 'utf8');
const parsed = yaml.parse(file);


const setPath = (object, path, value) => path
    .split('.')
    .reduce((o, p, i) => o[p] = path.split('.').length === ++i ? value : o[p] || {}, object)

export const setValueInObject = (object, path, value) => eval(`object.${path} = "${value}"`);



console.log(parsed);

//console.log(parsed.spec.values.image.tag);

const str = yaml.stringify(parsed);
console.log(str);
