import * as docker from "./utils/docker";
import * as core from "@actions/core";
import * as maven from "./utils/maven";
import * as jib from "./utils/jib";
import * as github from "@actions/github";
import * as util from "./utils/util";
import * as git from "./utils/git";

export async function dockerBuild(tag: string): Promise<string> {
    const dockerFileLocation = core.getInput('dockerFileLocation');
    const dockerImage = core.getInput('dockerImage');
    const dockerRegistryHost = core.getInput('dockerRegistryHost');
    const dockerRegistryUsername = core.getInput('dockerRegistryUsername');
    const dockerRegistryPassword = core.getInput('dockerRegistryPassword');
    const dockerBuildx = core.getInput('dockerBuildx');
    const dockerPushLatest = core.getInput('dockerPushLatest');

    const dockerOptions: docker.DockerOptions = {
        dockerFileLocation: dockerFileLocation,
        dockerImage: dockerImage,
        registryHost: dockerRegistryHost,
        registryPassword: dockerRegistryPassword,
        registryUsername: dockerRegistryUsername,
        tag: tag,
        buildx: dockerBuildx === 'true',
        pushLatest: dockerPushLatest !== 'false',
    };

    return await docker.buildAndPush(dockerOptions);
}

export async function mavenBuild() {
    const mavenPomFile = core.getInput('mavenPomFile');
    const skipTests = core.getInput('mavenSkipTests');
    const goals = core.getInput('mavenGoals') || "clean install"
    const mavenRepoId = core.getInput('mavenRepoId');
    const mavenRepoUsername = core.getInput('mavenRepoUsername');
    const mavenRepoToken = core.getInput('mavenRepoToken');

    const mavenParameters: maven.MavenParameters = {
        options: "-B",
        mavenPomFile: mavenPomFile,
        argument: "-T 1C",
        goals: goals,
        skipTests: skipTests === 'true',
        repoId: mavenRepoId,
        repoUsername: mavenRepoUsername,
        repoToken: mavenRepoToken,
    };
    await maven.build(mavenParameters);
}

export async function jibBuild(tag: string): Promise<void> {
    const jibMavenPomFile = core.getInput('jibMavenPomFile');
    const dockerRegistryHost = core.getInput('dockerRegistryHost');
    const dockerImage = core.getInput('dockerImage');
    const dockerRegistryUsername = core.getInput('dockerRegistryUsername');
    const dockerRegistryPassword = core.getInput('dockerRegistryPassword');
    const jibFromImage = core.getInput('jibFromImage') || "adoptopenjdk/openjdk8-openj9:latest"

    const parameters: jib.JibParameters = {
        jibVersion: "2.8.0",
        mavenPomFile: jibMavenPomFile,
        fromImage: jibFromImage,
        registryHost: dockerRegistryHost,
        registryPassword: dockerRegistryPassword,
        registryUsername: dockerRegistryUsername,
        dockerImage: dockerImage,
        tag: tag
    };

    return await jib.build(parameters);
}

export async function gitOps(githubPayload: any, dockerTag: string): Promise<void> {
    const gitOpsType = core.getInput('gitOpsType', {required: true});
    const gitOpsOwner = core.getInput('gitOpsOwner', {required: true});
    const gitOpsRepo = core.getInput('gitOpsRepo', {required: true});
    const gitOpsBranch = core.getInput('gitOpsBranch', {required: true});
    const gitOpsFilePath = core.getInput('gitOpsFilePath', {required: true});
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
