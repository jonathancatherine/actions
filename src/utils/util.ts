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

export interface GithubChangesCommentParameters {
    repository: string;
    changesUrl: string;
    dockerImageDigest?: string;
    dockerTag: string
}


export function getGithubChangesComment(params: GithubChangesCommentParameters): any {
    return `Repository: ${params.repository}
Change: ${params.changesUrl}
DockerTag: ${params.dockerTag}${params.dockerImageDigest ? '\nDockerImageDigest: ' + params.dockerImageDigest : ''}`;
}


export function getDateString(date: Date): any {
    function pad(n) { return n < 10 ? '0' + n : n }
    return `${date.getFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}-${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
}


