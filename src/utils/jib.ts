import * as exec from "@actions/exec";

export interface JibParameters {
    jibVersion: string;
    mavenPomFile?: string;
    fromImage: string;
    registryHost: string;
    registryUsername: string;
    registryPassword: string;
    dockerImage: string;
    tag: string;
}

export async function build(params: JibParameters): Promise<void> {
    const jibVersion = params.jibVersion;
    const mavenPomFile = params.mavenPomFile ? ' -f ' + params.mavenPomFile : '';

    const registryHost = params.registryHost;
    const dockerImage = params.dockerImage;
    const tag = params.tag;
    const registryUsername = params.registryUsername;
    const registryPassword = params.registryPassword;
    const fromImage = params.fromImage;

    const registry = `${registryHost}/${dockerImage}`;

    await exec.exec(`mvn com.google.cloud.tools:jib-maven-plugin:${jibVersion}:build${mavenPomFile} \
-Djdk.nativeCrypto=false \
-Djib.to.tags=${tag} \
-Djib.to.image=${registry} \
-Djib.to.auth.username=${registryUsername} \
-Djib.to.auth.password=${registryPassword} \
-Djib.from.image=${fromImage}`);
}