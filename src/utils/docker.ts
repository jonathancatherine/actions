import * as exec from "@actions/exec";
export interface DockerOptions {
    dockerFileLocation: string
    registryHost: string;
    registryUsername: string;
    registryPassword: string;
    dockerImage: string;
    tag: string;
    buildx?: boolean;
    pushLatest: boolean;
}

export async function buildAndPush(options: DockerOptions): Promise<string> {
    const registryHost = options.registryHost;
    const dockerImage = options.dockerImage;
    const tag = options.tag;
    const registryUsername = options.registryUsername;
    const registryPassword = options.registryPassword;
    const dockerFileLocation = options.dockerFileLocation;
    const buildx = options.buildx ? ' buildx' : '';
    const pushLatest = options.pushLatest;

    const registry = `${registryHost}/${dockerImage}`;
    const tagBuild = `${registry}:${tag}`;
    const tagLatest = `${registry}:latest`;
    const cacheFrom = options.pushLatest ? ` --cache-from ${tagLatest}` : '';

    await exec.exec(`docker login ${registryHost} -u ${registryUsername} -p ${registryPassword}`);
    await exec.exec(`docker${buildx} build${cacheFrom} -t ${tagBuild} ${dockerFileLocation}`);
    await exec.exec(`docker tag ${tagBuild} ${tagLatest}`);
    await exec.exec(`docker push ${tagBuild}`);

    if (pushLatest) {
        await exec.exec(`docker push ${tagLatest}`);
    }



    let output = '';

    const opts = {
        listeners: {
            stdout: (data: Buffer) => {
                output += data.toString();
            }
        }
    };

    //await exec.exec(`docker inspect --format='{{index .RepoDigests 0}}' ${tagLatest}`, [], opts);
    return output;
}