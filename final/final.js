//INITIALIZE AUDIO CONTEXT------------------------------------------------------

let audioCtx_ball;
let audioCtx_ocean;
let audioCtx_wind;
let audioCtx_cricket;

let audioCtx_major;
let audioCtx_dim;
let audioCtx_dim1;
let audioCtx_dim2;

let audioCtx_cell;


// INITIALIZE SLIDERS------------------------------------------------------

let ball_slider = document.getElementById("ball_slider")
let ocean_slider = document.getElementById("ocean_slider")
let cricket_slider = document.getElementById("cricket_slider")
let wind_slider = document.getElementById("wind_slider")

let major_slider = document.getElementById("major_slider")
let dim_slider = document.getElementById("rain_slider")
let dim1_slider = document.getElementById("brook_slider")
let dim2_slider = document.getElementById("fire_slider")


ball_slider.disabled = true
ocean_slider.disabled = true
cricket_slider.disabled = true
wind_slider.disabled = true

major_slider.disabled = true
dim_slider.disabled = true
dim1_slider.disabled = true
dim2_slider.disabled = true


// CHECK SLIDERS DISABLED------------------------------------------------------

function areAllSlidersDisabled() {
    // List of your sliders
    const sliders = [
        ball_slider, major_slider, dim1_slider,
        dim2_slider, ocean_slider, wind_slider,
        dim_slider, cricket_slider
    ];

    for (const slider of sliders) {
        if (!slider.disabled) {
            return false;
        }
    }

    return true;
}

//  NUMBER OF SOUNDS PLAYING------------------------------------------------------

function countPressedButtons(){
    const buttons = [ballButton, majorButton, brookButton, fireButton, oceanButton, windButton, rainButton, cricketButton];
    const pressedButtonCount = buttons.reduce((count, buttonState) => count + (buttonState ? 1 : 0), 0);

    return pressedButtonCount;
}


// BOUNCING BALL SOUND------------------------------------------------------

function ball() {
    audioCtx_ball = new (window.AudioContext || window.webkitAudioContext)();
    const overallGain = audioCtx_ball.createGain();

    setInterval(function() {
        playBall(audioCtx_ball, overallGain);
    }, 4000);

    function playBall(audioCtx_ball, overallGain){
        
        const decay = 4;
        const modulatorGain = audioCtx_ball.createGain();
        const envelopeGain = audioCtx_ball.createGain();
        const carrier = audioCtx_ball.createOscillator();
        const modulator = audioCtx_ball.createOscillator();

        carrier.type = 'sine';
        modulator.type = 'sawtooth';

        // FM Synthesis

        modulator.connect(modulatorGain);
        modulatorGain.connect(carrier.frequency);
        carrier.connect(envelopeGain);
        envelopeGain.connect(overallGain);
        overallGain.connect(audioCtx_ball.destination);

        envelopeGain.gain.setValueAtTime(0.2, audioCtx_ball.currentTime);
        envelopeGain.gain.linearRampToValueAtTime(0, audioCtx_ball.currentTime + decay);

        modulator.frequency.value = 2;
        modulatorGain.gain.value = 200;

        carrier.frequency.value = 300;

        modulator.start();
        carrier.start();

        ball_slider.addEventListener("input", function() {
            overallGain.gain.value = this.value / 9;
        });

        if(ball_slider.disabled){
            audioCtx_ball.close();
            return;
        }

    }


    ball_slider.addEventListener("input", function() {
        overallGain.gain.value = this.value / 9;
    });


    if(ball_slider.disabled){
        audioCtx_ball.close();
        return;
    }
}



// OCEAN WAVE SOUNDS------------------------------------------------------

