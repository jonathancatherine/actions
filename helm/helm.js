const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

(async () => {
    try {
        const githubToken = process.env.GITHUB_TOKEN;
        const octokit = new github.GitHub(githubToken);

        const owner = core.getInput('owner');
        const repo = core.getInput('repo');
        const ref = core.getInput('branch');



        const payload = JSON.stringify(github.context.payload, undefined, 2);
        console.log(`The event owner: ${owner}`);
        console.log(`The event repo: ${repo}`);
        console.log(`The event branch: ${ref}`);

        const ref2 = await octokit.git.getRef({ owner, repo, ref });

        //console.log(`Ref: ${ref}`);
    } catch (error) {
        core.setFailed(error.message);
    }
})();