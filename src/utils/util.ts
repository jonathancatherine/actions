import yaml from "yaml";

export function setValue(object: any, path: string, value: string): any {
    const objectCopy = Object.assign({}, object);
    eval(`objectCopy.${path} = "${value}"`);
    return objectCopy;
}

export function fromBase64Sring(value: string): any {
    const valueBuffer = Buffer.from(value, 'base64');
    return valueBuffer.toString('utf8');
}

export function toBase64Sring(value: string): any {
    const valueBuffer = Buffer.from(value);
    return valueBuffer.toString('base64');
}

export function replaceValueInYamlString(input: string, path: string, replaceValue: string): any {
    const parsedYaml = yaml.parse(input);
    setValue(parsedYaml, path, replaceValue);
    return yaml.stringify(parsedYaml);
}