function ocean() {
    audioCtx_ocean = new (window.AudioContext || window.webkitAudioContext)();
    bufferSize = 10 * audioCtx_ocean.sampleRate;
    let noiseBuffer = audioCtx_ocean.createBuffer(1, bufferSize, audioCtx_ocean.sampleRate);
    output = noiseBuffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        let brown = Math.random() * 2 - 1;

        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    const oceanNoise = audioCtx_ocean.createBufferSource();
    oceanNoise.buffer = noiseBuffer;
    oceanNoise.loop = true;
    oceanNoise.start(0);

    const gainNode = audioCtx_ocean.createGain();
    gainNode.gain.setValueAtTime(0.2, audioCtx_ocean.currentTime);


    // First LFO
    const lfo = audioCtx_ocean.createOscillator();
    const lfoGain = audioCtx_ocean.createGain();

    lfo.frequency.setValueAtTime(0.5, audioCtx_ocean.currentTime);
    lfoGain.gain.setValueAtTime(0.02, audioCtx_ocean.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    lfo.start();
    lfoGain.gain.setValueAtTime(0.05, audioCtx_ocean.currentTime);

    // Second LFO
    const lfo1 = audioCtx_ocean.createOscillator();
    const lfoGain1 = audioCtx_ocean.createGain();

    lfo1.frequency.setValueAtTime(0.15, audioCtx_ocean.currentTime);
    lfoGain1.gain.setValueAtTime(0.01, audioCtx_ocean.currentTime);

    lfo1.connect(lfoGain1);
    lfoGain1.connect(gainNode.gain);

    lfo1.start();
    lfoGain1.gain.setValueAtTime(0.2, audioCtx_ocean.currentTime);


    oceanNoise.connect(gainNode);
    gainNode.connect(audioCtx_ocean.destination);



    ocean_slider.addEventListener("input", function() {
        gainNode.gain.value = this.value * 0.02; 
        lfoGain.gain.value = this.value * 0.02;
        lfoGain1.gain.value = this.value * 0.02;
    });

}



// WIND SOUNDS------------------------------------------------------

function wind() {
    audioCtx_wind = new (window.AudioContext || window.webkitAudioContext)();
    bufferSize = audioCtx_wind.sampleRate * 5; // 5 seconds buffer
    windBuffer = audioCtx_wind.createBuffer(1, bufferSize, audioCtx_wind.sampleRate);
    windOutput = windBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        windOutput[i] = (Math.random() * 3.5 - 1);
    }

    const windSource = audioCtx_wind.createBufferSource();
    windSource.buffer = windBuffer;
    windSource.loop = true;
    windSource.start(0);

    const windGain = audioCtx_wind.createGain();
    windGain.gain.value = 3;


    // Band Pass Filter
    const windBandpass = audioCtx_wind.createBiquadFilter();
    windBandpass.type = "bandpass";
    windBandpass.frequency.value = 40;
    windBandpass.Q.value = 3;


    // High Pass Filter
    const windHighpass = audioCtx_wind.createBiquadFilter();
    windHighpass.type = 'highpass';
    windHighpass.frequency.value = 50;


    // Clipper
    const windClipper = audioCtx_wind.createWaveShaper();
    const curve = new Float32Array(2);
    curve[0] = -1;
    curve[1] = 1;
    windClipper.curve = curve;


    windSource.connect(windBandpass)
        .connect(windHighpass)
        .connect(windClipper)
        .connect(windGain)
        .connect(audioCtx_wind.destination);


    wind_slider.addEventListener("input", function() {
        windGain.gain.value = this.value * 0.9;
    });
}



// CRICKET SOUNDS------------------------------------------------------


