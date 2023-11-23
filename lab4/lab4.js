
var audioCtx;
var osc;
var timings;
var liveCodeState = [];
var oscillatorType = 'triangle';
const playButton = document.querySelector('button');

document.body.style.backgroundColor = "#fff9f5";

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)
    osc = audioCtx.createOscillator();
    timings = audioCtx.createGain();
    timings.gain.value = 0;
    osc.connect(timings).connect(audioCtx.destination);
    osc.start();
    scheduleAudio()
}

function scheduleAudio() {
    let timeElapsedSecs = 0;
    liveCodeState.forEach(noteData => {
        timings.gain.setTargetAtTime(1, audioCtx.currentTime + timeElapsedSecs, 0.01)
        osc.frequency.setTargetAtTime(noteData["pitch"], audioCtx.currentTime + timeElapsedSecs, 0.01)
        timeElapsedSecs += noteData["length"]/10.0;
        timings.gain.setTargetAtTime(0, audioCtx.currentTime + timeElapsedSecs, 0.01)
        timeElapsedSecs += 0.2; //rest between notes
    });
    setTimeout(scheduleAudio, timeElapsedSecs * 1000);
}


//--------------------------------------------------------------------



function parseCode(code) {

    // CHANGING THE OSCILATOR TYPE

    let parts = code.split("?");
    if (parts.length > 1) {
        code = parts.pop().trim(); 
        oscillatorType = parts.join('?').trim();
    }

    osc.type = oscillatorType


    //REPETITION
    //(e.g. "3@340 2[1@220 2@330]"" plays as "3@340 1@220 2@330 1@220 2@330")

    repeat = false;
    num_times = 0
    line = ''
    rep_line = ''

    for (let char of code) {
        if (char == '[') {
            num_times = parseInt(line.slice(-1));
            line = line.slice(0, -1);
            repeat = true
        }
        else if (char == ']') {
            for (var i = 0; i < num_times; i++) {
                line = line + rep_line + " "
            }
            line = line.slice(0, -1);
            repeat = false
            rep_line = ''
        }
        else if (repeat == true) {
            rep_line += char
        }
        else {
            line += char
        }
    }


    //PLAY NOTES

    console.log(line)
    line = line.trim();

    let notes = line.split(" ");

    notes = notes.map(note => {
        noteData = note.split("@");
        return   {"length" : eval(noteData[0]),
                "pitch" : eval(noteData[1])};
    });

    return notes;
}



//--------------------------------------------------------------------



function genAudio(data) {
    liveCodeState = data;
}

function reevaluate() {
    var code = document.getElementById('code').value;
    var data = parseCode(code);
    genAudio(data);
}

playButton.addEventListener('click', function () {

    if (!audioCtx) {
        initAudio();
    }

    reevaluate();


});