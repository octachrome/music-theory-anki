const fs = require('fs');
const execFileSync = require('child_process').execFileSync;

const writeImages = true;
const allNoteCards = false;
const notes = ['A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab'];
const strings = ['A', 'E', 'C', 'G'];

console.log('Fields required by note type: Front; Back');

const stream = require('fs').createWriteStream('ukulele-fretboard.txt');
stream.write('# Front; Back\n')

// Full fretboard
writeCards(stream, 0, 11);

stream.end();
console.log('Done');

function writeCards(stream, lowerFret, upperFret) {
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
            stream.write(`<img src="${filename}">; ${note}\n`);
            stream.write(`${note} ${nth(string + 1)} string; <img src="${filename}">\n`);
        }
    }
    if (allNoteCards) {
        // Write cards for note name -> fretboard.
        for ([note, fingerings] of fingeringsByNote) {
            const filename = `uke_${note.replace(/\//g, '')}.png`;
            writeImage(`media/${filename}`, fingerings);
            // Front; Back
            stream.write(`${note}; <img src="${filename}">\n`);
        }
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
    // Draw the fret number inside the dot (where the finger number usually is).
    const placeFrets = fingerings.map(({string, fret}) =>
        fret ? `(place-fret ${string + 1} ${fret} ${fret})` : `(open ${string + 1})`).join('\n');
    // White fret on 1st fret of (invisible) 5th string ensures that the full fretboard is drawn.
    const lily = `
    \\markup {
      \\override #'(fret-diagram-details . ((string-count . 4) (finger-code . in-dot)))
      \\fret-diagram-verbose #'(
        (place-fret 5 1 white)
        ${placeFrets}
      )
    }`;
    fs.writeFileSync('/tmp/in.ly', lily);
    execFileSync('lilypond',
        ['-dpreview', '-dno-print-pages', '-dresolution=500', '-o', '/tmp/lilyout', '/tmp/in.ly'],
        {stdio: 'ignore'});
    fs.renameSync('/tmp/lilyout.preview.png', filename);
}

function nth(num) {
    switch (num) {
        case 1:
            return '1st';
        case 2:
            return '2nd';
        case 3:
            return '3rd';
        default:
            return `${num}th`;
    }
}