function cricket(){
    audioCtx_cricket = new (window.AudioContext || window.webkitAudioContext)();
    var bufferSize = 10 * audioCtx_cricket.sampleRate,
    noiseBuffer = audioCtx_cricket.createBuffer(1, bufferSize, audioCtx_cricket.sampleRate),
    output = noiseBuffer.getChannelData(0);

    let lastOut = 0;
    let brown;
    let volume = 0.1;
    for (var i = 0; i < bufferSize; i++) {
        brown = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= volume;
    }

    cricketSound = audioCtx_cricket.createBufferSource();
    cricketSound.buffer = noiseBuffer;
    cricketSound.loop = true;
    cricketSound.start(0);

    const gainNode_cricket = audioCtx_cricket.createGain();
    gainNode_cricket.gain.value = 0.015;

    cricketSound.connect(gainNode_cricket);
    gainNode_cricket.connect(audioCtx_cricket.destination);

    const osc = audioCtx_cricket.createOscillator();
    osc.type = 'sawtooth'
    osc.frequency.value = 3800;
    osc.start()


    // Phasor
    const phasor = audioCtx_cricket.createOscillator();
    phasor.type = 'triangle';
    phasor.frequency.value = 1.17;
    phasor.connect(gainNode_cricket.gain)
    phasor.start()


    // AM synthesis
    var modulatorFreq = audioCtx_cricket.createOscillator();
    modulatorFreq.frequency.value = 50;
    const modulated = audioCtx_cricket.createGain();
    const depth = audioCtx_cricket.createGain();
    depth.gain.value = 0.05 
    modulated.gain.value = 0.04 - depth.gain.value;
    modulatorFreq.connect(depth).connect(modulated.gain);
    osc.connect(modulated)
    modulated.connect(gainNode_cricket);
    modulatorFreq.start()


    cricket_slider.addEventListener("input", function () {
        depth.gain.value = this.value * 0.005
        modulated.gain.value = depth.gain.value * 2
        volume = this.value * 0.08
    });


}


// MAJOR CHORD SOUND------------------------------------------------------

// button 1
function major() {
    audioCtx_major = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 2; 
    let gainValue = 0.04;

    function playNote(noteFrequency, startTime, duration, gainValue) {
        const oscillator = audioCtx_major.createOscillator();
        const gainNode = audioCtx_major.createGain();
    
        oscillator.type = 'sine';
        oscillator.frequency.value = noteFrequency;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx_major.destination);
    
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    // Function to play a chord progression
    function playMinorChordProgression() {
        const majorChords = [
            [261.63, 329.63, 392.00], // C Major
            [329.63, 391.99, 493.88], // E Major
            [391.99, 466.16, 587.33], // G Major
        
            [523.25, 659.25, 783.99], // C Major
            [659.25, 783.99, 987.77], // E Major
            [783.99, 932.33, 1174.66], // G Major
        ];

        const startTime = audioCtx_major.currentTime;

        // Play a randomized minor chord progression
        for (let i = 0; i < 1000; i++) {
            const randomChord = majorChords[Math.floor(Math.random() * majorChords.length)];

            for (let j = 0; j < randomChord.length; j++) {
                playNote(randomChord[j], startTime + i * duration, duration, gainValue);
            }
        }
    }

    playMinorChordProgression();
}


// DIMINISHED CHORD SOUNDS------------------------------------------------------

// 1. rain
function diminished(){
    audioCtx_dim = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 2.4;
    const gainValue = 0.04;

    function playNote(noteFrequency, startTime, duration, gainValue) {
        const oscillator = audioCtx_dim.createOscillator();
        const gainNode = audioCtx_dim.createGain();

    
        oscillator.type = 'triangle'; 
        oscillator.frequency.value = noteFrequency;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx_dim.destination);
    
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    // Function to play a chord progression
    function playMinorChordProgression() {
        const diminishedChords = [
            [261.63, 311.13, 369.99], // C Diminished
            [293.66, 349.23, 415.30], // D Diminished
            [329.63, 391.99, 466.16], // E Diminished
            [349.23, 415.30, 493.88], // F Diminished
            [391.99, 466.16, 554.37], // G Diminished
            [440.00, 523.25, 622.25], // A Diminished
            [493.88, 587.33, 698.46], // B Diminished
        ];


        const startTime = audioCtx_dim.currentTime;

        // Play a randomized minor chord progression
        for (let i = 0; i < 1000; i++) {
            const randomChord = diminishedChords[Math.floor(Math.random() * diminishedChords.length)];

            for (let j = 0; j < randomChord.length; j++) {
                playNote(randomChord[j], startTime + i * duration, duration, gainValue);
            }
        }
    }

    playMinorChordProgression();
}

