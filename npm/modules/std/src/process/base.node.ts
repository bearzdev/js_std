import { StopWatch } from "../diagnostics/stop-watch.js";
import  { processRunner } from './base.js';
import type { IProcessInvocationContext, IProcessResult } from "./interfaces.js";
import { ProcessResult } from "./start-info.js";
import { writeCommand } from './write-command.js';
import * as child_process from "child_process";
import { TimeoutError } from "../errors/errors.js";
import { notNullOrWhiteSpace } from "../errors/check.js";

processRunner.run = (context: IProcessInvocationContext): IProcessResult => {
// deno doesn't currently have a polyfill for child_process.spawnSync
        // however, the import above should be translated by deno dnt to import { child_process } from "child_process";
        // deno-lint-ignore no-explicit-any
        const cpa = child_process as any;
        let timeout = context.timeout;

        // node doesn't support AbortSignal, so use the timeout value if available.
        if(context.signal) {
            const sig = context.signal as AbortSignal & { canBeCancelled: boolean, timeout: number | undefined }
            if(sig.timeout) {
                timeout = sig.timeout;
            }
        }

        const si = context.startInfo;
        notNullOrWhiteSpace(si.fileName, 'fileName');
        si.args = si.args || [];
        const stdoutType = context.outCaptures.length > 0 ? 'pipe' : 'inherit';
        const stderrType = context.errorCaptures.length > 0 ? 'pipe' : 'inherit';
        const { outCaptures, errorCaptures } = context;
        const stopWatch = new StopWatch();
        writeCommand(si.fileName, si.args);
        stopWatch.start();


        const process = cpa.spawnSync(si.fileName, si.args, {
            cwd: si.workingDirectory,
            env: si.env,
            timeout: timeout,
            stdio: ['inherit', stdoutType, stderrType],
            uid: si.userId,
            gid: si.groupId,
        });

        stopWatch.stop();

        if (stdoutType === 'pipe' && process.stdout) {
            outCaptures.forEach((capture) => {
                if(context.signal && context.signal.aborted)
                    context.signal.throwIfAborted();

                capture.write(process.stdout);
                capture.dispose();
            });
        }

        if (stderrType === 'pipe') {
            errorCaptures.forEach((capture) => {
                if(context.signal && context.signal.aborted)
                    context.signal.throwIfAborted();

                capture.write(process.stderr);
                capture.dispose();
            });
        }

        return new ProcessResult({
            exitCode: typeof(process.status) ===  'undefined' ? 1 : process.status, // if undefined, something went wrong, set to 1
            args: si.args,
            fileName: si.fileName,
            standardError: [],
            standardOut: [],
            startedAt: stopWatch.at(0)?.startTime,
            stoppedAt: stopWatch.at(0)?.endTime,
        });
};

processRunner.runAsync = (context: IProcessInvocationContext): Promise<IProcessResult> => {
    return new Promise<ProcessResult>((resolve, reject) => {

        const si = context.startInfo;
        notNullOrWhiteSpace(si.fileName, 'fileName');
        si.args = si.args || [];
        const stdoutType = context.outCaptures.length > 0 ? 'pipe' : 'inherit';
        const stderrType = context.errorCaptures.length > 0 ? 'pipe' : 'inherit';
        const { outCaptures, errorCaptures } = context;
        const stopWatch = new StopWatch();

        try {

            writeCommand(si.fileName, si.args);
            stopWatch.start();
            const process = child_process.spawn(si.fileName, si.args, {
                cwd: si.workingDirectory,
                env: si.env,
                stdio: ['inherit', stdoutType, stderrType],
                uid: si.userId,
                gid: si.groupId,
            })

            if (context.signal) {
                const sig = context.signal as AbortSignal & { canBeCancelled: boolean, timeout: number | undefined }
                const timeout = sig.timeout;

                context.signal.onabort = () => {
                    process.kill();
                    if(timeout) {
                        throw new TimeoutError(`Process timed out after ${timeout}ms`);
                    }
                    context.signal?.throwIfAborted();
                }
            }

            process.stdout?.on('data', (data) => {
                outCaptures.forEach((capture) => {
                    capture.write(data);
                });
            });

            process.stdout?.on('end', () => {
                outCaptures.forEach((capture) => {
                    capture.dispose();
                });
            });

            process.stderr?.on('data', (data) => {
                errorCaptures.forEach((capture) => {
                    capture.write(data);
                });
            });

            process.stderr?.on('end', () => {
                errorCaptures.forEach((capture) => {
                    capture.dispose();
                });
            });

           process.on('exit', (_) => {
                stopWatch.stop();
                let ec = process.exitCode;
                if(ec === null || ec === undefined)
                    ec = 0; // default to 1?

                const result = new ProcessResult({
                    exitCode: ec,
                    args: si.args,
                    fileName: si.fileName,
                    standardError: [],
                    standardOut: [],
                    startedAt: stopWatch.at(0)?.startTime,
                    stoppedAt: stopWatch.at(0)?.endTime,
                });

                resolve(result);
            });
        } catch (e) {
            reject(e);
        }
    });
}

export { processRunner };