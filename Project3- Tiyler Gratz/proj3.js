let particles = [];
let mic;
let clicked = false;
let delay;
let n = 50;
let filter;
let video;
let pickedColor = [0, 0, 0];
let frameCountMod = 0;
let centerX;
let centerY;
let xVel = 1;
let yVel = 1;
let diam = 500;
let held = false;
let keyHeld = false;
let hBounce = true;
let vBounce = true;


class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.noiseLevel = 2000;
        this.noiseScale = 0.02;
        this.num;
        this.n = 0;

        this.xMod = 0;
        this.yMod = 0;
        this.colMod;

        this.noiseChance = random(100);

    }

    display() {
        strokeWeight(25 + this.xMod);
        this.col = color(((this.colMod) / n) * 360, 80, 100);
        this.colMod += 1;
        if (this.colMod >= n) {
            this.colMod = 0;
        }
        this.col = captureColor(this.x, this.y);
        stroke(this.col);
        point(this.x + this.n, this.y + this.n);
    }

    move() {

        let level = mic.getLevel();
        let audioForce = map(level, 0, 1, 0, this.noiseLevel);

        let nt = this.noiseScale * frameCount;

        this.x = centerX + diam * cos(this.num) + this.xMod;
        this.y = centerY + diam * sin(this.num) + this.yMod;

        this.n = map(
            noise((nt + this.x) * this.noiseScale, ((nt + 1000) + this.y) * this.noiseScale),
            0,
            1,
            -audioForce,
            audioForce
        );

        this.xMod = random(-1, 1) * audioForce;
        this.yMod = random(-1, 1) * audioForce;


    }

}


function setup() {
    frameRate(60);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);
    background(0, 0, 0, 0.3);
    mic = new p5.AudioIn();
    initializeCamera();
    centerX = cw / 2;
    centerY = ch / 2;
    for (let i = 0; i < n; i += 0.5) {
        let particle = new Particle(random(windowWidth), random(windowHeight));
        particle.num = i;
        particle.colMod = i;
        particles.push(particle);
    }

}

function draw() {
    background(0);
    if (clicked && mic.enabled) {
        for (let particle of particles) {
            particle.move();
            particle.display();
        }

    } else {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(32);
        text("Click to start", width / 2, height / 2);
    }

    if (delay) {
        delay.process(mic, Math.abs(mouseY / ch), Math.abs(mouseX / cw), 2300);
    }

    if (filter) {
        let freq = map(mouseY, 0, height, 20, 10000);
        freq = constrain(freq, 0, 22050);
        filter.freq(freq);

    }



    if (held) {
        if (mouseButton === LEFT) {

            diam++;
        }

        if (mouseButton === RIGHT) {
            diam--;
        }
    }


    if(keyHeld){
        if(key == "s"){
            yVel += 1
        }
        if(key == "w"){
            yVel -= 1;
        }
        if(key == "a"){
        
            xVel -= 1;
        }
        if(key == "d"){
        
            xVel += 1;
        }
    }

    if(hBounce && (xVel > 0.01 && centerX + diam > cw || centerX - diam < 0)){
        xVel = -xVel / 1.1;
        hBounce = false;
    } else {

        hBounce = true;
    }
    if(vBounce && (yVel > 0.01 &&centerY + diam > ch || centerY - diam < 0)){
        yVel = -yVel / 1.1;
        vBounce = false;
    } else {

        vBounce = true;
    }

    centerX += xVel;
    centerY += yVel;


}

function mouseClicked() {
    if (!clicked) {
        userStartAudio()
        delay = new p5.Delay();
        mic.start();
        filter = new p5.BandPass();
        mic.connect(filter);
        clicked = true;
        delay.process(mic, 0.4, 0.7, 2300);
        delay.setType('pingPong');

    }


}

function mouseReleased() {
    held = false;
}

function mousePressed() {
    held = true;
}

function keyPressed(){
    keyHeld = true;
}

function keyReleased(){
    keyHeld = false;
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
    if (video) {
        video.remove();
    }

    let constraints = {};
    constraints = {
        video: { facingMode: "user" },
        audio: false,
    };


    video = createCapture(constraints);
    video.size(160, 120);
    video.hide();
}