// 2. brook
function diminished1(){
    audioCtx_dim1 = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 2.4;
    const gainValue = 0.04;

    function playNote(noteFrequency, startTime, duration, gainValue) {
        const oscillator = audioCtx_dim1.createOscillator();
        const gainNode = audioCtx_dim1.createGain();

    
        oscillator.type = 'sawtooth'; 
        oscillator.frequency.value = noteFrequency;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx_dim1.destination);
    
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    // Function to play a chord progression
    function playMinorChordProgression() {
        const diminishedChords = [
            [261.63, 311.13, 369.99], // C Diminished
            [293.66, 349.23, 415.30], // D Diminished
            [329.63, 391.99, 466.16], // E Diminished
            [349.23, 415.30, 493.88], // F Diminished
            [391.99, 466.16, 554.37], // G Diminished
            [440.00, 523.25, 622.25], // A Diminished
            [493.88, 587.33, 698.46], // B Diminished
        ];


        const startTime = audioCtx_dim1.currentTime;

        // Play a randomized minor chord progression
        for (let i = 0; i < 1000; i++) {
            const randomChord = diminishedChords[Math.floor(Math.random() * diminishedChords.length)];

            for (let j = 0; j < randomChord.length; j++) {
                playNote(randomChord[j], startTime + i * duration, duration, gainValue);
            }
        }
    }

    playMinorChordProgression();
}

// 3. fire
function diminished2(){
    audioCtx_dim2 = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 2.4;
    const gainValue = 0.04;

    function playNote(noteFrequency, startTime, duration, gainValue) {
        const oscillator = audioCtx_dim2.createOscillator();
        const gainNode = audioCtx_dim2.createGain();

    
        oscillator.type = 'square'; 
        oscillator.frequency.value = noteFrequency;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx_dim2.destination);
    
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    // Function to play a chord progression
    function playMinorChordProgression() {
        const diminishedChords = [
            [261.63, 311.13, 369.99], // C Diminished
            [293.66, 349.23, 415.30], // D Diminished
            [329.63, 391.99, 466.16], // E Diminished
            [349.23, 415.30, 493.88], // F Diminished
            [391.99, 466.16, 554.37], // G Diminished
            [440.00, 523.25, 622.25], // A Diminished
            [493.88, 587.33, 698.46], // B Diminished
        ];


        const startTime = audioCtx_dim2.currentTime;

        // Play a randomized minor chord progression
        for (let i = 0; i < 1000; i++) {
            const randomChord = diminishedChords[Math.floor(Math.random() * diminishedChords.length)];

            for (let j = 0; j < randomChord.length; j++) {
                playNote(randomChord[j], startTime + i * duration, duration, gainValue);
            }
        }
    }

    playMinorChordProgression();
}


// CONNECTING TO BUTTONS------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const ballButton = document.getElementById('ball_button');
    const majorButton = document.getElementById('major_button');
    const brookButton = document.getElementById('brook_button');
    const fireButton = document.getElementById('fire_button');
    const oceanButton = document.getElementById('ocean_button');
    const windButton = document.getElementById('wind_button');
    const rainButton = document.getElementById('rain_button');
    const cricketButton = document.getElementById('cricket_button');
    

