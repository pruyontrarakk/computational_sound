//INITIALIZE AUDIO CONTEXT------------------------------------------------------

let audioCtx;
let audioCtx1;
let audioCtx_white;
let audioCtx_ocean;
let audioCtx_brown;
let audioCtx_wind;
let audioCtx_ice;
let audioCtx_rain;
let audioCtx_cricket;




// BACKGROUND COLOR------------------------------------------------------

document.body.style.backgroundColor = '#FFF9EE';


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



// WHITE NOISE SOUND------------------------------------------------------

function whiteNoise() {
    audioCtx_white = new (window.AudioContext || window.webkitAudioContext);
    let bufferSize = 2 * audioCtx_white.sampleRate;
    noiseBuffer = audioCtx_white.createBuffer(1, bufferSize, audioCtx_white.sampleRate);
    output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    whiteNoiseSource = audioCtx_white.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;
    whiteNoiseSource.start(0);

    gainNode = audioCtx_white.createGain();
    gainNode.gain.value = 0.02;

    whiteNoiseSource.connect(gainNode);
    gainNode.connect(audioCtx_white.destination);


    white_slider.addEventListener("input", function() {
        gainNode.gain.value = this.value / 400;
    });
    
}


// ICE SOUND------------------------------------------------------

function ice() {
    audioCtx_ice = new (window.AudioContext || window.webkitAudioContext)();
    bufferSize = 2 * audioCtx_ice.sampleRate;
    iceBuffer = audioCtx_ice.createBuffer(1, bufferSize, audioCtx_ice.sampleRate);
    output = iceBuffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        let whiteNoise = Math.random() * 2 - 1;

        output[i] = (lastOut + (0.02 * whiteNoise)) / 1.6;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    iceSound = audioCtx_ice.createBufferSource();
    iceSound.buffer = iceBuffer;
    iceSound.loop = true;
    iceSound.start(0);

    iceCracklingGain = audioCtx_ice.createGain();
    iceCracklingGain.connect(audioCtx_ice.destination);
    iceCracklingGain.gain.value = 1;


    ice_slider.addEventListener("input", function() {
        iceCracklingGain.gain.value = this.value;
    });

    function playIceCrackling(pitch) {
        source = audioCtx_ice.createBufferSource();
        source.buffer = iceBuffer;
        source.connect(iceCracklingGain);

        source.playbackRate.value = pitch;

        source.start();
        source.stop(audioCtx_ice.currentTime + 0.02);
    }


    setInterval(() => {
        iceCracklingGain.gain.setValueAtTime(0, audioCtx_ice.currentTime);
        iceCracklingGain.gain.linearRampToValueAtTime(0.5 + iceCracklingGain.gain.value, audioCtx_ice.currentTime + 0.001);
        iceCracklingGain.gain.linearRampToValueAtTime(0, audioCtx_ice.currentTime + 0.06);

        playIceCrackling(0.6);
    }, Math.random() * 1000 + 2900);


    setInterval(() => {
        iceCracklingGain.gain.setValueAtTime(0, audioCtx_ice.currentTime);
        iceCracklingGain.gain.linearRampToValueAtTime(0.6 + iceCracklingGain.gain.value, audioCtx_ice.currentTime + 0.001);
        iceCracklingGain.gain.linearRampToValueAtTime(0, audioCtx_ice.currentTime + 0.03);

        playIceCrackling(1.2);
    }, Math.random() * 1000 + 3450);

    setInterval(() => {
        iceCracklingGain.gain.setValueAtTime(0, audioCtx_ice.currentTime);
        iceCracklingGain.gain.linearRampToValueAtTime(0.5 + iceCracklingGain.gain.value, audioCtx_ice.currentTime + 0.001);
        iceCracklingGain.gain.linearRampToValueAtTime(0, audioCtx_ice.currentTime + 0.04);

        playIceCrackling(1.5);
    }, Math.random() * 1000 + 7050);

    setInterval(() => {
        iceCracklingGain.gain.setValueAtTime(0, audioCtx_ice.currentTime);
        iceCracklingGain.gain.linearRampToValueAtTime(0.8 + iceCracklingGain.gain.value, audioCtx_ice.currentTime + 0.001);
        iceCracklingGain.gain.linearRampToValueAtTime(0, audioCtx_ice.currentTime + 0.05);

        playIceCrackling(0.3);
    }, Math.random() * 1000 + 9100);

}


