let bee;
let butterflyBlue;
let butterflyOrange;
let butterflyPink;
let dirt;
let dirtBurned;
let dirtWet;
let fire1;
let fire2;
let grow1;
let grow2;
let grow3;
let grow4;
let grassFlowers;
let lowWater0;
let lowWater1;
let lowWater2;
let lowWater3;
let lowWater4;
let lowWater5;
let insects;

let lowWaterFrames = [];
let fireFrames = [];
let growFrames = [];


let clicked = false;
let video;
let pickedColor = [0, 0, 0];
let frameCountMod = 0;
let centerX;
let centerY;
let held = false;
let currentSection = [];

let squares = [];
let numSquares = 5;
let colors = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
let squareLabel = ["grass", "dirt", "fire", "water", "flowers"];
let n = 0;
let gridSize = 10;
let gridSquares = [];

let liveInsects = [];

let cw;
let ch;


let displayGraphics = false;

class Square {
    constructor(num) {
        this.x = 0;
        this.y = num * 100;

        this.w = 100;
        this.h = 100;
        this.num = num;

    }

    display() {
        fill(colors[this.num][0], colors[this.num][1], colors[this.num][2]);
        rect(this.x, this.y, this.w, this.h);
        fill(255);
        stroke(0);
        strokeWeight(3);
        textSize(22);
        text(squareLabel[this.num], this.x + 5, this.y + this.h / 2);
    }

}

class GridSquare {
    constructor(x, y, w, h, indX, indY) {
        this.x = x;
        this.y = y;
        this.type = "dirt"
        this.w = w;
        this.h = h;
        this.img = dirt;
        this.ind = 0;
        this.watered = false;
        this.indX = indX;
        this.indY = indY;
        this.summonInsects = false;
        this.count = 0;
    }

    display() {
        if (displayGraphics) {
            tint(255, 100);
        } else {
            tint(255, 255);
        }
        if (this.type == "dirt") {
            this.img = dirt;
        } else if (this.type == "grass") {
            if (this.ind < growFrames.length - 1 && frameCount % 60 == 0) {
                this.ind++;
            }
            this.img = growFrames[this.ind];

        } else if (this.type == "fire") {
            for (let j = liveInsects.length - 1; j >= 0; j--) {
                let i = liveInsects[j];
                i.speed = 12;

                if (
                    i.x > this.x && i.x < this.x + this.w &&
                    i.y > this.y && i.y < this.y + this.h
                ) {
                    liveInsects.splice(j, 1);
                }
            }
            if (frameCount % 5 == 0) {
                this.ind++;

            }
            if (this.ind >= 2) {
                this.ind = 0;
            }
            this.img = fireFrames[this.ind];
            if (random(10) > 9.99) {
                for (let row of gridSquares) {
                    for (let i of row) {
                        if (i.indX - this.indX == 1 && random(10) > 4) {
                            i.addFire();
                        }
                        if (this.indX - i.indX == 1 && random(10) > 4) {
                            i.addFire();
                        }
                        if (i.indY - this.indY == 1 && random(10) > 4) {
                            i.addFire();
                        }
                        if (this.indY - i.indY == 1 && random(10) > 4) {
                            i.addFire();
                        }
                    }
                }
            }
            if(this.count > 30){
                this.count = 0;
                this.type = "burned";
            }
        } else if (this.type == "water") {
            this.img = dirtWet;
        } else if (this.type == "flower") {
            this.img = grassFlowers;
        } else if (this.type == "burned") {
            this.img = dirtBurned;
        } else if (this.type == "dyingGrass") {
            if (this.watered) {
                this.ind = 3;
                this.addSeeds();
            } else {
                if (this.ind < lowWaterFrames.length - 1 && frameCount % 40 == 0) {
                    this.ind++;
                }
                this.img = lowWaterFrames[this.ind];
                if (this.ind === lowWaterFrames.length - 1) {
                    this.turnToDirt();
                }
            }

        }
        image(this.img, this.x, this.y, this.w, this.h)

        if (this.watered && this.count == 15) {
            this.watered = false;
            if (this.type == "grass" || this.type == "flower") {
                this.type = "dyingGrass";
            } else if (this.type == "water") {
                this.turnToDirt();
            }

            this.count = 0;

        }
        if (frameCount % 60 == 0) {
            this.count++;
        }

        if (this.type === "flower" && random(10000) > 9990 && this.summonInsects) {
            let i = new insect(liveInsects.length);
            liveInsects.push(i);
        }

    }

