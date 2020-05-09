import * as util from "../src/utils/util";
//import * as path from "path";
//var fs = require('fs');

describe('setValueInObject tests', () => {
    it('shallow', async () => {
        const obj = {
            a: "Hello"
        };

        const modifiedObject = util.setValue(obj, 'a', 'test');
        expect(modifiedObject.a).toBe('test');
    })

    it('deep', async () => {
        const obj = {
            a: { b: "" }
        };

        const modifiedObject = util.setValue(obj, 'a.b', 'test');
        expect(modifiedObject.a.b).toBe('test');
    })
})


describe('fromBase64Sring tests', () => {
    it('simple', async () => {
        const value = util.fromBase64Sring("dGVzdHZhbHVl");
        expect(value).toBe('testvalue');
    })
})

describe('toBase64Sring tests', () => {
    it('simple', async () => {
        const value = util.toBase64Sring("testvalue");
        expect(value).toBe('dGVzdHZhbHVl');
    })
})

describe('replaceValueInYamlString tests', () => {
    it('simple', async () => {
        const value = `
        spec:
          chart:
            ref: master
            path: charts/admin
          values:
            replicaCount: 1
            image:
              repository: registry.com
              tag: aaaa`;

        const expectedValue = `spec:
  chart:
    ref: master
    path: charts/admin
  values:
    replicaCount: 1
    image:
      repository: registry.com
      tag: bbbb
`;

        const modifiedValue = util.replaceValueInYamlString(value, "spec.values.image.tag", "bbbb");
        expect(modifiedValue).toBe(expectedValue);
    })
})

describe('getGithubChangesComment tests', () => {
    it('simple', async () => {
        // const githubPayloadJsonFile = path.join(__dirname, "__fixtures__", "github_payload.json");
        // const githubPayloadJson = fs.readFileSync(githubPayloadJsonFile, 'utf8');
        // const githubPayload = JSON.parse(githubPayloadJson);

        const dockerOptions: util.GithubChangesCommentParameters = {
            repository: 'jonathancatherine/actiontests',
            changesUrl: "https://github.com/jonathancatherine/actiontests/compare/74321d842afd...71a22468b3bc",
            dockerTag: "dockerTagTest",
            dockerImageDigest: "test/jc/registry/test@sha256:bca53a1fc8ae8804e479af3766ed516c817c791d31ccb6e4ef531f0f9e62abc8"
        };

        const comment = util.getGithubChangesComment(dockerOptions);

        expect(comment).toBe(`Repository: jonathancatherine/actiontests
Change: https://github.com/jonathancatherine/actiontests/compare/74321d842afd...71a22468b3bc
DockerTag: dockerTagTest
DockerImageDigest: test/jc/registry/test@sha256:bca53a1fc8ae8804e479af3766ed516c817c791d31ccb6e4ef531f0f9e62abc8`);
    })
})

describe('getDateString tests', () => {
    it('simple', async () => {
        const date = new Date("2020-03-25T12:04:17Z");
        const formattedDate = util.getDateString(date);
        expect(formattedDate).toBe('20200325-120417');
    })
})

