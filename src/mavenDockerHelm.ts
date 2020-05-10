import * as core from "@actions/core";
import * as github from "@actions/github";
import * as maven from "../src/utils/maven";
import * as docker from "../src/utils/docker";
import * as util from "../src/utils/util";
import * as git from "../src/utils/git";

async function mavenBuild() {
    const mavenPomFile = core.getInput('mavenPomFile');
    const skipTests = core.getInput('mavenSkipTests');

    const mavenParameters: maven.MavenParameters = {
        options: "-B",
        mavenPomFile: mavenPomFile,
        goals: "clean package",
        skipTests: skipTests === 'true'
    };
    await maven.build(mavenParameters);
}

async function dockerBuild(tag: string): Promise<string> {
    const dockerFileLocation = core.getInput('dockerFileLocation');
    const dockerImage = core.getInput('dockerImage');
    const dockerRegistryHost = core.getInput('dockerRegistryHost');
    const dockerRegistryUsername = core.getInput('dockerRegistryUsername');
    const dockerRegistryPassword = core.getInput('dockerRegistryPassword');

    const dockerOptions: docker.DockerOptions = {
        dockerFileLocation: dockerFileLocation,
        dockerImage: dockerImage,
        registryHost: dockerRegistryHost,
        registryPassword: dockerRegistryPassword,
        registryUsername: dockerRegistryUsername,
        tag: tag
    };
    return await docker.buildAndPush(dockerOptions);
}

async function run(): Promise<void> {
    try {
        const githubPayload = github.context.payload;
        const canadaTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        const dockerTagDate = util.getDateString((new Date(Date.now() - (new Date(canadaTime)).getTimezoneOffset() * 60000)));
        const dockerTag = `${dockerTagDate}-${githubPayload.after.substring(0, 7)}`;

        //await mavenBuild();
        //await dockerBuild(dockerTag);

        const githubChangesCommentParameters: util.GithubChangesCommentParameters = {
            repository: githubPayload.repository?.full_name || "",
            changesUrl: githubPayload.compare,
            dockerTag: dockerTag
        };

        const comment = util.getGithubChangesComment(githubChangesCommentParameters);

        const gitOpsOwner = core.getInput('gitOpsOwner');
        const gitOpsRepo = core.getInput('gitOpsRepo');
        const gitOpsBranch = core.getInput('gitOpsBranch');
        const gitOpsFilePath = core.getInput('gitOpsFilePath');

        const githubToken = process.env.GITHUB_TOKEN || core.getInput('gitToken');
        const octokit = new github.GitHub(githubToken);



        const remoteFileModificationOptions: git.RemoteFileModificationOptions = {
            branch: gitOpsBranch,
            octokit: octokit,
            owner: gitOpsOwner,
            repo: gitOpsRepo,
            path: gitOpsFilePath,

            modifier: value => util.replaceValueInYamlString(value, "spec.values.image.tag", dockerTag),
            message: comment,
            committer: githubPayload.pusher
        };

        await git.modifyGitFile(remoteFileModificationOptions);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

export default run;

