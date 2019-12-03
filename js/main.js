const audioContext = new AudioContext();

let SAMPLES = 500;

const getAudioData = async () => {
    try {
        const response = await fetch("/assets/audio.mpeg");
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const filteredBuffer = filterAudioBuffer(audioBuffer);
        return filteredBuffer;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param {AudioBuffer} audioBuffer
 */
const filterAudioBuffer = audioBuffer => {
    const rawData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / SAMPLES);
    const filteredData = [];
    for (let i = 0; i < SAMPLES; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
            sum = sum + Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize); 
    }
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
}

/**
 * @type {number[]}
 */
let audioBuffer = null;

async function setup() {
    createCanvas(1000, 480);
    background("#212121");
    const filteredBuffer = await getAudioData();
    audioBuffer = filteredBuffer;
}

function draw() {

    if (!audioBuffer) return;

    translate(0, height/2);

    for (let i = 0; i < audioBuffer.length; i++) {
        const value = Math.floor(audioBuffer[i] * 100);
        stroke(255);
        line(i * 2, -(value/2), i * 2, value/2)
    }

}