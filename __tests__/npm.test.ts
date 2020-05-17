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


    it('with 1 global package', async () => {
        const parameters: npm.NpmParameters = {
            globalPackages: ["@ionic/app-scripts@^3.1.9"]
        };

        const execMock = jest.spyOn(exec, "exec");
        await npm.build(parameters);

        expect(execMock).toHaveBeenCalledTimes(3);
        expect(execMock).toHaveBeenNthCalledWith(1, "npm install @ionic/app-scripts@^3.1.9");
        expect(execMock).toHaveBeenNthCalledWith(2, "npm install");
        expect(execMock).toHaveBeenNthCalledWith(3, "npm run build");
    })

    it('with 2 global packages', async () => {
        const parameters: npm.NpmParameters = {
            globalPackages: ["@ionic/app-scripts@^3.1.9", "test@1.2.3"]
        };

        const execMock = jest.spyOn(exec, "exec");
        await npm.build(parameters);

        expect(execMock).toHaveBeenCalledTimes(4);
        expect(execMock).toHaveBeenNthCalledWith(1, "npm install @ionic/app-scripts@^3.1.9");
        expect(execMock).toHaveBeenNthCalledWith(2, "npm install test@1.2.3");
        expect(execMock).toHaveBeenNthCalledWith(3, "npm install");
        expect(execMock).toHaveBeenNthCalledWith(4, "npm run build");
    })

    it('with empty global packages', async () => {
        const parameters: npm.NpmParameters = {
            globalPackages: []
        };

        const execMock = jest.spyOn(exec, "exec");
        await npm.build(parameters);

        expect(execMock).toHaveBeenCalledTimes(2);
        expect(execMock).toHaveBeenNthCalledWith(1, "npm install");
        expect(execMock).toHaveBeenNthCalledWith(2, "npm run build");
    })
})
