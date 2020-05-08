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
        //console.log(`The event payload: ${payload}`);

        const ref = await octokit.git.getRef({ owner, repo, branch });

        console.log(`Ref: ${ref}`);
    } catch (error) {
        core.setFailed(error.message);
    }
})();