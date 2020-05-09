import * as core from "@actions/core";
import * as github from "@actions/github";

async function run(): Promise<void> {
    try {
        const githubToken = process.env.GITHUB_TOKEN || "";
        const octokit = new github.GitHub(githubToken);

        const owner = core.getInput('owner');
        const repo = core.getInput('repo');
        const branch = core.getInput('branch');
        const filePath = core.getInput('filePath');



    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

export default run;
