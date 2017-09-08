const FIFTHS = [
    'Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'E#'
];

for (let i = 1; i < FIFTHS.length - 5; i++) {
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
}
