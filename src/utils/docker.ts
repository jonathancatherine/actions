import * as exec from "@actions/exec";
export interface DockerOptions {
    dockerFile: string
    registryHost: string;
    registryUsername: string;
    registryPassword: string;
    dockerImage: string;
    tag: string;
}

export async function buildAndPush(options: DockerOptions): Promise<void> {
    const registryHost = options.registryHost;
    const dockerImage = options.dockerImage;
    const tag = options.tag;
    const registryUsername = options.registryUsername;
    const registryPassword = options.registryPassword;
    const dockerFile = options.dockerFile;

    const registry = `${registryHost}/${dockerImage}`;
    const tagBuild = `${registry}:${tag}`;
    const tagLatest = `${registry}:latest`;

    await exec.exec(`docker login ${registryHost} -u ${registryUsername} -p ${registryPassword}`);
    await exec.exec(`docker build --cache-from ${tagLatest} -t ${tagBuild} ${dockerFile}`);
    await exec.exec(`docker tag ${tagBuild} ${tagLatest}`);
    await exec.exec(`docker push ${tagBuild}`);
    await exec.exec(`docker push ${tagLatest}`);
}