    addSeeds() {
        if (this.watered && this.type != "burned" && this.type != "fire") {
            this.type = "grass";
        }
        this.summonInsects = false;

    }

    turnToDirt() {
        this.type = "dirt";
        this.ind = 0;
        this.summonInsects = false;
    }

    addFire() {

        if (this.type == "grass" || this.type == "flower" || this.type == "dyingGrass") {
            this.type = "fire";
            this.count = 0;
            this.summonInsects = false;
        }
        
    }

    addWater() {
        this.count = 0;
        if (this.type == "fire") {
            this.type = "burned";
            this.summonInsects = false;
            this.ind = 0;
        } else if (this.type == "dirt") {
            this.type = "water";
            this.summonInsects = false;
            this.watered = true;
            this.ind = 0;
        } else {
            this.watered = true;
        }




    }

    addFlowers() {
        if (this.type == "grass" && this.ind == 3) {
            this.type = "flower";
            this.ind = 0;
        }
        this.summonInsects = true;

    }

}

class insect {
    constructor(ind) {
        this.ind = ind;
        this.img = insects[Math.floor(random(insects.length))];
        this.w = 100;
        this.h = 100;

        let edge = floor(random(4));
        if (edge === 0) {
            this.x = -this.w;
            this.y = random(ch);
            this.vx = random(1.5, 3);
            this.vy = random(-1, 1);
        } else if (edge === 1) {
            this.x = random(cw);
            this.y = -this.h;
            this.vx = random(-1, 1);
            this.vy = random(1.5, 3);
        } else if (edge === 2) {
            this.x = cw + this.w;
            this.y = random(ch);
            this.vx = random(-3, -1.5);
            this.vy = random(-1, 1);
        } else {
            this.x = random(cw);
            this.y = ch + this.h;
            this.vx = random(-1, 1);
            this.vy = random(-3, -1.5);
        }

        this.noiseOffset = random(1000);
        this.speed = 3;
        this.angle = atan2(this.vy, this.vx);
    }

    move() {

        let flutter = map(noise(this.noiseOffset), 0, 1, -PI / 8, PI / 8);
        let flutteredAngle = atan2(this.vy, this.vx) + flutter;

        this.x += (cos(flutteredAngle) * this.speed);
        this.y += (sin(flutteredAngle) * this.speed);

        this.angle = flutteredAngle;
        this.noiseOffset += 0.01;
    }

    isOffscreen() {
        return (this.x < -this.w || this.x > cw + this.w || this.y < -this.h || this.y > ch + this.h);
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.angle - PI);
        imageMode(CENTER);
        image(this.img, 0, 0, this.w, this.h);
        pop();
    }
}

function preload() {
    bee = loadImage("bee.png");
    butterflyBlue = loadImage("butterfly.png");
    butterflyOrange = loadImage("butterflyOrange.png");
    butterflyPink = loadImage("butterflyPink.png");
    dirt = loadImage("dirt.png");
    dirtBurned = loadImage("dirtBurned.png");
    dirtWet = loadImage("dirtWet.png");
    fire1 = loadImage("fire0000.png");
    fire2 = loadImage("fire0001.png");
    grow1 = loadImage("frame0001.png");
    grow2 = loadImage("frame0002.png");
    grow3 = loadImage("frame0003.png");
    grow4 = loadImage("frame0004.png");
    grassFlowers = loadImage("grassFlowers.png");
    lowWater0 = loadImage("grassLowWater0000.png");
    lowWater1 = loadImage("grassLowWater0001.png");
    lowWater2 = loadImage("grassLowWater0002.png");
    lowWater3 = loadImage("grassLowWater0003.png");
    lowWater4 = loadImage("grassLowWater0004.png");
    lowWater5 = loadImage("grassLowWater0005.png");

    lowWaterFrames = [lowWater0, lowWater1, lowWater2, lowWater3, lowWater4, lowWater5];
    fireFrames = [fire1, fire2];
    growFrames = [grow1, grow2, grow3, grow4];
    insects = [butterflyBlue, butterflyOrange, butterflyPink, bee];
}

