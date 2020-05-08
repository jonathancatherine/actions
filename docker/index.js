const core = require('@actions/core');
const exec = require('@actions/exec');

(async () => {
    try {
        const directory = core.getInput('directory');
        const registryHost = core.getInput('registryHost');
        const registryPath = core.getInput('registryPath');
        const dockerImageName = core.getInput('dockerImageName');
        const registryUsername = core.getInput('registryUsername');
        const registryPassword = core.getInput('registryPassword');

        const registry = `${registryHost}/${registryPath}/${dockerImageName}`;

        const tag = Math.round(Math.random() * 10);
        const tagBuild = `${registry}:${tag}`;
        const tagLatest = `${registry}:latest`;

        await exec.exec(`docker login ${registryHost} -u ${registryUsername} -p ${registryPassword}`);
        await exec.exec(`docker build --cache-from ${tagLatest} -t ${tagBuild} ${directory}`);
        await exec.exec(`docker tag ${tagBuild} ${tagLatest}`);
        await exec.exec(`docker push ${tagBuild}`);
        await exec.exec(`docker push ${tagLatest}`);
    } catch (error) {
        core.setFailed(error.message);
    }
})();