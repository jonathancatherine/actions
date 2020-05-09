const yaml = require('yaml')
const fs = require('fs')

const file = fs.readFileSync('./file.yml', 'utf8');
const parsed = yaml.parse(file);
parsed.spec.values.image.tag = "asdfsdfsdf";

console.log(parsed);

//console.log(parsed.spec.values.image.tag);

const str = yaml.stringify(parsed);
console.log(str);
