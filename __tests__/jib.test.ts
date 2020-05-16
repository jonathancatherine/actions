import * as jib from "../src/utils/jib";
import * as exec from "@actions/exec";
jest.mock("@actions/exec");

describe('buildAndPush tests', () => {
    it('all parameters', async () => {
        const dockerOptions: jib.JibParameters = {
            jibVersion: "2.2.0",
            mavenPomFile: "test/pom.xml",
            fromImage: "openjdk",
            registryHost: "registry.com",
            registryPassword: "pass",
            registryUsername: "username",
            dockerImage: "imagepath/image",
            tag: "1000"
        };

        const execMock = jest.spyOn(exec, "exec");
        await jib.build(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(1);
        expect(execMock).toHaveBeenNthCalledWith(1, `mvn com.google.cloud.tools:jib-maven-plugin:2.2.0:build -f test/pom.xml \
-Djdk.nativeCrypto=false \
-Djib.to.tags=1000 \
-Djib.to.image=registry.com/imagepath/image \
-Djib.to.auth.username=username \
-Djib.to.auth.password=pass \
-Djib.from.image=openjdk`);
    })

    it('no mavenPomFile', async () => {
        const dockerOptions: jib.JibParameters = {
            jibVersion: "2.2.0",
            fromImage: "openjdk",
            registryHost: "registry.com",
            registryPassword: "pass",
            registryUsername: "username",
            dockerImage: "imagepath/image",
            tag: "1000"
        };

        const execMock = jest.spyOn(exec, "exec");
        await jib.build(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(1);
        expect(execMock).toHaveBeenNthCalledWith(1, `mvn com.google.cloud.tools:jib-maven-plugin:2.2.0:build \
-Djdk.nativeCrypto=false \
-Djib.to.tags=1000 \
-Djib.to.image=registry.com/imagepath/image \
-Djib.to.auth.username=username \
-Djib.to.auth.password=pass \
-Djib.from.image=openjdk`);
    })
})
