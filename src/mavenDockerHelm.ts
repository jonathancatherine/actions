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

async function dockerBuild(tag: string): Promise<string> {
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
    return await docker.buildAndPush(dockerOptions);
}

async function run(): Promise<void> {
    try {
        const githubPayload = github.context.payload;
        const canadaTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        const dockerTagDate = util.getDateString((new Date(Date.now() - (new Date(canadaTime)).getTimezoneOffset() * 60000)));
        const dockerTag = `${dockerTagDate}-${githubPayload.after.substring(0, 7)}`;

        await mavenBuild();
        await dockerBuild(dockerTag);

        //const githubToken = process.env.GITHUB_TOKEN || "";
        //const octokit = new github.GitHub(githubToken);

        const headCommit = githubPayload.head_commit;


        const githubChangesCommentParameters: util.GithubChangesCommentParameters = {
            repository: githubPayload.repository?.full_name || "",
            changesUrl: githubPayload.compare,
            dockerTag: dockerTag
        };

        const comment = util.getGithubChangesComment(githubChangesCommentParameters);

        console.log(`${comment}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

export default run;

