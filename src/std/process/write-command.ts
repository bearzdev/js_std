import { secretMasker, ISecretMasker } from "../secrets/masker.ts";
import { cyan } from '../fmt/colors.ts';

export const writeCommandOptions = {
    enabled: true,
    masker: secretMasker as ISecretMasker,
}

export function writeCommand(fileName: string, args: string[]) {
    // write commands to the console to make it easier to follow along
    // with what is being executed
    if(!writeCommandOptions.enabled) {
        return;
    }

    const masker = writeCommandOptions.masker;
    let cmd = `${fileName} ${args.join(' ')}`;

    // mask any secrets written to the console
    cmd = masker.mask(cmd) as string;

    // TODO: write to stdout instead of console
    // @p42-ignore-next-line
    console.log(cyan(cmd));
}