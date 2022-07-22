import { isWindows, run } from '../deps.ts';

let isUserAdminProcess: boolean | undefined = undefined;
let isRootAdminProcess: boolean | undefined = undefined;

export function isAdmin() {
    if (!isWindows) {
        return false;
    }

    if (isUserAdminProcess === undefined) {
        const result = run('net', ['session'], {
            exitCodeValidator: (_) => {
                return true;
            },
        });

        // net session returns 2 if the user is not an admin
        isUserAdminProcess = result.exitCode === 0;
    }
    return isUserAdminProcess;
}

export function isRoot() {
    if (isWindows) {
        return false;
    }

    if (isRootAdminProcess === undefined) {
        let result = run('id', ['-u'], {
            capture: true,
        });

        isRootAdminProcess = result.standardOut && result.standardOut.length > 0 && result.standardOut[0] === '0';

        if (!isRootAdminProcess) {
            result = run('id', ['-g'], {
                capture: true,
            });

            isRootAdminProcess = result.standardOut && result.standardOut.length > 0 && result.standardOut[0] === '0';
        }
    }

    return isRootAdminProcess;
}

export function isProcessElevated() {
    if (isWindows) {
        return isAdmin();
    }

    return isRoot();
}
