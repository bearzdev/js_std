
import { Char } from '../primitives/char.ts';

enum Boundary {
    TokenStart = 0,
    WordEnd = 1,
    QuoteStart = 2,
    QuoteEnd = 3,
}
// based on System.CommandLine.ArgumentStringSplitter
export function splitArguments(value: string): string[] {
    let startTokenIndex = 0;
    let pos = 0;
    let seeking = Boundary.TokenStart;
    let seekingQuote = Boundary.QuoteStart;

    const advance = () => pos++;
    const indexOfEndToken = () => pos - startTokenIndex;
    const isEol = () => pos == value.length;

    const currentToken = () => value.slice(startTokenIndex, indexOfEndToken()).replace('"', '');

    const results: string[] = [];

    while (pos < value.length) {
        const c = value[pos];
        if (Char.isWhiteSpaceAt(value, pos)) {
            if (seekingQuote === Boundary.QuoteStart) {
                switch (seeking) {
                    case Boundary.WordEnd:
                        results.push(currentToken());
                        startTokenIndex = pos;
                        seekingQuote = Boundary.TokenStart;
                        break;

                    case Boundary.TokenStart:
                        startTokenIndex = pos;
                        break;
                }
            }
        } else if (c === '"') {
            if (seeking === Boundary.TokenStart) {
                switch (seekingQuote) {
                    case Boundary.QuoteEnd:
                        results.push(currentToken());
                        startTokenIndex = pos;
                        seekingQuote = Boundary.QuoteStart;
                        break;

                    case Boundary.QuoteStart:
                        startTokenIndex = pos + 1;
                        seekingQuote = Boundary.QuoteEnd;
                        break;
                }
            } else {
                switch (seekingQuote) {
                    case Boundary.QuoteEnd:
                        seekingQuote = Boundary.QuoteStart;
                        break;

                    case Boundary.QuoteStart:
                        seekingQuote = Boundary.QuoteEnd;
                        break;
                }
            }
        } else if (
            seeking === Boundary.TokenStart &&
            seekingQuote === Boundary.QuoteStart
        ) {
            seeking = Boundary.WordEnd;
            startTokenIndex = pos;
        }

        advance();
        if (isEol()) {
            switch (seeking) {
                case Boundary.TokenStart:
                    break;
                default:
                    results.push(currentToken());
                    break;
            }
        }
    }

    return results;
}