// button for BOUNCING BALL
    ballButton.addEventListener('click', function() {
        if (!audioCtx_ball) {
            ballButton.classList.add('playing');
            ball_slider.disabled = false
            ball();
            return;
        }
        if (audioCtx_ball.state === 'suspended') {
            ballButton.classList.remove('playing');
            audioCtx_ball.resume();
            ballButton.classList.add('playing');
            ball_slider.disabled = false
        }
        if (audioCtx_ball.state === 'running') {
            ballButton.classList.remove('playing');
            audioCtx_ball.suspend();
            ball_slider.disabled = true
        }
    }, false);


    // button for OCEAN WAVES
    oceanButton.addEventListener('click', function() {
        if (!audioCtx_ocean) {
            oceanButton.classList.add('playing');
            ocean_slider.disabled = false
            ocean();
            return;
        }
        if (audioCtx_ocean.state === 'suspended') {
            oceanButton.classList.remove('playing');
            audioCtx_ocean.resume();
            oceanButton.classList.add('playing');
            ocean_slider.disabled = false
        }
        if (audioCtx_ocean.state === 'running') {
            oceanButton.classList.remove('playing');
            audioCtx_ocean.suspend();
            ocean_slider.disabled = true
        }
    }, false);




    // button for CRICKETS
    cricketButton.addEventListener('click', function() {
        if (!audioCtx_cricket) {
            cricketButton.classList.add('playing');
            cricket_slider.disabled = false
            cricket();
            return;
        }
        if (audioCtx_cricket.state === 'suspended') {
            cricketButton.classList.remove('playing');
            audioCtx_cricket.resume();
            cricketButton.classList.add('playing');
            cricket_slider.disabled = false

        }
        if (audioCtx_cricket.state === 'running') {
            cricketButton.classList.remove('playing');
            audioCtx_cricket.suspend();
            cricket_slider.disabled = true
        }
    }, false);



    // button for WIND
    windButton.addEventListener('click', function() {
        if (!audioCtx_wind) {
            windButton.classList.add('playing');
            wind_slider.disabled = false
            wind();
            return;
        }
        if (audioCtx_wind.state === 'suspended') {
            windButton.classList.remove('playing');
            audioCtx_wind.resume();
            windButton.classList.add('playing');
            wind_slider.disabled = false

        }
        if (audioCtx_wind.state === 'running') {
            windButton.classList.remove('playing');
            audioCtx_wind.suspend();
            wind_slider.disabled = true
        }
    }, false);



// button for MAJOR CHORD
    majorButton.addEventListener('click', function() {
        if (!audioCtx_major) {
            majorButton.classList.add('playing');
            major_slider.disabled = false
            rainButton.disabled = true
            brookButton.disabled = true
            fireButton.disabled = true
            major();
            return;
        }
        if (audioCtx_major.state === 'suspended') {
            majorButton.classList.remove('playing');
            audioCtx_major.resume();
            majorButton.classList.add('playing');
            major_slider.disabled = false
            rainButton.disabled = true
            brookButton.disabled = true
            fireButton.disabled = true
        }
        if (audioCtx_major.state === 'running') {
            majorButton.classList.remove('playing');
            audioCtx_major.suspend();
            major_slider.disabled
            major_slider.disabled = true
            rainButton.disabled = false
            brookButton.disabled = false
            fireButton.disabled = false
        }
    }, false);



// button for DIMINISHED CHORDS 0
rainButton.addEventListener('click', function() {
    if (!audioCtx_dim) {
        rainButton.classList.add('playing');
        dim_slider.disabled = false
        majorButton.disabled = true
        brookButton.disabled = true
        fireButton.disabled = true
        diminished();
        return;
    }
    if (audioCtx_dim.state === 'suspended') {
        rainButton.classList.remove('playing');
        audioCtx_dim.resume();
        rainButton.classList.add('playing');
        dim_slider.disabled = false
        majorButton.disabled = true
        brookButton.disabled = true
        fireButton.disabled = true

    }
    if (audioCtx_dim.state === 'running') {
        rainButton.classList.remove('playing');
        audioCtx_dim.suspend();
        dim_slider.disabled = true
        majorButton.disabled = false
        brookButton.disabled = false
        fireButton.disabled = false
    }
}, false);



