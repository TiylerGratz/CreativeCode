let clicked = false;
let video;
let pickedColor = [0, 0, 0];
let frameCountMod = 0;
let centerX;
let centerY;
let held = false;
let currentSection = [];



function setup() {
    frameRate(60);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);
    background(0, 0, 0, 0.3);
    initializeCamera();
    centerX = cw / 2;
    centerY = ch / 2;
    

}

function draw() {
    if (!video || !video.loadedmetadata) return;
    image(video, 0, 0, width, height);
    
    if (clicked) {
        let info = detectDominantColorRegion();
        for(let section of currentSection){
            let col = section % info.cols;
            let row = floor(section / info.cols);
            stroke(173, 216, 230);
            strokeWeight(4);
            fill('rgba(55, 137, 160, 0.45)');
            rect(col * width / info.cols, row * height / info.rows, width / info.cols, height / info.rows); 
            
        }
        
    }


}

function mouseClicked() {
    if (!clicked) {
        userStartAudio()
        clicked = true;

    }
    let picked = captureColor(mouseX, mouseY);
    pickedColor = [red(picked), green(picked), blue(picked)];


}

function colorDistance(c1, c2) {
    return dist(c1[0], c1[1], c1[2], c2[0], c2[1], c2[2]);
}

function detectDominantColorRegion() {
    const cols = 15;
    const rows = 15;
    const regionW = video.width / cols;
    const regionH = video.height / rows;
    const counts = Array(cols * rows).fill(0);
    currentSection = [];
    
    video.loadPixels();
    
    for (let y = 0; y < video.height; y++) {
        for (let x = 0; x < video.width; x++) {
            const index = (y * video.width + x) * 4;
            const r = video.pixels[index];
            const g = video.pixels[index + 1];
            const b = video.pixels[index + 2];
            const currentColor = [r, g, b];
            
            if (colorDistance(currentColor, pickedColor) < 40) { 
                let col = floor(x / regionW);
                let row = floor(y / regionH);
                let regionIndex = row * cols + col;
                counts[regionIndex]++;
            }
        }
    }

    let maxIndex = counts.indexOf(max(counts));

    for(let i = 0; i < counts.length; i++){
        if(counts[i] > 10){
            currentSection.push(i);
        }
    }

    console.log(currentSection);
    return {
        region: maxIndex,
        cols,
        rows,
        regionW,
        regionH
    };
}


function captureColor(x, y) {
    frameCountMod++;
    let r;
    let g;
    let b;

    video.loadPixels();
    console.log(video.pixels);
    let camX = floor(map(x, 0, width, 0, video.width));
    let camY = floor(map(y, 0, height, 0, video.height));

    camX = constrain(camX, 0, video.width - 1);
    camY = constrain(camY, 0, video.height - 1);

    let index = (camY * video.width + camX) * 4;
    r = video.pixels[index];
    g = video.pixels[index + 1];
    b = video.pixels[index + 2];



    return color(r, g, b);
}


function initializeCamera() {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        let videoDevices = devices.filter(d => d.kind === "videoinput");
        console.log("Available cameras:", videoDevices);

        let camoDevice = videoDevices.find(d => d.label.includes("Camo"));

        if (camoDevice) {
            let constraints = {
                video: {
                    deviceId: { exact: camoDevice.deviceId }
                },
                audio: false
            };

            video = createCapture(constraints);
            video.size(160, 120);
            video.hide();
            console.log("Using Camo camera");
        } else {
            console.warn("Camo not found, falling back to default camera.");
            video = createCapture(VIDEO);
            video.size(160, 120);
            video.hide();
        }
    }).catch(err => {
        console.error("Error accessing cameras:", err);
    });
}
