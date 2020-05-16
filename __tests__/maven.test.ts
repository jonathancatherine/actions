import * as maven from "../src/utils/maven";
import * as exec from "@actions/exec";
jest.mock("@actions/exec");

describe('buildAndPush tests', () => {
    it('all parameters', async () => {
        const dockerOptions: maven.MavenParameters = {
            options: "-B",
            mavenPomFile: "test/pom.xml",
            goals: "clean install",
            argument: "-nsu",
            skipTests: false,
            repoId: "repo",
            repoUsername: "usernametest",
            repoToken: "tokentest",
        };

        const execMock = jest.spyOn(exec, "exec");
        await maven.build(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(1);
        expect(execMock).toHaveBeenNthCalledWith(1, "mvn -B -s settings.xml -f test/pom.xml clean install -nsu -Drepo.id=repo -Drepo.username=usernametest -Drepo.token=tokentest");
    })

    it('skipTests', async () => {
        const dockerOptions: maven.MavenParameters = {
            options: "-B",
            mavenPomFile: "test/pom.xml",
            goals: "clean install",
            argument: "-nsu",
            skipTests: true
        };

        const execMock = jest.spyOn(exec, "exec");
        await maven.build(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(1);
        expect(execMock).toHaveBeenNthCalledWith(1, "mvn -B -f test/pom.xml clean install -nsu -DskipTests");
    })

    it('no option', async () => {
        const dockerOptions: maven.MavenParameters = {
            mavenPomFile: "test/pom.xml",
            goals: "clean install",
            argument: "-nsu",
            skipTests: true
        };

        const execMock = jest.spyOn(exec, "exec");
        await maven.build(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(1);
        expect(execMock).toHaveBeenNthCalledWith(1, "mvn -f test/pom.xml clean install -nsu -DskipTests");
    })


    it('no mavenPomFile', async () => {
        const dockerOptions: maven.MavenParameters = {
            goals: "clean install",
            argument: "-nsu",
            skipTests: true
        };

        const execMock = jest.spyOn(exec, "exec");
        await maven.build(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(1);
        expect(execMock).toHaveBeenNthCalledWith(1, "mvn clean install -nsu -DskipTests");
    })

    it('no argument', async () => {
        const dockerOptions: maven.MavenParameters = {
            goals: "clean install",
            skipTests: true
        };

        const execMock = jest.spyOn(exec, "exec");
        await maven.build(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(1);
        expect(execMock).toHaveBeenNthCalledWith(1, "mvn clean install -DskipTests");
    })

    it('no skipTests', async () => {
        const dockerOptions: maven.MavenParameters = {
            goals: "clean install"
        };

        const execMock = jest.spyOn(exec, "exec");
        await maven.build(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(1);
        expect(execMock).toHaveBeenNthCalledWith(1, "mvn clean install");
    })

    it('no pom file empty', async () => {
        const dockerOptions: maven.MavenParameters = {
            mavenPomFile: '',
            goals: "clean install"
        };

        const execMock = jest.spyOn(exec, "exec");
        await maven.build(dockerOptions);

        expect(execMock).toHaveBeenCalledTimes(1);
        expect(execMock).toHaveBeenNthCalledWith(1, "mvn clean install");
    })
})