// BUBBLES SOUND------------------------------------------------------

function bubbles(){

    audioCtx = new (window.AudioContext || window.webkitAudioContext)
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
    rhpf.Q.value = 1/0.03;
    rhpf.gain.value = 0.1


    brownNoise.connect(lpf1).connect(rhpf)
    brownNoise.connect(lpf2).connect(lpf2_gainNode)
    lpf2_gainNode.connect(rhpf.frequency)
    offset.connect(rhpf.frequency)
    rhpf.connect(gainNode).connect(audioCtx.destination);



    brook_slider.addEventListener("input", function() {
        lpf1.frequency.value = this.value;  
        lpf2.frequency.value = this.value; 
        gainNode.gain.value = this.value * 30; 
    });


}



// FIRE SOUND ------------------------------------------------------

function fire() {

    audioCtx1 = new (window.AudioContext || window.webkitAudioContext)
    var bufferSize = 2 * audioCtx1.sampleRate,
    noiseBuffer = audioCtx1.createBuffer(1, bufferSize, audioCtx1.sampleRate),
    output = noiseBuffer.getChannelData(0);

    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    fireSound = audioCtx1.createBufferSource();
    fireSound.buffer = noiseBuffer;
    fireSound.loop = true;
    fireSound.start(0);

    const gainNode_white = audioCtx1.createGain();
    gainNode_white.gain.value = 0.001;

    fireSound.connect(gainNode_white);
    gainNode_white.connect(audioCtx1.destination);



    // Hissing

    const gainNode = audioCtx1.createGain();

    const osc = audioCtx1.createOscillator()
    osc.type = "triangle";
    osc.frequency.value = 0.4;

    const osc2 = audioCtx1.createOscillator();
    osc2.type = "square"; 
    osc2.frequency.value = 0.5;

    osc.connect(gainNode);
    osc2.connect(gainNode.gain)

    osc.start()
    osc2.start()

    const hiss_gain = audioCtx1.createGain();
    const total_hiss_gain = audioCtx1.createGain();
    total_hiss_gain.gain.value = 0.005

    const lpf = audioCtx1.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 1;

    const hpf = audioCtx1.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 1000;

    fireSound.connect(hpf).connect(hiss_gain)
    fireSound.connect(lpf).connect(hiss_gain)
    gainNode.connect(hiss_gain.gain)
    hiss_gain.connect(total_hiss_gain).connect(audioCtx1.destination)


    // Crackling

    const crackling_gain = audioCtx1.createGain();
    crackling_gain.connect(audioCtx1.destination);
    crackling_gain.gain.value = 0.07;

    function playCrackling() {
        const source = audioCtx1.createBufferSource();
        source.buffer = noiseBuffer;
        source.connect(crackling_gain);
        source.start();
        source.stop(audioCtx1.currentTime + 0.02); // Adjust the duration as needed
    }

    setInterval(() => {
        crackling_gain.gain.setValueAtTime(0, audioCtx1.currentTime);
        crackling_gain.gain.linearRampToValueAtTime(0.05, audioCtx1.currentTime + 0.001);
        crackling_gain.gain.linearRampToValueAtTime(0, audioCtx1.currentTime + 0.02);

        playCrackling();
    }, Math.random() * 1000 + 870); 

    setInterval(() => {
        crackling_gain.gain.setValueAtTime(0, audioCtx1.currentTime);
        crackling_gain.gain.linearRampToValueAtTime(0.1, audioCtx1.currentTime + 0.001);
        crackling_gain.gain.linearRampToValueAtTime(0, audioCtx1.currentTime + 0.015);

        playCrackling();
    }, Math.random() * 1000 + 2100); 

    setInterval(() => {
        crackling_gain.gain.setValueAtTime(0, audioCtx1.currentTime);
        crackling_gain.gain.linearRampToValueAtTime(0.05, audioCtx1.currentTime + 0.001);
        crackling_gain.gain.linearRampToValueAtTime(0, audioCtx1.currentTime + 0.03);

        playCrackling();
    }, Math.random() * 1000 + 3450); 


    setInterval(() => {
        crackling_gain.gain.setValueAtTime(0, audioCtx1.currentTime);
        crackling_gain.gain.linearRampToValueAtTime(0.3, audioCtx1.currentTime + 0.001);
        crackling_gain.gain.linearRampToValueAtTime(0, audioCtx1.currentTime + 0.04);

        playCrackling();
    }, Math.random() * 1000 + 7050); 

    setInterval(() => {
        crackling_gain.gain.setValueAtTime(0, audioCtx1.currentTime);
        crackling_gain.gain.linearRampToValueAtTime(0.25, audioCtx1.currentTime + 0.001);
        crackling_gain.gain.linearRampToValueAtTime(0, audioCtx1.currentTime + 0.05);

        playCrackling();
    }, Math.random() * 1000 + 9100); 




    // Lapping

    const flame_gain = audioCtx1.createGain();
    flame_gain.gain.value = 10;

    const flame = audioCtx1.createBiquadFilter()
    flame.type = "bandpass"
    flame.frequency.value = 30
    flame.Q.value = 5

    const flame_hpf = audioCtx1.createBiquadFilter()
    flame_hpf.type = 'highpass';
    flame_hpf.frequency.value = 25

    const clipper = audioCtx1.createWaveShaper();
    const curve = new Float32Array(2);
    curve[0] = -0.9;
    curve[1] = 0.9;
    clipper.curve = curve;

    fireSound.connect(flame)
                .connect(flame_hpf)
                .connect(flame_gain)
                .connect(clipper)
                .connect(audioCtx1.destination)

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
        windOutput[i] = (Math.random() * 2 - 1) * 0.09;
    }

    const windSource = audioCtx_wind.createBufferSource();
    windSource.buffer = windBuffer;
    windSource.loop = true;
    windSource.start(0);

    const windGain = audioCtx_wind.createGain();
    windGain.gain.value = 100;

    const windBandpass = audioCtx_wind.createBiquadFilter();
    windBandpass.type = "bandpass";
    windBandpass.frequency.value = 40;
    windBandpass.Q.value = 5;

    const windHighpass = audioCtx_wind.createBiquadFilter();
    windHighpass.type = 'highpass';
    windHighpass.frequency.value = 10;

    const windClipper = audioCtx_wind.createWaveShaper();
    const curve = new Float32Array(2);
    curve[0] = -1;
    curve[1] = 1;
    windClipper.curve = curve;

    windSource.connect(windBandpass)
        .connect(windHighpass)
        .connect(windGain)
        .connect(windClipper)
        .connect(audioCtx_wind.destination);


        wind_slider.addEventListener("input", function() {
            windGain.gain.value = this.value * 9;
        });
}


// RAIN SOUNDS------------------------------------------------------

function rain(){
    audioCtx_rain = new (window.AudioContext || window.webkitAudioContext)();
    return None
}




// CRICKET SOUNDS------------------------------------------------------


function cricket(){
    audioCtx_cricket = new (window.AudioContext || window.webkitAudioContext)();
    return None
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
            whiteNoise();
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
        if (!audioCtx1) {
            fireButton.classList.add('playing');
            fire_slider.disabled = false
            fire();
            return;
        }
        if (audioCtx1.state === 'suspended') {
            fireButton.classList.remove('playing');
            audioCtx1.resume();
            fireButton.classList.add('playing');
            fire_slider.disabled = false
        }
        if (audioCtx1.state === 'running') {
            fireButton.classList.remove('playing');
            audioCtx1.suspend();
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







