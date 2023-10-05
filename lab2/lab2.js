let activeGainNodes = {}
let activeOscillators = {}
let modFreqVal = 100; // gets the frequency value from the slider
let indexVal = 100; // gets the index value from the slider
let keysDown = [];
let synthesisType = "additive"; // gets the synthesis type from when you select it
let partial = 0 // gets the partials from when you select it
let activeLFO = {}
let lfo = false;
let lfoFreq = 8

document.addEventListener("DOMContentLoaded", function(event) {

    let synths = document.getElementById("select_synth").synth
    let indexSlider = document.getElementById("indexSlider")
    let partialSelect = document.getElementById("partials")
    let modSlider = document.getElementById("modfreqSlider")
    lfoSlider = document.getElementById("lfoSlider")

    indexSlider.disabled = true;
    modSlider.disabled = true;


    for (let i = 0; i < synths.length; i++){
        synths[i].onclick= function(){
            for (j in keysDown){
                chooseKeyUp(keysDown[j], synthesisType)
            }
            synthesisType = this.value;
            if (synthesisType === 'additive'){
                partialSelect.disabled = false;
                indexSlider.disabled = true;
                modSlider.disabled = true;
            } else if (synthesisType === 'am'){
                partialSelect.disabled = true;
                indexSlider.disabled = true;
                modSlider.disabled = false;
            } else if (synthesisType === 'fm') {
                partialSelect.disabled = true;
                indexSlider.disabled = false;
                modSlider.disabled = false;
            }
        }
    }

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

    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);

    document.body.style.backgroundColor = "#f7f3fc";


    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && !activeGainNodes[key]) {
            keysDown.push(key,);
            if (synthesisType === 'additive'){
                playAdditive(key)
            } else if (synthesisType === 'am'){
                playAM(key)
            } else if (synthesisType === 'fm'){
                playFM(key)
            }
        }
    }


    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeGainNodes[key]) {
            keysDown.shift()
            if (synthesisType === 'additive'){
                stopAdditive(key)
            }else if (synthesisType === 'am'){
                stopAM(key)
            }else if (synthesisType === 'fm'){
                stopFM(key)
            }

        }
    }

   
    let compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);

    function playAdditive(key){

        //gain nodes
        const gainNode = audioCtx.createGain();
        gainNode.connect(compressor).connect(globalGain);
        gainNode.gain.setTargetAtTime(0.25, audioCtx.currentTime, 0.05);


        oscillators = [] 

        console.log(partial)
        //adds oscilator with each partial
        for (i=0; i <= partial; i++){
            const osc = audioCtx.createOscillator();
            osc.frequency.value = (i+1) * keyboardFrequencyMap[key]
            osc.start()
            osc.connect(gainNode)
            oscillators.push(osc)
        }


        //the LFO
        let lfoOsc = audioCtx.createOscillator();
        lfoOsc.frequency.setValueAtTime(lfoFreq, audioCtx.currentTime)
        lfoOsc.connect(gainNode);
        activeLFO[key] = lfoOsc;
        lfoOsc.start()
        

        activeOscillators[key] = oscillators;
        activeGainNodes[key] = gainNode;

        
        //envelope + polyphonic
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        activeGainNodes[key].gain.setTargetAtTime(0.7 / (Object.keys(activeGainNodes).length + (oscillators.length * Object.keys(activeGainNodes).length)), audioCtx.currentTime, 0.2)

    }

    function stopAdditive(key){

        activeGainNodes[key].gain.cancelScheduledValues(audioCtx.currentTime);
        activeGainNodes[key].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);

        for (i=0; i<activeOscillators.length; i++){
            activeOscillators[event][i].stop(audioCtx.currentTime + 0.02);

        }  

        activeLFO[key].stop(audioCtx.currentTime + 0.02);
        delete activeLFO[key]

        delete activeGainNodes[key];
        delete activeOscillators[key]; 
    }



    function playAM(key) {

        let oscillators = []
        let allGain = []


        let carrier = audioCtx.createOscillator();
        let modulatorFreq = audioCtx.createOscillator();

        modulatorFreq.frequency.value = modFreqVal;
        carrier.frequency.value = keyboardFrequencyMap[key];

        const modulated = audioCtx.createGain();
        
        modulated.connect(compressor).connect(globalGain);

        const depth = audioCtx.createGain();
        modulated.connect(compressor);
        depth.gain.value = 0.5 //scale modulator output to [-0.5, 0.5]
        modulated.gain.value = 1.0 - depth.gain.value; //a fixed value of 0.5

        modulatorFreq.connect(depth).connect(modulated.gain); //.connect is additive, so with [-0.5,0.5] and 0.5, the modulated signal now has output gain at [0,1]
        carrier.connect(modulated);

        oscillators.push(carrier) 
        oscillators.push(modulatorFreq)

        allGain.push(modulated)
        allGain.push(depth)

        //the LFO
        let lfoOsc = audioCtx.createOscillator();
        lfoOsc.frequency.setValueAtTime(lfoFreq, audioCtx.currentTime)
        lfoOsc.connect(modulated);
        activeLFO[key] = lfoOsc;
        lfoOsc.start()


        activeOscillators[key] = oscillators
        activeGainNodes[key] = allGain

        modulated.gain.setValueAtTime(0, audioCtx.currentTime)

        carrier.start()
        modulatorFreq.start()

        //envelope, sustain
        Object.keys(activeGainNodes).forEach((key) => {
            for (var i = 0; i < activeGainNodes[key].length; i++) {
                activeGainNodes[key][i].gain.setTargetAtTime(0.7 / (Object.keys(activeGainNodes).length + (oscillators.length * Object.keys(activeGainNodes).length)), audioCtx.currentTime, 0.2)
            }
        })
    }

    function stopAM(key){
        // envelope
        for (let i = 0; i < activeGainNodes[key].length; i++) {
            activeGainNodes[key][i].gain.cancelScheduledValues(audioCtx.currentTime);
            activeGainNodes[key][i].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
        }


        for (let i = 0; i < activeOscillators[key].length; i++) {
            activeOscillators[key][i].stop(audioCtx.currentTime + 0.02);
        }

        activeLFO[key].stop(audioCtx.currentTime + 0.02);
        delete activeLFO[key]

        delete activeGainNodes[key];
    }



    function playFM(key) {
        let oscillators = [] 
        let allGain = []

        //create the oscillators
        let carrier = audioCtx.createOscillator();
        let modulatorFreq = audioCtx.createOscillator();

        carrier.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)

        //index gain node
        modulationIndex = audioCtx.createGain();
        modulationIndex.gain.value = indexVal;
        modulatorFreq.frequency.value = modFreqVal;

        //create main gain node
        const gainNode = audioCtx.createGain();
        gainNode.connect(compressor).connect(globalGain);
        gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime);
        
        //connects all the correct values
        modulatorFreq.connect(modulationIndex);
        modulationIndex.connect(carrier.frequency);
        carrier.connect(gainNode);

        oscillators.push(carrier) 
        oscillators.push(modulatorFreq)
        allGain.push(modulationIndex)
        allGain.push(gainNode)

        activeOscillators[key] = oscillators 
        activeGainNodes[key] = allGain

        //the LFO
        let lfoOsc = audioCtx.createOscillator();
        lfoOsc.frequency.setValueAtTime(lfoFreq, audioCtx.currentTime)
        lfoOsc.connect(gainNode);
        activeLFO[key] = lfoOsc;
        lfoOsc.start()

        carrier.start();
        modulatorFreq.start();

        //envelope, sustain
        Object.keys(activeGainNodes).forEach((key) => {
            activeGainNodes[key][i].gain.linearRampToValueAtTime(
                0.7 / (Object.keys(activeGainNodes).length + (oscillators.length * Object.keys(activeGainNodes).length)),
                audioCtx.currentTime + 1);
        })

    }

    function stopFM(key){

         //envelope
        for (let i = 0; i < activeGainNodes[key].length; i++) {
            activeGainNodes[key][i].gain.cancelScheduledValues(audioCtx.currentTime);
            activeGainNodes[key][i].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
        }

        for (let i = 0; i < activeOscillators[key].length; i++) {
            activeOscillators[key][i].stop(audioCtx.currentTime + 0.02);
        }

        activeLFO[key].stop(audioCtx.currentTime + 0.02);
        delete activeLFO[key]
    
        delete activeGainNodes[key];
    }

});

function changePartials(){
    partial = document.getElementById("partials").value
}


function updateModFreq(val) {
    modFreqVal = val
    for (i in keysDown){
        activeGainNodes[keysDown[i]].frequency.value = val
    }
};

function updateIndex(val) {
    indexVal = val
    for (i in keysDown){
        activeGainNodes[keysDown[i]].gain.value = val
    }
};


function updateLFO(val){
    lfoFreq = val;
    for (i in keysDown){
        activeLFO[keysDown[i]].frequency.value = val;
    }
}



