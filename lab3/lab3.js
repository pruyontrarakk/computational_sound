let audioCtx;
let audioCtx1;


function babblingSound(){

    audioCtx = new (window.AudioContext || window.webkitAudioContext)
    let bufferSize = 10 * audioCtx.sampleRate,
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
    gainNode.gain.value = 0.2;


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

}




function whiteNoise() {

    audioCtx1 = new (window.AudioContext || window.webkitAudioContext)
    var bufferSize = 2 * audioCtx1.sampleRate,
    noiseBuffer = audioCtx1.createBuffer(1, bufferSize, audioCtx1.sampleRate),
    output = noiseBuffer.getChannelData(0);

    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    whiteNoise = audioCtx1.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);



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

    whiteNoise.connect(hpf).connect(hiss_gain)
    whiteNoise.connect(lpf).connect(hiss_gain)
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
        crackling_gain.gain.linearRampToValueAtTime(0.07, audioCtx1.currentTime + 0.001);
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
        crackling_gain.gain.linearRampToValueAtTime(0.2, audioCtx1.currentTime + 0.001);
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
    flame_gain.gain.value = 8;

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

    whiteNoise.connect(flame)
                .connect(flame_hpf)
                .connect(flame_gain)
                .connect(clipper)
                .connect(audioCtx1.destination)

}





document.addEventListener('DOMContentLoaded', function () {
    const brookButton = document.getElementById('brook_button');
    const fireButton = document.getElementById('fire_button');

    brookButton.addEventListener('click', function() {
        if (!audioCtx) {
            babblingSound();
            return;
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        if (audioCtx.state === 'running') {
            audioCtx.suspend();
        }
    }, false);

    fireButton.addEventListener('click', function() {
        if (!audioCtx1) {
            whiteNoise();
            return;
        }
        if (audioCtx1.state === 'suspended') {
            audioCtx1.resume();
        }
        if (audioCtx1.state === 'running') {
            audioCtx1.suspend();
        }
    }, false);
});
