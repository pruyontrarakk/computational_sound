document.addEventListener("DOMContentLoaded", function(event) {

    const wavePicker = document.querySelector("select[name='waveform']");
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const globalGain = audioCtx.createGain(); //this will control the volume of all notes
    globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime)
    globalGain.connect(audioCtx.destination);

    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560,  //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929,  //C - E
        '86': 349.228231433003884,  //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294,  //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000,  //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111,  //M - B
        '81': 523.251130601197269,  //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120,  //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859,  //E - E
        '82': 698.456462866007768,  //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588,  //T - G 
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000,  //Y - A 
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223,  //U - B
    }
    
    


    // changing background
    const body = document.querySelector('body');
    const hexColors = [
        "#E2F6FF",
        "#8284C2",
        "#B2A5D1",
        "#B5E2FF",
        "#CCE6FF",
        "#7D82BA",
        "#B5DFF5",
        "#A2C8FF",
        "#A9ABCf",
        "#A8DDFF",
        "#BFD9E6",
        "#B2B2CC",
        "#D9E7FF"
    ];

    let currentColorIndex = 0;
    function changeColor() {
        document.body.style.backgroundColor = hexColors[currentColorIndex];
        currentColorIndex = (currentColorIndex + 1) % hexColors.length;
    }
    body.style.backgroundColor = '#B2D8F4';


    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);

    //variables
    activeOscillators = {}
    activeGainNodes = {}


    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (key === "32") {
            playMelody(melody1);
        } else if (key === "13") {
            playMelody(melody2);
        } else if (key === "20") {
            playMelody(melody3);
        } else if (key === "93") {
            playMelody(melody4);
        } else if (key === "91") {
            playMelody(melody5);
        } else if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
            playNote(key);
        }
    }

    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {
            
            activeGainNodes[key].gain.cancelScheduledValues(audioCtx.currentTime);

            //set gain back to 0 over short time
            activeGainNodes[key].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);

            //stops the oscillator over short time
            activeOscillators[key].stop(audioCtx.currentTime + 0.2);
            delete activeOscillators[key];
            delete activeGainNodes[key];
            changeColor();
        }
    }

    function playNote(key) {
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);

        // choose type of wave
        const type = wavePicker.options[wavePicker.selectedIndex].value;
        osc.type = type;
        
        // set gain nodes, attack part of envelope
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode).connect(globalGain);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        osc.start();

        activeOscillators[key] = osc;
        activeGainNodes[key] = gainNode;

        // polyphonic: reduce gain all nodes being played
        // sustain part of envelope
        Object.keys(activeGainNodes).forEach(function(key) {
            activeGainNodes[key].gain.setTargetAtTime(0.7/Object.keys(activeGainNodes).length, audioCtx.currentTime, 0.2);
        });

    }

    let melodyIndex = 0;  // Keeps track of the current note in the melody

    const melody1 = [
        { note: 69, duration: .23 },
        { note: 51, duration: .21 },
        { note: 69, duration: .2 },
        { note: 51, duration: .2 },
        { note: 69, duration: .2 },
        { note: 77, duration: .2 },
        { note: 87, duration: .2 },
        { note: 81, duration: .3 },
        { note: 78, duration: .45 },
    ];

    const melody2 = [
        { note: 66, duration: .4 },
        { note: 66, duration: .17 },
        { note: 78, duration: .17 },
        { note: 66, duration: .17 },
        { note: 67, duration: .17 },
        { note: 90, duration: .17 },
        { note: 67, duration: .17 },
        { note: 66, duration: .17 },
        { note: 78, duration: .17 },
        { note: 66, duration: .17 },
        { note: 67, duration: .35 },
    ];

    const melody3 = [
        { note: 69, duration: .43 },
        { note: 87, duration: .22 },
        { note: 81, duration: .33 },
        { note: 78, duration: 1.8 },
        { note: 69, duration: .43 },
        { note: 87, duration: .22 },
        { note: 81, duration: .33 },
        { note: 87, duration: 1.5 },
    ]

    const melody4 = [
        { note: 90, duration: .3 },
        { note: 90, duration: .3 },
        { note: 66, duration: .3 },
        { note: 66, duration: .3 },
        { note: 78, duration: .3 },
        { note: 78, duration: .3 },
        { note: 66, duration: .6 },
        { note: 86, duration: .3 },
        { note: 86, duration: .3 },
        { note: 67, duration: .3 },
        { note: 67, duration: .3 },
        { note: 88, duration: .3 },
        { note: 88, duration: .3 },
        { note: 90, duration: .7 },
    ]


    const melody5 = [
        { note: 77, duration: .35 },
        { note: 87, duration: .35 },
        { note: 53, duration: .35 },
        { note: 84, duration: .35 },
        { note: 81, duration: 1.5 },
        { note: 77, duration: .35 },
        { note: 87, duration: .35 },
        { note: 53, duration: .35 },
        { note: 84, duration: .35 },
        { note: 89, duration: 1.2 },

    ]

    function playMelody(melody) {
        if (melodyIndex < melody.length) {
            const { note, duration } = melody[melodyIndex];
            playNote(note);
            melodyIndex++;
    
            // Stop the note after its duration
            setTimeout(() => {
                if (keyboardFrequencyMap[note] && activeOscillators[note]) {
                    activeGainNodes[note].gain.cancelScheduledValues(audioCtx.currentTime);
                    activeGainNodes[note].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
                    activeOscillators[note].stop(audioCtx.currentTime + 0.2);
                    delete activeOscillators[note];
                    delete activeGainNodes[note];
                    changeColor();
                }
                playMelody(melody);
            }, duration * 1000);
        } else {
            melodyIndex = 0;
        }
    }

});