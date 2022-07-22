import { StopWatch } from '../diagnostics/stop-watch.ts';
import { notNullOrWhiteSpace } from '../errors/check.ts';
import { processRunner } from './base.ts';
import type { IProcessInvocationContext, IProcessResult } from './interfaces.ts';
import { ProcessResult } from './start-info.ts';
import { writeCommand } from './write-command.ts';

processRunner.run = (context: IProcessInvocationContext): IProcessResult => {
    const si = context.startInfo;
    notNullOrWhiteSpace(si.fileName, 'startInfo.fileName');
    si.args = si.args || [];
    const stdoutType = context.outCaptures.length > 0 ? 'piped' : 'inherit';
    const stderrType = context.errorCaptures.length > 0 ? 'piped' : 'inherit';
    const stopWatch = new StopWatch();

    const { outCaptures, errorCaptures } = context;
    if (si.outCaptures) {
        outCaptures.push(...si.outCaptures);
    }

    if (si.errorCaptures) {
        errorCaptures.push(...si.errorCaptures);
    }

    writeCommand(si.fileName, si.args);
    stopWatch.start();
    const { stdout, stderr, status } = Deno.spawnSync(si.fileName, {
        args: si.args,
        env: si.env,
        cwd: si.workingDirectory,
        uid: si.userId,
        gid: si.groupId,
        signal: context.signal,
        stdout: stdoutType,
        stderr: stderrType,
    });
    stopWatch.stop();

    if (stdoutType === 'piped') {
        outCaptures.forEach((capture) => {
            capture.write(stdout);
            capture.dispose();
        });
    }

    if (stderrType === 'piped') {
        errorCaptures.forEach((capture) => {
            capture.write(stderr);
            capture.dispose();
        });
    }

    return new ProcessResult({
        exitCode: status.code,
        args: si.args,
        fileName: si.fileName,
        standardError: [],
        standardOut: [],
        startedAt: stopWatch.at(0)?.startTime,
        stoppedAt: stopWatch.at(0)?.endTime,
    });
};

processRunner.runAsync = async (context: IProcessInvocationContext): Promise<IProcessResult> => {
    const si = context.startInfo;
    notNullOrWhiteSpace(si.fileName, 'startInfo.fileName');
    si.args = si.args || [];
    const stdoutType = context.outCaptures.length > 0 ? 'piped' : 'inherit';
    const stderrType = context.errorCaptures.length > 0 ? 'piped' : 'inherit';
    const { outCaptures, errorCaptures } = context;

    const stopWatch = new StopWatch();

    writeCommand(si.fileName, si.args);
    stopWatch.start();

    const process = Deno.run({
        cmd: [si.fileName, ...si.args],
        env: si.env,
        cwd: si.workingDirectory,
        uid: si.userId,
        gid: si.groupId,
        stdout: stdoutType,
        stderr: stderrType,
    });

    const read = async () => {
        const buffer = new Uint8Array(1024);
        if (stdoutType === 'piped' && process.stdout) {
            let bytesRead: number | null = await process.stdout.read(
                buffer,
            );
            while (bytesRead !== null) {
                outCaptures.forEach((capture) => {
                    if (bytesRead === null) {
                        return;
                    }

                    capture.write(buffer.subarray(0, bytesRead));
                });
                bytesRead = await process.stdout.read(buffer);
            }

            outCaptures.forEach((capture) => {
                capture.dispose();
            });
        }
    };

    const readError = async () => {
        const buffer = new Uint8Array(1024);
        if (stderrType === 'piped' && process.stderr) {
            let bytesRead: number | null = await process.stderr.read(
                buffer,
            );
            while (bytesRead !== null) {
                errorCaptures.forEach((capture) => {
                    if (bytesRead === null) {
                        return;
                    }

                    capture.write(buffer.subarray(0, bytesRead));
                });
                bytesRead = await process.stderr.read(buffer);
            }

            errorCaptures.forEach((capture) => {
                capture.dispose();
            });
        }
    };

    const status = await process.status();
    stopWatch.stop();

    await Promise.all([process.status(), read(), readError()]);

    return new ProcessResult({
        exitCode: status.code,
        args: si.args,
        fileName: si.fileName,
        standardError: [],
        standardOut: [],
        startedAt: stopWatch.at(0)?.startTime,
        stoppedAt: stopWatch.at(0)?.endTime,
    });
};

export { processRunner };
