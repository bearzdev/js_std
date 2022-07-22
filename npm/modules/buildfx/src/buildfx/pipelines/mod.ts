import { env, join } from '../deps.js'

export function getArtifactsDirectory() {
    const azDoArtifacts = "BUILD_STAGINGDIRECTORY"
    const userEnv = "PROJECT_ARTIFACTS_DIR"

    let artifactsDir = env.get(userEnv)
    if (artifactsDir) {
        return artifactsDir;
    }

    artifactsDir = env.get(azDoArtifacts)
    if (artifactsDir) {
        env.set(userEnv, artifactsDir)
        return artifactsDir;
    }

    const root = getProjectRoot();
    if (root) {
        artifactsDir = join(root, "artifacts");
        env.set(userEnv, artifactsDir);

        return artifactsDir;
    }

    return undefined;
}

export function getProjectRoot() {
    const azDoSource = "BUILD_SOURCESDIRECTORY"
    const userEnv = "PROJECT_ROOT_DIR"

    let projectRoot = env.get(userEnv)
    if (projectRoot) {
        return projectRoot;
    }

    projectRoot = env.get(azDoSource)
    if (projectRoot) {
        env.set(userEnv, projectRoot)
        return projectRoot;
    }

    return undefined;
}