// button for DIM CHORDS 1
    brookButton.addEventListener('click', function() {
        if (!audioCtx_dim1) {
            brookButton.classList.add('playing');
            dim1_slider.disabled = false
            majorButton.disabled = true
            rainButton.disabled = true
            fireButton.disabled = true
            diminished1();
            return;
        }
        if (audioCtx_dim1.state === 'suspended') {
            brookButton.classList.remove('playing');
            audioCtx_dim1.resume();
            brookButton.classList.add('playing');
            dim1_slider.disabled = false
            majorButton.disabled = true
            rainButton.disabled = true
            fireButton.disabled = true
        }
        if (audioCtx_dim1.state === 'running') {
            brookButton.classList.remove('playing');
            audioCtx_dim1.suspend();
            dim1_slider.disabled = true
            majorButton.disabled = false
            rainButton.disabled = false
            fireButton.disabled = false
        }
    }, false);



// button for DIMINISHED CHORDS 2
    fireButton.addEventListener('click', function() {
        if (!audioCtx_dim2) {
            fireButton.classList.add('playing');
            dim2_slider.disabled = false
            majorButton.disabled = true
            rainButton.disabled = true
            brookButton.disabled = true
            diminished2();
            return;
        }
        if (audioCtx_dim2.state === 'suspended') {
            fireButton.classList.remove('playing');
            audioCtx_dim2.resume();
            fireButton.classList.add('playing');
            dim2_slider.disabled = false
            majorButton.disabled = true
            rainButton.disabled = true
            brookButton.disabled = true
        }
        if (audioCtx_dim2.state === 'running') {
            fireButton.classList.remove('playing');
            audioCtx_dim2.suspend();
            dim2_slider.disabled = true
            majorButton.disabled = false
            rainButton.disabled = false
            brookButton.disabled = false
        }
    }, false);


});











// CELLULAR AUTOMATA------------------------------------------------------

// cellular automata code used from this link
// https://p5js.org/examples/simulate-game-of-life.html

let w;
let columns;
let rows;
let board;
let next;


function count_sliders(){
    let count = 0;

    count += !ball_slider.disabled ? 1 : 0;
    count += !ocean_slider.disabled ? 1 : 0;
    count += !cricket_slider.disabled ? 1 : 0;
    count += !wind_slider.disabled ? 1 : 0;

    count += !major_slider.disabled ? 1 : 0;
    count += !dim_slider.disabled ? 1 : 0;
    count += !dim1_slider.disabled ? 1 : 0;
    count += !dim2_slider.disabled ? 1 : 0;

    return (count * 3)
}


function get_slider_value_sounds(){

    rate = 8
    if (!ball_slider.disabled) {
        rate += log(ball_slider.value)*rate;
    }
    if (!ocean_slider.disabled) {
        rate += log(ocean_slider.value)*rate;
    }
    if (!cricket_slider.disabled) {
        rate += log(cricket_slider.value)*rate;
    }
    if (!wind_slider.disabled) {
        rate += log(wind_slider.value)*rate;
    }


    if (!major_slider.disabled) {
        rate += log(major_slider.value)*rate;
    }
    if (!dim_slider.disabled) {
        rate += log(dim_slider.value)*rate;
    }
    if (!dim1_slider.disabled) {
        rate += log(dim1_slider.value)*rate;
    }
    if (!dim2_slider.disabled) {
        rate += log(dim2_slider.value)*rate;
    }


    return log(rate + 0.5)
}



function setup() {
    noStroke()

    c = count_sliders()
    fr = get_slider_value_sounds()

    frameRate(fr);
    var canvas = createCanvas(830, 300);
    canvas.parent('animation');
    w = 20 + c;

    // Calculate columns and rows
    columns = floor(width / w);
    console.log(columns)
    rows = floor(height / w);

    // 2D array
    board = new Array(columns);
    for (let i = 0; i < columns; i++) {
        board[i] = new Array(rows);
    }
    // Use multiple 2D arrays and swap them
    next = new Array(columns);
    for (let i = 0; i < columns; i++) {
        next[i] = new Array(rows);
    }
    init();
}


