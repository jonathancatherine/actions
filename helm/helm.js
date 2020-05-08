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


        const payload = JSON.stringify(github.context.payload, undefined, 2);
        console.log(`The event owner: ${owner}`);
        console.log(`The event repo: ${repo}`);
        console.log(`The event branch: ${branch}`);

        const reference = await octokit.git.getRef({ owner: owner, ref: branch, repo: repo });

        const refstr = JSON.stringify(reference.data.object.sha);

        console.log(`Ref: ${refstr}`);

        // var b = Buffer.from("dfgdfgdfg")
        // var content = b.toString('base64');

        const file = await octokit.repos.getContents({ owner: owner, ref: "test", repo: repo, path: "file.txt" });
        //const filestr = JSON.stringify(file);
        //console.log(`Ref: ${filestr}`);

        // const replaceFile = await octokit.repos.createOrUpdateFile({
        //     owner: owner,
        //     repo: repo,
        //     path: "file.txt",
        //     message: "message",
        //     content: "dmdkZmdkZmc=",
        //     branch: "test",
        //     committer: { name: "Jonathan", email: "test@email.com" },
        //     author: { name: "Jonathan", email: "test@email.com" },
        //     sha: reference.data.object.sha
        // });


    } catch (error) {
        core.setFailed(error.message);
    }
})();