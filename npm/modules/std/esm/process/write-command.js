import { secretMasker } from '../secrets/masker.js';
import { cyan } from '../fmt/colors.js';
export const writeCommandOptions = {
    enabled: true,
    masker: secretMasker,
};
export function writeCommand(fileName, args) {
    // write commands to the console to make it easier to follow along
    // with what is being executed
    if (!writeCommandOptions.enabled) {
        return;
    }
    const masker = writeCommandOptions.masker;
    let cmd = `${fileName} ${args.join(' ')}`;
    // mask any secrets written to the console
    cmd = masker.mask(cmd);
    // TODO: write to stdout instead of console
    // @p42-ignore-next-line
    console.log(cyan(cmd));
}
//# sourceMappingURL=write-command.js.map