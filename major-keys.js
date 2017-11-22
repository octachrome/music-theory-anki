const FIFTHS = [
    'Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'
];

const FIELD_DEFS = {
    MajorName: idx => `${FIFTHS[idx]}`,
    RelMinorName: idx => `${FIFTHS[idx + 3]}`,
    Signature: idx => `<img src="${FIFTHS[idx]}_sig.png">`,
    Major_V: idx => `${FIFTHS[idx + 1]}`,
    Major_IV: idx => `${FIFTHS[idx - 1]}`,
    Minor_ii: idx => `${FIFTHS[idx + 2]}`,
    Minor_iii: idx => `${FIFTHS[idx + 4]}`
}

const fields = Object.keys(FIELD_DEFS);
console.log('Fields required by note type:\n  ' + fields.join('\n  '));

const lines = [];

for (let i = 1; i <= 13; i++) {
    let line = '';
    for (let field of fields) {
        if (line) {
            line += '; ';
        }
        line += FIELD_DEFS[field](i);
    }
    lines.push(line);
}

const stream = require('fs').createWriteStream('major-keys.txt');
stream.write('# ' + fields.join('; ') + '\n');
stream.write(lines.join('\n') + '\n');
stream.end();
