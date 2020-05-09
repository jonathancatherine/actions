const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

(async () => {
    try {
        const githubToken = process.env.GITHUB_TOKEN;
        const octokit = new github.GitHub(githubToken);

        const owner = core.getInput('owner');
        const repo = core.getInput('repo');
        const branch = core.getInput('branch');
        const filePath = core.getInput('filePath');

        const payload = JSON.stringify(github.context.payload, undefined, 2);

        // const reference = await octokit.git.getRef({ owner: owner, ref: `heads/${branch}`, repo: repo });
        // const refstr = JSON.stringify(reference.data.object.sha);
        // console.log(`Ref: ${refstr}`);

        const file = await octokit.repos.getContents({ owner: owner, path: filePath, ref: branch, repo: repo });
        const fileSha = file.data.sha;
        const fileOriginalContentBase64 = file.data.content;

        const fileOriginalContentBuffer = Buffer.from(fileOriginalContentBase64, 'base64');
        const fileOriginalContentString = fileOriginalContentBuffer.toString('utf8');

        var fileModifiedContentBuffer = Buffer.from(fileOriginalContentString + "appen1");
        var newContent = fileModifiedContentBuffer.toString('base64');


        // const replaceFile = await octokit.repos.createOrUpdateFile({
        //     owner: owner,
        //     repo: repo,
        //     path: "file.txt",
        //     message: "message",
        //     content: newContent,
        //     branch: "test",
        //     committer: { name: "Jonathan", email: "test@email.com" },
        //     author: { name: "Jonathan", email: "test@email.com" },
        //     sha: fileSha
        // });


    } catch (error) {
        core.setFailed(error.message);
    }
})();