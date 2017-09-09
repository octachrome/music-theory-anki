const FIFTHS = [
    'Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'E#'
];

const FIELD_DEFS = {
    MajorName: idx => `${FIFTHS[idx]}`,
    RelMinorName: idx => `${FIFTHS[idx + 3]}`,
    Signature: idx => `<img src="${FIFTHS[idx]}_sig.png">`
}

const fields = Object.keys(FIELD_DEFS);
console.log('Fields required by note type:\n  ' + fields.join('\n  '));

const lines = [];

for (let i = 1; i < FIFTHS.length - 5; i++) {
    let line = '';
    for (let field of fields) {
        if (line) {
            line += '; ';
        }
        line += FIELD_DEFS[field](i);
    }
    lines.push(line);
}

const stream = require('fs').createWriteStream('import-file.txt');
stream.write('# ' + fields.join('; ') + '\n');
stream.write(lines.join('\n') + '\n');
stream.end();

/*
    let notes = [];
    for (let j = 0; j < 7; j++) {
        notes.push(FIFTHS[i + (j * 2 + 1) % 7 - 1]);
    }
    console.log(`${FIFTHS[i]} major \t${FIFTHS[i + 3]} minor \t${notes.join(' ')}`);
    console.log(`  I   ${FIFTHS[i]} major`);
    console.log(`  ii  ${FIFTHS[i + 2]} minor`);
    console.log(`  iii ${FIFTHS[i + 4]} minor`);
    console.log(`  IV  ${FIFTHS[i - 1]} major`);
    console.log(`  V   ${FIFTHS[i + 1]} major`);
    console.log(`  vi  ${FIFTHS[i + 3]} minor`);
*/
