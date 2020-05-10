import * as docker from "../src/utils/docker";
import * as exec from "@actions/exec";
jest.mock("@actions/exec");

describe('buildAndPush tests', () => {
    it('simple', async () => {
        const dockerOptions: docker.DockerOptions = {
            dockerFileLocation: "test/dockerfile",
            dockerImage: "imagepath/image",
            registryHost: "registry.com",
            registryPassword: "pass",
            registryUsername: "username",
            tag: "1000",
            pushLatest: true
        };

        const execMock = jest.spyOn(exec, "exec");
        await docker.buildAndPush(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(5);
        expect(execMock).toHaveBeenNthCalledWith(1, "docker login registry.com -u username -p pass");
        expect(execMock).toHaveBeenNthCalledWith(2, "docker build --cache-from registry.com/imagepath/image:latest -t registry.com/imagepath/image:1000 test/dockerfile");
        expect(execMock).toHaveBeenNthCalledWith(3, "docker tag registry.com/imagepath/image:1000 registry.com/imagepath/image:latest");
        expect(execMock).toHaveBeenNthCalledWith(4, "docker push registry.com/imagepath/image:1000");
        expect(execMock).toHaveBeenNthCalledWith(5, "docker push registry.com/imagepath/image:latest");
    })

    it('buildx', async () => {
        const dockerOptions: docker.DockerOptions = {
            dockerFileLocation: "test/dockerfile",
            dockerImage: "imagepath/image",
            registryHost: "registry.com",
            registryPassword: "pass",
            registryUsername: "username",
            tag: "1000",
            buildx: true,
            pushLatest: true
        };

        const execMock = jest.spyOn(exec, "exec");
        await docker.buildAndPush(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(5);
        expect(execMock).toHaveBeenNthCalledWith(1, "docker login registry.com -u username -p pass");
        expect(execMock).toHaveBeenNthCalledWith(2, "docker buildx build --cache-from registry.com/imagepath/image:latest -t registry.com/imagepath/image:1000 test/dockerfile");
        expect(execMock).toHaveBeenNthCalledWith(3, "docker tag registry.com/imagepath/image:1000 registry.com/imagepath/image:latest");
        expect(execMock).toHaveBeenNthCalledWith(4, "docker push registry.com/imagepath/image:1000");
        expect(execMock).toHaveBeenNthCalledWith(5, "docker push registry.com/imagepath/image:latest");
    })

    it('no push latest', async () => {
        const dockerOptions: docker.DockerOptions = {
            dockerFileLocation: "test/dockerfile",
            dockerImage: "imagepath/image",
            registryHost: "registry.com",
            registryPassword: "pass",
            registryUsername: "username",
            tag: "1000",
            buildx: true,
            pushLatest: false
        };

        const execMock = jest.spyOn(exec, "exec");
        await docker.buildAndPush(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(4);
        expect(execMock).toHaveBeenNthCalledWith(1, "docker login registry.com -u username -p pass");
        expect(execMock).toHaveBeenNthCalledWith(2, "docker buildx build -t registry.com/imagepath/image:1000 test/dockerfile");
        expect(execMock).toHaveBeenNthCalledWith(3, "docker tag registry.com/imagepath/image:1000 registry.com/imagepath/image:latest");
        expect(execMock).toHaveBeenNthCalledWith(4, "docker push registry.com/imagepath/image:1000");
    })
})
