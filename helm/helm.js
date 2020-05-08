const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

(async () => {
    try {
        const githubToken = process.env.GITHUB_TOKEN;
        const octokit = new github.GitHub(githubToken);

        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
    } catch (error) {
        core.setFailed(error.message);
    }
})();