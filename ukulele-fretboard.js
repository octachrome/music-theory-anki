const fs = require('fs');
const execFileSync = require('child_process').execFileSync;

const writeImages = true;
const notes = ['A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab'];
const strings = ['A', 'E', 'C', 'G'];

const stream = require('fs').createWriteStream('ukulele-fretboard.txt');
stream.write('# Front; Back\n')

// Lower fretboard
writeCards(stream, 'lower', 0, 5);
// Upper fretboard
writeCards(stream, 'upper', 6, 11);

stream.end();
console.log('Done');

function writeCards(stream, rangeName, lowerFret, upperFret) {
    const cards = [];
    const fingeringsByNote = new Map();
    // Write cards for fretboard -> note name.
    for (let string = 0; string < strings.length; string++) {
        for (let fret = lowerFret; fret <= upperFret; fret++) {
            const note = getNote(string, fret);
            if (!fingeringsByNote.has(note)) {
                fingeringsByNote.set(note, []);
            }
            fingeringsByNote.get(note).push({fret, string});
            const filename = `uke_${string}_${fret}.png`;
            writeImage(`media/${filename}`, [{string, fret}]);
            // Front; Back
            stream.write(`<img src="${filename}">; ${note} (${rangeName})\n`);
        }
    }
    // Write cards for note name -> fretboard.
    for ([note, fingerings] of fingeringsByNote) {
        const filename = `uke_${note.replace(/\//g, '')}_${rangeName}.png`;
        writeImage(`media/${filename}`, fingerings);
        // Front; Back
        stream.write(`${note} (${rangeName}); <img src="${filename}">\n`);
    }
}

function getNote(stringNum, fret) {
    const baseNote = strings[stringNum];
    const baseIndex = notes.indexOf(baseNote);
    const noteIndex = baseIndex + fret;
    return notes[noteIndex % notes.length];
}

function writeImage(filename, fingerings) {
    if (!writeImages) {
        return;
    }
    process.stdout.write('.');
    const params = fingerings.map(({string, fret}) => `${string + 1}-${fret || 'o'}`).join(';');
    const lily = `\\markup { \\fret-diagram #"w:4;${params};" }`;
    fs.writeFileSync('/tmp/in.ly', lily);
    execFileSync('lilypond',
        ['-dpreview', '-dno-print-pages', '-dresolution=500', '-o', '/tmp/lilyout', '/tmp/in.ly'],
        {stdio: 'ignore'});
    fs.renameSync('/tmp/lilyout.preview.png', filename);
}
