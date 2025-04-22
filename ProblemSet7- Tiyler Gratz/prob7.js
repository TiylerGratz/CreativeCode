let clicked = false;
let particles = []
let n = 300;
let playing;
let start = false;

class Particle{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.position = createVector(this.x, this.y);
        
        this.noiseLevel = 300;
        this.noiseScale = 0.02;
        this.num;
        this.n = 0;

        this.xMod = 0;
        this.yMod = 0;
        this.colMod;

        this.osc = new p5.Oscillator('sawtooth');
        this.freq;
        this.amp;

        this.noiseChance = random(100);
        
        colorMode(HSB, 360, 100, 100);
        //this.col = color((this.n ) * 360, 80, 100);
    }

    display(){
        strokeWeight(25);
        this.col = color(((this.colMod) / n ) * 360, 80, 100);
        this.colMod += 1;
        if(this.colMod >= n){
            this.colMod = 0;
        }
        stroke(this.col);
        point(this.x + this.n, this.y + this.n);
    }

    move(){
        
        let nt = this.noiseScale * frameCount;

        this.x = cw/2 + 500*cos(this.num) + this.xMod;
        this.y = ch/2 + 500*sin(this.num) + this.yMod;

        this.n = map(noise((nt + this.x)*this.noiseScale, ((nt + 1000)+ this.y) *this.noiseScale), 0, 2, -this.noiseLevel, this.noiseLevel)

        if(!clicked){
            this.xMod = lerp(this.xMod, 0, 0.05);
            this.yMod = lerp(this.yMod, 0, 0.05);
        }

        this.freq = constrain(map(this.x, 0, cw, 100, 400), 100, 400);
        this.amp = constrain(map(this.y, ch, 0, 0, 1), 0, 1);

        this.osc.freq(this.freq);
        this.osc.amp(this.amp, 0.1);
        
    }

    clicked(){
        this.xMod += 5 * Math.sign(mouseX - this.x);
        this.yMod += 5 * Math.sign(mouseY - this.y);
    }

}




function setup(){
    frameRate(60);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);

    for(let i = 0; i < n; i+=0.5){
        let particle = new Particle(random(windowWidth), random(windowHeight));
        particle.num = i;
        particle.colMod = i;
        particles.push(particle);
    }
    

}

function draw(){
    background('rgba(255, 255, 255, 0.18)');

    for(let particle of particles){
        particle.move();
        
        if(clicked){
            particle.clicked();
        }
        particle.display();
    }


    

}

function mousePressed(){
    clicked = true;
    if(!start){
        for(p of particles){
            if(p.noiseChance > 99.5){
                p.osc.start();
            }
            
        }
    }
    start = true;
    
}

function mouseReleased(){
    clicked = false;
    
}