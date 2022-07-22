import { test } from '../testing/mod.ts';
import { Char } from './char.ts';

const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const digits = '0123456789';
const whitespace = ' \t\n\r\f\v';
const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
const control =
    '\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000A\u000B\u000C\u000D\u000E\u000F\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001A\u001B\u001C\u001D\u001E\u001F';

test('Char.isLetterCodePoint', (assert) => {
    for (let i = 0; i < lowerLetters.length; i++) {
        const code = lowerLetters.codePointAt(i);
        if (code === undefined) {
            continue;
        }
        assert.true(Char.isLetterCodePoint(code));
    }

    for (let i = 0; i < upperLetters.length; i++) {
        const code = upperLetters.codePointAt(i);
        if (code === undefined) {
            continue;
        }
        assert.true(Char.isLetterCodePoint(code));
    }

    for (let i = 0; i < digits.length; i++) {
        const code = digits.codePointAt(i);
        if (code === undefined) {
            continue;
        }
        assert.false(Char.isLetterCodePoint(code));
    }

    for (let i = 0; i < whitespace.length; i++) {
        const code = whitespace.codePointAt(i);
        if (code === undefined) {
            continue;
        }
        assert.false(Char.isLetterCodePoint(code));
    }

    for (let i = 0; i < punctuation.length; i++) {
        const code = punctuation.codePointAt(i);
        if (code === undefined) {
            continue;
        }
        assert.false(Char.isLetterCodePoint(code));
    }

    for (let i = 0; i < control.length; i++) {
        const code = control.codePointAt(i);
        if (code === undefined) {
            continue;
        }
        assert.false(Char.isLetterCodePoint(code));
    }
});
