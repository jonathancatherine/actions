import * as core from "@actions/core";
import * as github from "@actions/github";
import * as maven from "../src/utils/maven";
import * as docker from "../src/utils/docker";
import * as util from "../src/utils/util";

async function mavenBuild() {
    const mavenPomFile = core.getInput('mavenPomFile');
    const skipTests = core.getInput('skipTests');

    const mavenParameters: maven.MavenParameters = {
        options: "-B",
        mavenPomFile: mavenPomFile,
        goals: "clean package",
        skipTests: skipTests === 'true'
    };
    await maven.build(mavenParameters);
}

async function dockerBuild(tag: string) {
    const dockerFileLocation = core.getInput('dockerFileLocation');
    const dockerImage = core.getInput('dockerImage');
    const registryHost = core.getInput('registryHost');
    const registryUsername = core.getInput('registryUsername');
    const registryPassword = core.getInput('registryPassword');

    const dockerOptions: docker.DockerOptions = {
        dockerFileLocation: dockerFileLocation,
        dockerImage: dockerImage,
        registryHost: registryHost,
        registryPassword: registryPassword,
        registryUsername: registryUsername,
        tag: tag
    };
    await docker.buildAndPush(dockerOptions);
}

async function run(): Promise<void> {
    try {
        const githubPayload = github.context.payload;
        //await mavenBuild();
        //await dockerBuild("sdfsdfs");



        //const githubToken = process.env.GITHUB_TOKEN || "";
        //const octokit = new github.GitHub(githubToken);

        const headCommit = githubPayload.head_commit;

        const dockerTagDate = util.getDateString((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)));
        const dockerTag = dockerTagDate + githubPayload.after.substring(0, 7);

        const dockerOptions: util.GithubChangesCommentParameters = {
            repository: githubPayload.repository?.full_name || "",
            changesUrl: githubPayload.compare,
            dockerTag: dockerTag,
            dockerImageDigest: "testdigest"
        };

        const comment = util.getGithubChangesComment(dockerOptions);


        console.log(`The event payload: ${comment}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

export default run;

