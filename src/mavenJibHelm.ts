import * as core from "@actions/core";
import * as github from "@actions/github";
import * as maven from "./utils/maven";
import * as jib from "./utils/jib";
import * as util from "./utils/util";
import * as git from "./utils/git";

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

async function jibBuild(tag: string): Promise<void> {
    const jibMavenPomFile = core.getInput('jibMavenPomFile');
    const dockerRegistryHost = core.getInput('dockerRegistryHost');
    const dockerImage = core.getInput('dockerImage');
    const dockerRegistryUsername = core.getInput('dockerRegistryUsername');
    const dockerRegistryPassword = core.getInput('dockerRegistryPassword');

    const parameters: jib.JibParameters = {
        jibVersion: "2.2.0",
        mavenPomFile: jibMavenPomFile,
        fromImage: "adoptopenjdk/openjdk8-openj9:latest",
        registryHost: dockerRegistryHost,
        registryPassword: dockerRegistryPassword,
        registryUsername: dockerRegistryUsername,
        dockerImage: dockerImage,
        tag: tag
    };

    return await jib.build(parameters);
}


async function gitOps(githubPayload: any, dockerTag: string): Promise<void> {
    const gitOpsType = core.getInput('gitOpsType', { required: true });
    const gitOpsOwner = core.getInput('gitOpsOwner', { required: true });
    const gitOpsRepo = core.getInput('gitOpsRepo', { required: true });
    const gitOpsBranch = core.getInput('gitOpsBranch', { required: true });
    const gitOpsFilePath = core.getInput('gitOpsFilePath', { required: true });
    const gitHubToken = process.env.GITHUB_TOKEN || core.getInput('gitToken');
    const octokit = new github.GitHub(gitHubToken);
    const dockerImage = core.getInput('dockerImage');
    const dockerRegistryHost = core.getInput('dockerRegistryHost');
    const dockerImageRepository = `${dockerRegistryHost}/${dockerImage}`;

    const githubChangesCommentParameters: util.GithubChangesCommentParameters = {
        repository: githubPayload.repository?.full_name || "",
        changesUrl: githubPayload.compare,
        dockerTag: dockerTag
    };

    const comment = util.getGithubChangesComment(githubChangesCommentParameters);
    let modifierFunction;

    if (gitOpsType === 'HelmRelease') {
        modifierFunction = value => {
            const valueWithTag = util.replaceValueInYamlString(value, "spec.values.image.tag", dockerTag);
            const finalValue = util.replaceValueInYamlString(valueWithTag, "spec.values.image.repository", dockerImageRepository);
            return finalValue;
        };
    }


    if (gitOpsType === 'Application') {
        modifierFunction = value => {
            const valueWithTag = util.replaceValueInYamlString(value, "spec.source.helm.parameters[1].value", dockerTag);
            const finalValue = util.replaceValueInYamlString(valueWithTag, "spec.source.helm.parameters[0].value", dockerImageRepository);
            return finalValue;
        };
    }

    const remoteFileModificationOptions: git.RemoteFileModificationOptions = {
        branch: gitOpsBranch,
        octokit: octokit,
        owner: gitOpsOwner,
        repo: gitOpsRepo,
        path: gitOpsFilePath,
        modifier: modifierFunction,
        message: comment,
        committer: githubPayload.pusher
    };

    await git.modifyGitFile(remoteFileModificationOptions);
}

async function run(): Promise<void> {
    try {
        const githubPayload = github.context.payload;
        const canadaTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        const dockerTagDate = util.getDateString((new Date(Date.now() - (new Date(canadaTime)).getTimezoneOffset() * 60000)));
        const dockerTag = `${dockerTagDate}-${githubPayload.after.substring(0, 7)}`;

        await mavenBuild();
        await jibBuild(dockerTag);
        await gitOps(githubPayload, dockerTag);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

export default run;

