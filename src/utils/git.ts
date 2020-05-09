import * as github from "@actions/github";
import * as util from "./util";
import * as webhooks from '@octokit/webhooks'

export interface RemoteFileModificationOptions {
    octokit: github.GitHub;
    owner: string
    repo: string
    branch: string;

    path: string;
    modifier: (string) => string;

    message: string;
    committer: { name: string, email: string }
}

export async function modifyGitFile(options: RemoteFileModificationOptions): Promise<void> {
    const octokit = options.octokit;
    const owner = options.owner;
    const path = options.path;
    const branch = options.branch;
    const repo = options.repo;
    const modifier = options.modifier;
    const message = options.message;
    const committer = options.committer;

    const { data } = await octokit.repos.getContents({ owner: owner, path: path, ref: branch, repo: repo });

    let fileSha;
    let fileOriginalContentString;
    if (!Array.isArray(data)) {
        fileSha = data.sha;
        if (data.content) {
            fileOriginalContentString = util.fromBase64Sring(data.content)
        }
    }

    const newContentBase64 = util.toBase64Sring(modifier(fileOriginalContentString))

    const replaceFile = await octokit.repos.createOrUpdateFile({
        owner: owner,
        repo: repo,
        path: path,
        message: message,
        content: newContentBase64,
        branch: branch,
        committer: { name: committer.name, email: committer.email },
        author: { name: committer.name, email: committer.email },
        sha: fileSha
    });
}