function draw() {
    background(255);
    generate();
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (board[i][j] == 1) {
                let red = 255;
                let green = 255;
                let blue = 255;

                // Adjust the color based on the enabled sliders
                if (!ball_slider.disabled && ball_slider.value > 0) {
                    red = map(abs(ball_slider.value-10), 0, 10, 150, 255);
                }
                if (!major_slider.disabled && major_slider.value > 0) {
                    blue = map(abs(major_slider.value-10), 0, 10, 0, 255);
                    green = map(abs(major_slider.value-10), 0, 10, 100, 255);
                }

                if (!dim1_slider.disabled && dim1_slider.value > 0) {
                    green = map(abs(dim1_slider.value-10), 0, 10, 100, 255);
                }

                if (!dim2_slider.disabled && dim2_slider.value > 0) {
                    red = map(abs(dim2_slider.value-10), 0, 10, 150, 255);
                    green = map(abs(dim2_slider.value-10), 0, 10, 0, 255);
                }

                if (!ocean_slider.disabled && ocean_slider.value > 0) {
                    blue = map(abs(ocean_slider.value-10), 0, 10, 0, 255);
                }

                if (!wind_slider.disabled && wind_slider.value > 0) {
                    green = map(abs(wind_slider.value-10), 0, 10, 150, 255);
                }

                if (!dim_slider.disabled && dim_slider.value > 0) {
                    blue = map(abs(dim_slider.value-10), 0, 10, 150, 255);
                }

                if (!cricket_slider.disabled && cricket_slider.value > 0) {
                    red = map(abs(cricket_slider.value-10), 0, 10, 0, 255);
                    green = map(abs(cricket_slider.value-10), 0, 10, 150, 255);
                }

                if(!areAllSlidersDisabled()){
                    red *= random(0.85, 1.15);
                    green *= random(0.85, 1.15);
                    blue *= random(0.85, 1.15);
                }
                

                fill(red, green, blue);
            } else {
                fill(255);
            }
            rect(i * w, j * w, w - 1, w - 1);
        }
    }
}



// reset board when mouse is pressed
function mousePressed() {
    setup()
    init();
}




// Fill board randomly
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) board[i][j] = 0;
            else board[i][j] = floor(random(2));
            next[i][j] = 0;
        }
    }
}



// The process of creating the new generation
function generate() {
    // Loop 2D array and check spots neighbors
    for (let x = 1; x < columns - 1; x++) {
        for (let y = 1; y < rows - 1; y++) {
            // Add up all the states in a 3x3 surrounding grid
            let neighbors = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    neighbors += board[x + i][y + j];
                }
            } 

            neighbors -= board[x][y];

            // Rules of Life
            if ((board[x][y] === 1) && (neighbors < 2)) {
                next[x][y] = 0;
            } else if ((board[x][y] === 1) && (neighbors > 3)) {
                next[x][y] = 0;
            } else if ((board[x][y] === 0) && (neighbors == 3)) {
                next[x][y] = 1;
            } else next[x][y] = board[x][y]; // Stasis

            
        }
    }

    let temp = board;
    board = next;
    next = temp;


    if (!major_slider.disabled || !dim_slider.disabled || !dim1_slider.disabled || !dim2_slider.disabled) {
        const allFrequencies = [
            261.63, 329.63, 392.00,
            391.99, 466.16, 587.33,
            523.25, 659.25, 783.99,
            659.25, 783.99, 987.77,
            783.99, 932.33, 1174.66,
        ];
        playCellNote(allFrequencies)
    }

    
}



// To play notes that correspond to cell movement
function playCellNote(allFrequencies) {
    const audioCtx_cell = new (window.AudioContext || window.webkitAudioContext)();
    gainVal = 0.05

    const i = Math.floor(Math.random() * 15);
    const osc = audioCtx_cell.createOscillator();
    osc.frequency.setValueAtTime(allFrequencies[i], audioCtx_cell.currentTime);
    osc.type = "sine"

    const gainNode = audioCtx_cell.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx_cell.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx_cell.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx_cell.currentTime + 0.2);

    osc.connect(gainNode);
    gainNode.connect(audioCtx_cell.destination);

    osc.start();
    osc.stop(audioCtx_cell.currentTime + 0.3);
}



function openPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
}

// Function to close the popup
function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}
