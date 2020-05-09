import * as git from "../src/utils/git";
const exec = require('@actions/exec');
const github = require('@actions/github');
jest.mock("@actions/exec");
jest.mock("@actions/github");

describe('replaceRemoteFile tests', () => {
    it('simple', async () => {
        const remoteFileReplaceOptions: git.RemoteFileReplaceOptions = {
            branch: "testBranch",
            octokit: new github.GitHub("testToken"),
            owner: "testOwner",
            repo: "testRepo",
            path: "testPath/testfile.txt",
            modifier: (value) => (value + "appended")
        };

        //const execMock = jest.spyOn(exec, "exec");
        await git.replaceRemoteFile(remoteFileReplaceOptions);

        // expect(execMock).toHaveBeenCalledTimes(5);
        // expect(execMock).toHaveBeenNthCalledWith(1, "docker login registry.com -u username -p pass");
        // expect(execMock).toHaveBeenNthCalledWith(2, "docker build --cache-from registry.com/imagepath/image:latest -t registry.com/imagepath/image:1000 test/dockerfile");
        // expect(execMock).toHaveBeenNthCalledWith(3, "docker tag registry.com/imagepath/image:1000 registry.com/imagepath/image:latest");
        // expect(execMock).toHaveBeenNthCalledWith(4, "docker push registry.com/imagepath/image:1000");
        // expect(execMock).toHaveBeenNthCalledWith(5, "docker push registry.com/imagepath/image:latest");
    })
})
