const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');
const yaml = require('yaml');
import { setValueInObject } from './yamltest';


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

        const parsedYaml = yaml.parse(fileOriginalContentString);

        setValueInObject(parsedYaml, "spec.values.image.tag", fileSha)

        const yamlAsString = yaml.stringify(parsedYaml);

        var fileModifiedContentBuffer = Buffer.from(yamlAsString);
        var newContentBase64 = fileModifiedContentBuffer.toString('base64');
        console.log(`${newContentBase64}`);

        const replaceFile = await octokit.repos.createOrUpdateFile({
            owner: owner,
            repo: repo,
            path: filePath,
            message: "message",
            content: newContentBase64,
            branch: branch,
            committer: { name: "Jonathan", email: "test@email.com" },
            author: { name: "Jonathan", email: "test@email.com" },
            sha: fileSha
        });


    } catch (error) {
        core.setFailed(error.message);
    }
})();