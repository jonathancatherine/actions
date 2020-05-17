import * as npm from "../src/utils/npm";
import * as exec from "@actions/exec";
jest.mock("@actions/exec");

describe('buildAndPush tests', () => {
    it('without folder', async () => {
        const parameters: npm.NpmParameters = {

        };

        const execMock = jest.spyOn(exec, "exec");
        await npm.build(parameters);

        expect(execMock).toHaveBeenCalledTimes(2);
        expect(execMock).toHaveBeenNthCalledWith(1, "npm install");
        expect(execMock).toHaveBeenNthCalledWith(2, "npm run build");
    })

    it('with folder', async () => {
        const parameters: npm.NpmParameters = {
            folder: "test-folder"
        };

        const execMock = jest.spyOn(exec, "exec");
        await npm.build(parameters);

        expect(execMock).toHaveBeenCalledTimes(3);
        expect(execMock).toHaveBeenNthCalledWith(1, "head -20 test-folder/package.json");
        expect(execMock).toHaveBeenNthCalledWith(2, "npm install test-folder");
        expect(execMock).toHaveBeenNthCalledWith(3, "npm run --prefix test-folder build");
    })
})
