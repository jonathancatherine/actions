import * as util from "../src/utils/util";

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

