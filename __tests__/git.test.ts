import * as git from "../src/utils/git";
import * as github from "@actions/github";
jest.mock("@actions/github");

const mockHeader = {
    date: "",
    "x-ratelimit-limit": "",
    "x-ratelimit-remaining": "",
    "x-ratelimit-reset": "",
    "x-Octokit-request-id": "",
    "x-Octokit-media-type": "",
    link: "",
    "last-modified": "",
    etag: "",
    status: ""
};

const mockLinks = { self: "", git: "", html: "" };

describe('replaceRemoteFile tests', () => {
    it('simple', async () => {
        const octokit = new github.GitHub("testToken");
        const remoteFileModificationOptions: git.RemoteFileModificationOptions = {
            branch: "testBranch",
            octokit: octokit,
            owner: "testOwner",
            repo: "testRepo",
            path: "testPath/testfile.txt",

            modifier: (value) => (value + "appended"),
            message: "commit testPath/testfile.txt",
            committer: { name: "committerName", email: "committerEmail@email.com" }
        };

        const getContentsMock = jest.spyOn(octokit.repos, "getContents");
        const mockData = {
            _links: mockLinks,
            content: "dGVzdA==",
            download_url: null,
            git_url: "",
            html_url: "",
            name: "",
            path: "",
            sha: "shatest",
            size: 200,
            type: "",
            url: ""
        };

        getContentsMock.mockImplementation(function () {
            return Promise.resolve({
                data: mockData, status: 200, headers: mockHeader,
                [Symbol.iterator]() {
                    return {
                        next() {
                            return { value: null, done: true };
                        }
                    };
                }
            });
        });

        const createOrUpdateFileMock = jest.spyOn(octokit.repos, "createOrUpdateFile");
        await git.modifyGitFile(remoteFileModificationOptions);

        expect(createOrUpdateFileMock).toHaveBeenCalledTimes(1);
        expect(createOrUpdateFileMock).toHaveBeenNthCalledWith(1, {
            "author": remoteFileModificationOptions.committer,
            "branch": remoteFileModificationOptions.branch,
            "committer": remoteFileModificationOptions.committer,
            "content": "dGVzdGFwcGVuZGVk",
            "message": remoteFileModificationOptions.message,
            "owner": remoteFileModificationOptions.owner,
            "path": remoteFileModificationOptions.path,
            "repo": remoteFileModificationOptions.repo,
            "sha": mockData.sha,
        });
    })
})
