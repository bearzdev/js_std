interface UaInfo {
    brands: Array<{ brand: string; version: string }>;
    comments: Array<Array<string>>;
}

export function getUserAgentInfo(ua: string) {
    const lowered = ua.toLowerCase();
    const comments = [];
    const products = [];
    let platformSegments = [];
    let token = '';

    enum Boundary {
        Comment,
        Word,
    }

    let boundary = Boundary.Word;

    for (let i = 0; i < lowered.length; i++) {
        const c = lowered[i];

        if (boundary === Boundary.Word) {
            if (c === '(') {
                boundary = Boundary.Comment;
                continue;
            }

            if (c === ' ') {
                if (token.length > 0) {
                    const tokens = token.split('/');
                    products.push({ brand: tokens[0], version: tokens[1] });
                }

                token = '';
                continue;
            }

            token += c;
            continue;
        } else {
            if (c === ')') {
                boundary = Boundary.Word;
                if (token.length > 0) {
                    platformSegments.push(token);
                }
                token = '';
                comments.push(platformSegments);
                platformSegments = [];
                continue;
            }

            if (c === ';') {
                platformSegments.push(token);
                token = '';
                continue;
            }

            token += c;
        }
    }

    if (token.length > 0) {
        if (boundary === Boundary.Comment) {
            platformSegments.push(token);
            comments.push(platformSegments);
            token = '';
        } else {
            const tokens = token.split('/');
            let version = tokens[1];
            if (!version) {
                version = '0';
            }
            if (version.includes('.')) {
                version = version.substring(0, version.indexOf('.'));
            }
            products.push({ brand: tokens[0], version: version });
        }
    }

    return {
        brands: products,
        comments: comments,
    };
}
