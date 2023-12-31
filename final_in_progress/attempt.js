//INITIALIZE AUDIO CONTEXT------------------------------------------------------

let audioCtx;
let audioCtx_fire;
let audioCtx_white;
let audioCtx_ocean;
let audioCtx_brown;
let audioCtx_wind;
let audioCtx_ice;
let audioCtx_rain;
let audioCtx_cricket;
let audioCtx_cell;


// INITIALIZE SLIDERS------------------------------------------------------

let white_slider = document.getElementById("white_slider")
let ice_slider = document.getElementById("ice_slider")
let brook_slider = document.getElementById("brook_slider")
let fire_slider = document.getElementById("fire_slider")
let ocean_slider = document.getElementById("ocean_slider")
let wind_slider = document.getElementById("wind_slider")
let rain_slider = document.getElementById("rain_slider")
let cricket_slider = document.getElementById("cricket_slider")

white_slider.disabled = true
ice_slider.disabled = true
brook_slider.disabled = true
fire_slider.disabled = true
ocean_slider.disabled = true
wind_slider.disabled = true
rain_slider.disabled = true
cricket_slider.disabled = true

// CHECK SLIDERS DISABLED------------------------------------------------------

function areAllSlidersDisabled() {
    // List of your sliders
    const sliders = [
        white_slider, ice_slider, brook_slider,
        fire_slider, ocean_slider, wind_slider,
        rain_slider, cricket_slider
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
    // Convert the button states to an array
    const buttons = [whiteButton, iceButton, brookButton, fireButton, oceanButton, windButton, rainButton, cricketButton];

    // Use the reduce function to count the pressed buttons
    const pressedButtonCount = buttons.reduce((count, buttonState) => count + (buttonState ? 1 : 0), 0);

    return pressedButtonCount;
}


// WHITE NOISE SOUND------------------------------------------------------



function ball() {
    audioCtx_white = new (window.AudioContext || window.webkitAudioContext)();
    const overallGain = audioCtx_white.createGain();

    setInterval(function() {
        playBall(audioCtx_white, overallGain);
    }, 3000);

    function playBall(audioCtx_white, overallGain){
        
        const carrier = audioCtx_white.createOscillator();
        const modulator = audioCtx_white.createOscillator();
        const modulatorGain = audioCtx_white.createGain();
        const envelopeGain = audioCtx_white.createGain();
        

        const decay = 3; // Adjust the decay time as needed

        carrier.type = 'sine';
        modulator.type = 'sawtooth';

        modulator.connect(modulatorGain);
        modulatorGain.connect(carrier.frequency);
        carrier.connect(envelopeGain);
        envelopeGain.connect(overallGain); // Connect to overall gain
        overallGain.connect(audioCtx_white.destination);

        envelopeGain.gain.setValueAtTime(1, audioCtx_white.currentTime);
        envelopeGain.gain.linearRampToValueAtTime(0, audioCtx_white.currentTime + decay);

        modulator.frequency.value = 2; // Adjust modulator frequency as needed
        modulatorGain.gain.value = 200; // Adjust modulator gain as needed

        carrier.frequency.value = 300; // Adjust carrier frequency as needed

        modulator.start();
        carrier.start();

        // Assuming you have a white_slider element
        white_slider.addEventListener("input", function() {
            overallGain.gain.value = this.value / 9;
        });

        if(white_slider.disabled){
            audioCtx_white.close();
            return;
        }

    }


    white_slider.addEventListener("input", function() {
        overallGain.gain.value = this.value / 9;
    });


    if(white_slider.disabled){
        audioCtx_white.close();
        return;
    }
}



// ICE SOUND------------------------------------------------------

function ice() {
    audioCtx_ice = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 2; // Duration of each chord in seconds
    let gainValue = 0.01; // Adjust the volume as needed

    function playNote(noteFrequency, startTime, duration, gainValue) {
        const oscillator = audioCtx_ice.createOscillator();
        const gainNode = audioCtx_ice.createGain();
    
        oscillator.type = 'sine'; // You can experiment with different oscillator types
        oscillator.frequency.value = noteFrequency;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx_ice.destination);
    
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

        const startTime = audioCtx_ice.currentTime;

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


// BUBBLES SOUND------------------------------------------------------

function bubbles() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let bufferSize = 30 * audioCtx.sampleRate,
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
        output = noiseBuffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        let brown = Math.random() * 2 - 1;

        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    brownNoise = audioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    const lpf1 = audioCtx.createBiquadFilter()
    lpf1.type = 'lowpass'
    lpf1.frequency.value = 400;

    const lpf2_gainNode = audioCtx.createGain();
    lpf2_gainNode.gain.value = 1200;
    const offset = audioCtx.createConstantSource();
    offset.offset.value = 200;
    offset.start();
    const lpf2 = audioCtx.createBiquadFilter()
    lpf2.type = 'lowpass'
    lpf2.frequency.value = 14;

    const rhpf = audioCtx.createBiquadFilter()
    rhpf.type = 'highpass'
    rhpf.Q.value = 1 / 0.03;
    rhpf.gain.value = 0.1

    brownNoise.connect(lpf1).connect(rhpf)
    brownNoise.connect(lpf2).connect(lpf2_gainNode)
    lpf2_gainNode.connect(rhpf.frequency)
    offset.connect(rhpf.frequency)
    rhpf.connect(gainNode).connect(audioCtx.destination);

    brook_slider.addEventListener("input", function() {
        lpf1.frequency.value = this.value * 1.5;  
        lpf2.frequency.value = this.value * 1.5; 
        gainNode.gain.value = this.value * 40; 

    });


    
}




// FIRE SOUND ------------------------------------------------------

function fire() {

    audioCtx_fire = new (window.AudioContext || window.webkitAudioContext)
    var bufferSize = 2 * audioCtx_fire.sampleRate,
    noiseBuffer = audioCtx_fire.createBuffer(1, bufferSize, audioCtx_fire.sampleRate),
    output = noiseBuffer.getChannelData(0);

    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    fireSound = audioCtx_fire.createBufferSource();
    fireSound.buffer = noiseBuffer;
    fireSound.loop = true;
    fireSound.start(0);

    const gainNode_white = audioCtx_fire.createGain();
    gainNode_white.gain.value = 0.001;

    fireSound.connect(gainNode_white);
    gainNode_white.connect(audioCtx_fire.destination);



    // Hissing

    const gainNode = audioCtx_fire.createGain();

    const osc = audioCtx_fire.createOscillator()
    osc.type = "triangle";
    osc.frequency.value = 0.4;

    const osc2 = audioCtx_fire.createOscillator();
    osc2.type = "square"; 
    osc2.frequency.value = 0.5;

    osc.connect(gainNode);
    osc2.connect(gainNode.gain)

    osc.start()
    osc2.start()

    const hiss_gain = audioCtx_fire.createGain();
    const total_hiss_gain = audioCtx_fire.createGain();
    total_hiss_gain.gain.value = 0.005

    const lpf = audioCtx_fire.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 1;

    const hpf = audioCtx_fire.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 1000;

    fireSound.connect(hpf).connect(hiss_gain)
    fireSound.connect(lpf).connect(hiss_gain)
    gainNode.connect(hiss_gain.gain)
    hiss_gain.connect(total_hiss_gain).connect(audioCtx_fire.destination)


    // Crackling

    const crackling_gain = audioCtx_fire.createGain();
    crackling_gain.connect(audioCtx_fire.destination);
    crackling_gain.gain.value = 0.07;

    function playCrackling() {
        const source = audioCtx_fire.createBufferSource();
        source.buffer = noiseBuffer;
        source.connect(crackling_gain);
        source.start();
        source.stop(audioCtx_fire.currentTime + 0.02);
    }

    setInterval(() => {
        crackling_gain.gain.setValueAtTime(0, audioCtx_fire.currentTime);
        crackling_gain.gain.linearRampToValueAtTime(0.05, audioCtx_fire.currentTime + 0.001);
        crackling_gain.gain.linearRampToValueAtTime(0, audioCtx_fire.currentTime + 0.02);

        playCrackling();
    }, Math.random() * 1000 + 870); 

    setInterval(() => {
        crackling_gain.gain.setValueAtTime(0, audioCtx_fire.currentTime);
        crackling_gain.gain.linearRampToValueAtTime(0.1, audioCtx_fire.currentTime + 0.001);
        crackling_gain.gain.linearRampToValueAtTime(0, audioCtx_fire.currentTime + 0.015);

        playCrackling();
    }, Math.random() * 1000 + 2100); 

    setInterval(() => {
        crackling_gain.gain.setValueAtTime(0, audioCtx_fire.currentTime);
        crackling_gain.gain.linearRampToValueAtTime(0.05, audioCtx_fire.currentTime + 0.001);
        crackling_gain.gain.linearRampToValueAtTime(0, audioCtx_fire.currentTime + 0.03);

        playCrackling();
    }, Math.random() * 1000 + 3450); 


    setInterval(() => {
        crackling_gain.gain.setValueAtTime(0, audioCtx_fire.currentTime);
        crackling_gain.gain.linearRampToValueAtTime(0.3, audioCtx_fire.currentTime + 0.001);
        crackling_gain.gain.linearRampToValueAtTime(0, audioCtx_fire.currentTime + 0.04);

        playCrackling();
    }, Math.random() * 1000 + 7050); 

    setInterval(() => {
        crackling_gain.gain.setValueAtTime(0, audioCtx_fire.currentTime);
        crackling_gain.gain.linearRampToValueAtTime(0.25, audioCtx_fire.currentTime + 0.001);
        crackling_gain.gain.linearRampToValueAtTime(0, audioCtx_fire.currentTime + 0.05);

        playCrackling();
    }, Math.random() * 1000 + 9100); 




    // Lapping

    const flame_gain = audioCtx_fire.createGain();
    flame_gain.gain.value = 10;

    const flame = audioCtx_fire.createBiquadFilter()
    flame.type = "bandpass"
    flame.frequency.value = 30
    flame.Q.value = 5

    const flame_hpf = audioCtx_fire.createBiquadFilter()
    flame_hpf.type = 'highpass';
    flame_hpf.frequency.value = 25

    const clipper = audioCtx_fire.createWaveShaper();
    const curve = new Float32Array(2);
    curve[0] = -0.9;
    curve[1] = 0.9;
    clipper.curve = curve;

    fireSound.connect(flame)
                .connect(flame_hpf)
                .connect(flame_gain)
                .connect(clipper)
                .connect(audioCtx_fire.destination)




    fire_slider.addEventListener("input", function() {
        gainNode.gain.value = this.value * 0.1;
        hiss_gain.gain.value = this.value * 0.1; 
        crackling_gain.gain.value = this.value;
        flame_gain.gain.value = this.value;
        flame_hpf.gain.value = this.value;
    });

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
    gainNode.gain.setValueAtTime(0.1, audioCtx_ocean.currentTime);


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
    lfoGain1.gain.setValueAtTime(0.1, audioCtx_ocean.currentTime);


    oceanNoise.connect(gainNode);
    gainNode.connect(audioCtx_ocean.destination);



    ocean_slider.addEventListener("input", function() {
        gainNode.gain.value = this.value * 0.01; 
        lfoGain.gain.value = this.value * 0.01;
        lfoGain1.gain.value = this.value * 0.01;
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

    const windBandpass = audioCtx_wind.createBiquadFilter();
    windBandpass.type = "bandpass";
    windBandpass.frequency.value = 40;
    windBandpass.Q.value = 3;

    const windHighpass = audioCtx_wind.createBiquadFilter();
    windHighpass.type = 'highpass';
    windHighpass.frequency.value = 50;

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


// RAIN SOUNDS------------------------------------------------------

// function rain(){
//     audioCtx_rain = new (window.AudioContext || window.webkitAudioContext)();
//     let bufferSize = 10 * audioCtx_rain.sampleRate;
//     noiseBuffer = audioCtx_rain.createBuffer(1, bufferSize, audioCtx_rain.sampleRate);
//     output = noiseBuffer.getChannelData(0);

//     for (let i = 0; i < bufferSize; i++) {
//         output[i] = Math.random() - 0.9;
//     }

//     rainNoiseSource = audioCtx_rain.createBufferSource();
//     rainNoiseSource.buffer = noiseBuffer;
//     rainNoiseSource.loop = true;
//     rainNoiseSource.start(0);

//     gainNodeRain = audioCtx_rain.createGain();
//     gainNodeRain.gain.value = 0.025;

//     rainNoiseSource.connect(gainNodeRain);

//     gainNodeRain.connect(audioCtx_rain.destination);




//     rain_slider.addEventListener("input", function() {
//         gainNodeRain.gain.value = this.value * 0.01;
//     });

// }

function rain(){
    audioCtx_rain = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 2.4; // Duration of each chord in seconds
    const gainValue = 0.01; // Adjust the volume as needed

    function playNote(noteFrequency, startTime, duration, gainValue) {
        const oscillator = audioCtx_rain.createOscillator();
        const gainNode = audioCtx_rain.createGain();
    
        oscillator.type = 'sine'; // You can experiment with different oscillator types
        oscillator.frequency.value = noteFrequency;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx_rain.destination);
    
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


        const startTime = audioCtx_rain.currentTime;

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
    depth.gain.value = 0.02 //scale modulator output to [-0.02, 0.02]
    modulated.gain.value = 0.04 - depth.gain.value; //a fixed value of 0.02
    modulatorFreq.connect(depth).connect(modulated.gain); //.connect is additive, so with [-0.02, 0.02] and 0.02, the modulated signal now has output gain at [0,1]
    osc.connect(modulated)
    modulated.connect(gainNode_cricket);
    modulatorFreq.start()


    cricket_slider.addEventListener("input", function () {
        depth.gain.value = this.value * 0.002
        modulated.gain.value = depth.gain.value * 2
        volume = this.value * 0.08
    });


}




// CONNECTING TO BUTTONS------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const whiteButton = document.getElementById('white_button');
    const iceButton = document.getElementById('ice_button');
    const brookButton = document.getElementById('brook_button');
    const fireButton = document.getElementById('fire_button');
    const oceanButton = document.getElementById('ocean_button');
    const windButton = document.getElementById('wind_button');
    const rainButton = document.getElementById('rain_button');
    const cricketButton = document.getElementById('cricket_button');
    

// button for white noise
    whiteButton.addEventListener('click', function() {
        if (!audioCtx_white) {
            whiteButton.classList.add('playing');
            white_slider.disabled = false
            ball();
            return;
        }
        if (audioCtx_white.state === 'suspended') {
            whiteButton.classList.remove('playing');
            audioCtx_white.resume();
            whiteButton.classList.add('playing');
            white_slider.disabled = false
        }
        if (audioCtx_white.state === 'running') {
            whiteButton.classList.remove('playing');
            audioCtx_white.suspend();
            white_slider.disabled = true
        }
    }, false);

// button for cracking ice
    iceButton.addEventListener('click', function() {
        if (!audioCtx_ice) {
            iceButton.classList.add('playing');
            ice_slider.disabled = false
            ice();
            return;
        }
        if (audioCtx_ice.state === 'suspended') {
            iceButton.classList.remove('playing');
            audioCtx_ice.resume();
            iceButton.classList.add('playing');
            ice_slider.disabled = false
        }
        if (audioCtx_ice.state === 'running') {
            iceButton.classList.remove('playing');
            audioCtx_ice.suspend();
            ice_slider.disabled
            ice_slider.disabled = true
        }
    }, false);


// button for babbling brook / bubbles
    brookButton.addEventListener('click', function() {
        if (!audioCtx) {
            brookButton.classList.add('playing');
            brook_slider.disabled = false
            bubbles();
            return;
        }
        if (audioCtx.state === 'suspended') {
            brookButton.classList.remove('playing');
            audioCtx.resume();
            brookButton.classList.add('playing');
            brook_slider.disabled = false
        }
        if (audioCtx.state === 'running') {
            brookButton.classList.remove('playing');
            audioCtx.suspend();
            brook_slider.disabled = true
        }
    }, false);



// button for fire sounds
    fireButton.addEventListener('click', function() {
        if (!audioCtx_fire) {
            fireButton.classList.add('playing');
            fire_slider.disabled = false
            fire();
            return;
        }
        if (audioCtx_fire.state === 'suspended') {
            fireButton.classList.remove('playing');
            audioCtx_fire.resume();
            fireButton.classList.add('playing');
            fire_slider.disabled = false
        }
        if (audioCtx_fire.state === 'running') {
            fireButton.classList.remove('playing');
            audioCtx_fire.suspend();
            fire_slider.disabled = true
        }
    }, false);

// button for ocean waves
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

// button for wind sounds
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

// button for rain sounds

    rainButton.addEventListener('click', function() {
        if (!audioCtx_rain) {
            rainButton.classList.add('playing');
            rain_slider.disabled = false
            rain();
            return;
        }
        if (audioCtx_rain.state === 'suspended') {
            rainButton.classList.remove('playing');
            audioCtx_rain.resume();
            rainButton.classList.add('playing');
            rain_slider.disabled = false

        }
        if (audioCtx_rain.state === 'running') {
            rainButton.classList.remove('playing');
            audioCtx_rain.suspend();
            rain_slider.disabled = true
        }
    }, false);


// button for cricket sounds
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

    count += !white_slider.disabled ? 1 : 0;
    count += !ice_slider.disabled ? 1 : 0;
    count += !brook_slider.disabled ? 1 : 0;
    count += !fire_slider.disabled ? 1 : 0;
    count += !ocean_slider.disabled ? 1 : 0;
    count += !wind_slider.disabled ? 1 : 0;
    count += !rain_slider.disabled ? 1 : 0;
    count += !cricket_slider.disabled ? 1 : 0;

    return count * 2
}


function get_slider_value(){

    rate = 3
    if (!white_slider.disabled) {
        rate += log(white_slider.value)*rate;
    }
    if (!ice_slider.disabled) {
        rate += log(ice_slider.value)*rate;
    }
    if (!brook_slider.disabled) {
        rate += log(brook_slider.value)*rate;
    }
    if (!fire_slider.disabled) {
        rate += log(fire_slider.value)*rate;
    }
    if (!ocean_slider.disabled) {
        rate += log(ocean_slider.value)*rate;
    }
    if (!wind_slider.disabled) {
        rate += log(wind_slider.value)*rate;
    }
    if (!rain_slider.disabled) {
        rate += log(rain_slider.value)*rate;
    }
    if (!cricket_slider.disabled) {
        rate += log(cricket_slider.value)*rate;
    }

    return log(rate)
}


function setup() {
    noStroke()

    c = count_sliders()
    fr = get_slider_value()

    frameRate(fr);
    var canvas = createCanvas(720, 250);
    canvas.parent('animation');
    w = 18 + c;
    // w = 20
    // Calculate columns and rows
    columns = floor(width / w);
    console.log(columns)
    rows = floor(height / w);
    // Wacky way to make a 2D array is JS
    board = new Array(columns);
    for (let i = 0; i < columns; i++) {
        board[i] = new Array(rows);
    }
    // Going to use multiple 2D arrays and swap them
    next = new Array(columns);
    for (let i = 0; i < columns; i++) {
        next[i] = new Array(rows);
    }
    init();
}


function draw() {
    background(255);
    // setTimeout(generate(), get_slider_value() * 1000);
    generate();
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (board[i][j] == 1) {
                let red = 255;
                let green = 255;
                let blue = 255;

                // Adjust the color based on the enabled sliders
                if (!white_slider.disabled && white_slider.value > 0) {
                    red = map(abs(white_slider.value-10), 0, 10, 150, 255);
                }
                if (!ice_slider.disabled && ice_slider.value > 0) {
                    blue = map(abs(ice_slider.value-10), 0, 10, 0, 255);
                    green = map(abs(ice_slider.value-10), 0, 10, 100, 255);
                }

                if (!brook_slider.disabled && brook_slider.value > 0) {
                    green = map(abs(brook_slider.value-10), 0, 10, 100, 255);
                }

                if (!fire_slider.disabled && fire_slider.value > 0) {
                    red = map(abs(fire_slider.value-10), 0, 10, 150, 255);
                    green = map(abs(fire_slider.value-10), 0, 10, 0, 255);
                }

                if (!ocean_slider.disabled && ocean_slider.value > 0) {
                    blue = map(abs(ocean_slider.value-10), 0, 10, 0, 255);
                }

                if (!wind_slider.disabled && wind_slider.value > 0) {
                    green = map(abs(wind_slider.value-10), 0, 10, 150, 255);
                }

                if (!rain_slider.disabled && rain_slider.value > 0) {
                    blue = map(abs(rain_slider.value-10), 0, 10, 150, 255);
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
    // Loop through every spot in our 2D array and check spots neighbors
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


    if (!ice_slider.disabled || !rain_slider.disabled) {
        playCellNote()
    }
    
}




function playCellNote() {
    const audioCtx_cell = new (window.AudioContext || window.webkitAudioContext)();

    gainVal = 0.1

    ice_slider.addEventListener("input", function () {
        gainVal = log(this.value * gainVal)
    });

    rain_slider.addEventListener("input", function () {
        gainVal = log(this.value * gainVal)
    });


    const allFrequencies = [
        261.63, 329.63, 392.00, // C Major
        391.99, 466.16, 587.33, // G Major
        523.25, 659.25, 783.99, // C Major
        659.25, 783.99, 987.77, // E Major
        783.99, 932.33, 1174.66, // G Major
    ];

    const i = Math.floor(Math.random() * 15);

    const osc = audioCtx_cell.createOscillator();
    osc.frequency.setValueAtTime(allFrequencies[i], audioCtx_cell.currentTime);

    const gainNode = audioCtx_cell.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx_cell.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx_cell.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx_cell.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(audioCtx_cell.destination);

    osc.start();
    osc.stop(audioCtx_cell.currentTime + 0.4);
}