function setup() {
    frameRate(60);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);
    background(0, 0, 0, 0.3);
    initializeCamera();
    centerX = cw / 2;
    centerY = ch / 2;
    for (let i = 0; i < numSquares; i++) {

        squares.push(new Square(i));
    }

    gridSquares = [];
    for (let i = 0; i < gridSize; i++) {
        gridSquares[i] = [];
        for (let j = 0; j < gridSize; j++) {
            let x = j * (cw / gridSize);
            let y = i * (ch / gridSize);
            gridSquares[i][j] = new GridSquare(x, y, cw / gridSize, ch / gridSize, j, i);
        }
    }

    for (let h of gridSquares) {
        for (let v of h) {
            v.display();
        }
    }
    console.log(gridSquares);






}

function draw() {
    if (!video || !video.loadedmetadata) return;
    image(video, 0, 0, width, height);

    if (clicked) {
        video.loadPixels();

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                let regionW = video.width / gridSize;
                let regionH = video.height / gridSize;

                let centerX = floor((col + 0.5) * regionW);
                let centerY = floor((row + 0.5) * regionH);

                if (centerX >= video.width || centerY >= video.height) continue;

                let index = (centerY * video.width + centerX) * 4;
                let r = video.pixels[index];
                let g = video.pixels[index + 1];
                let b = video.pixels[index + 2];

                let pixelColor = [r, g, b];

                for (let i = 0; i < colors.length; i++) {
                    if (colorDistance(pixelColor, colors[i]) < 40) {
                        if (i === 0) {
                            gridSquares[row][col].addSeeds();
                        } else if (i === 1) {
                            gridSquares[row][col].turnToDirt();
                        } else if (i === 2) {
                            gridSquares[row][col].addFire();
                        } else if (i === 3) {
                            gridSquares[row][col].addWater();
                        } else if (i === 4) {
                            gridSquares[row][col].addFlowers();
                        }
                        break;
                    }
                }
            }
        }
    }



    for (let h of gridSquares) {
        for (let v of h) {
            v.display();
        }
    }

    for (let s of squares) {
        s.display();
    }

    for (let i = liveInsects.length - 1; i >= 0; i--) {
        liveInsects[i].move();
        liveInsects[i].display();

        if (liveInsects[i].isOffscreen()) {
            liveInsects.splice(i, 1);
        }
    }



}

function mouseClicked() {
    if (!clicked) {
        userStartAudio()
        clicked = true;

    }
    let picked = captureColor(mouseX, mouseY);
    colors[n] = [red(picked), green(picked), blue(picked)];

    n++;

    if (n > colors.length - 1) {
        n = 0;
    }
}

function keyPressed() {

    if (key === 's') {
        displayGraphics = !displayGraphics;
    }

}

function colorDistance(c1, c2) {
    return dist(c1[0], c1[1], c1[2], c2[0], c2[1], c2[2]);
}

function detectDominantColorRegion(num) {
    const cols = gridSize;
    const rows = gridSize;
    const regionW = video.width / cols;
    const regionH = video.height / rows;
    const counts = Array(cols * rows).fill(0);
    currentSection = [];
    cw = video.width;
    ch = video.height;
    video.loadPixels();

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          
            let centerX = floor((col + 0.5) * regionW);
            let centerY = floor((row + 0.5) * regionH);
            if (centerX >= video.width || centerY >= video.height) continue;

            const index = (centerY * video.width + centerX) * 4;
            const r = video.pixels[index];
            const g = video.pixels[index + 1];
            const b = video.pixels[index + 2];
            const currentColor = [r, g, b];

            if (colorDistance(currentColor, colors[num]) < 40) {
                let regionIndex = row * cols + col;
                counts[regionIndex]++;
            }
        }
    }

    let maxIndex = counts.indexOf(max(counts));

    let matchedSections = [];
    for (let i = 0; i < counts.length; i++) {
        if (counts[i] > 10) {
            matchedSections.push(i);
        }
    }

    return {
        region: maxIndex,
        cols,
        rows,
        regionW,
        regionH,
        matchedSections
    };
}


function captureColor(x, y) {
    frameCountMod++;
    let r;
    let g;
    let b;

    video.loadPixels();
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
