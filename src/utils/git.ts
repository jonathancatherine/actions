import * as github from "@actions/github";
import * as util from "./util";
import * as webhooks from '@octokit/webhooks'

export interface RemoteFileReplaceOptions {
    octokit: github.GitHub;
    owner: string
    repo: string
    branch: string;

    path: string;
    modifier: (string) => string;
}

export async function replaceRemoteFile(options: RemoteFileReplaceOptions): Promise<void> {
    const octokit = options.octokit;
    const owner = options.owner;
    const path = options.path;
    const branch = options.branch;
    const repo = options.repo;

    const { data } = await octokit.repos.getContents({ owner: owner, path: path, ref: branch, repo: repo });

    let fileSha;
    let fileOriginalContentString;
    if (!Array.isArray(data)) {
        fileSha = data.sha;
        if (data.content) {
            fileOriginalContentString = util.fromBase64Sring(data.content)
        }
    }

    const yamlAsString = options.modifier(fileOriginalContentString);
    const newContentBase64 = util.toBase64Sring(yamlAsString)

    const replaceFile = await octokit.repos.createOrUpdateFile({
        owner: owner,
        repo: repo,
        path: path,
        message: "message",
        content: newContentBase64,
        branch: branch,
        committer: { name: "Jonathan", email: "test@email.com" },
        author: { name: "Jonathan", email: "test@email.com" },
        sha: fileSha
    });
}