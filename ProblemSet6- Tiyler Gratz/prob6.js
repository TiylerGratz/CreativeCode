let ambientSound;
let bop;
let laserShot;
let amplitude;
let metalClang;
let clicked = false;
let asteroids = [];
let stars  = [];
let n = 50;
let shot;
let ship;

class Circle{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.position = createVector(this.x, this.y);
        this.xspeed = random(8) * Math.sign(random(2) - 1);
        this.yspeed = this.xspeed * Math.sign(random(2) - 1);;
        this.width = random(50) + 50;
        this.height = random(50) + 50;
        this.num = Math.floor(random(8)) + 3;
        this.holeSizes = [];
        for(let i = 0; i < this.num; i++){
            this.holeSizes.push(random(8));
        }
        this.holeLocations = [];
        for(let i = 0; i < this.num; i++){
            this.holeLocations.push([this.x + random(this.width), this.y+ random(this.height)]);

        }
        this.i;
    }

    display(){
        if(this.width < 5 || this.height < 5){
            asteroids.splice(this.i, 1);
        }
        push();
        
        
        fill('rgb(117, 117, 117)');
        ellipse(this.x, this.y, this.width, this.height);
        
        pop();
    }

    move(){
        this.y += this.yspeed;
        this.x += this.xspeed;
        if(this.x - this.width/2 < 0 || this.x + this.width/2> windowWidth){
            this.xspeed *= -1;
            
        }
        if(this.y - this.height/2 < 0 || this.y + this.height/2 > windowHeight){
            this.yspeed *= -1;
            
        }

        
    }

    clicked(){
        if(mouseX > this.x - this.width/2 && mouseX < this.x - this.width/2 + this.width && mouseY > this.y - this.height/2&& mouseY < this.y - this.height/2 + this.height){
            asteroids.splice(this.i, 1);
            for(let i = 0; i < Math.floor(random(5) + 2); i++){
                let ast = new Circle(this.x, this.y);
                ast.height = this.height / 2;
                ast.width = this.width/ 2;
                asteroids.push(ast);
                bop.setVolume(2 * this.width/100);
                bop.play();
                bop.playMode("sustain");
            }
        }
    }
}

class Star{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.startSize = random(5) + 7;
        this.size = this.startSize;
    }

    display(){
        push();   
        if(amplitude != undefined){
           this.size = this.startSize + (100 * amplitude.getLevel()); 
        }  
        stroke('rgba(151, 176, 237, 0.45)');
        strokeWeight(this.size/2);
        fill('rgb(255, 255, 255)');
        ellipse(this.x, this.y, this.size);
        pop();
    }
}

class Shot{
    constructor(){
        this.size = 20;
    }

    display(){
        stroke('rgba(19, 235, 69, 0.52)');
        strokeWeight(this.size);
        line(ship.x, ship.y, mouseX, mouseY);
        

        stroke('rgb(0, 0, 0)');
        strokeWeight(1);

        this.size -= 5;
        if(this.size< 0){
            shot = undefined;
        }
    }
}

class Ship{
    constructor(){
        this.x = windowWidth/2;
        this.y = windowHeight/2;
        this.xspeed = 2;
        this.yspeed = 2;
    }

    display(){
        push();
        fill('rgba(0, 255, 17, 0.66)');
        ellipse(this.x, this.y, 10, 20);
        
        fill('rgba(138, 211, 238, 0.42)');
        ellipse(this.x, this.y, 40);

        fill('rgb(104, 65, 119)');
        ellipse(this.x, this.y + 15, 60, 25);
        
        pop();
    }

    move(){
        this.y += this.yspeed;
        this.x += this.xspeed;
        if(this.x - 20 < 0 || this.x + 20> windowWidth){
            this.xspeed *= -1;
            metalClang.play();
            metalClang.playMode("sustain");
        }
        if(this.y - 20 < 0 || this.y + 20 > windowHeight){
            this.yspeed *= -1;
            metalClang.play();
            metalClang.playMode("sustain");
        }

        
    }
}

function preload() {
    soundFormats('mp3', 'wav');
    ambientSound = loadSound('ambienceSpaceNoise.wav');
    bop = loadSound('bop.wav');
    laserShot = loadSound('laserShot.wav');
    metalClang = loadSound('metalClang.mp3')
  }


function setup(){
    background(0);
    frameRate(60);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);
    for(let i = 0; i < n; i++){
        let star = new Star(random(windowWidth), random(windowHeight));
        stars.push(star);
    }

    ship = new Ship();
}

function draw(){
    background('rgba(0, 0, 0, 0.18)');
    if(clicked){
        ambientSound.play(); 
    }
    for(let star of stars){
        star.display();
    }
    let n = 0;
    for(let circle of asteroids){
        circle.move();
        circle.display();
        
        circle.i = n;
        n++;
    }

    if (frameCount % 240 == 0) {
        asteroids.push(new Circle(random(windowWidth/2), random(windowHeight/2)));
        console.log("New Asteroid");
    }

    if(shot != undefined){
        shot.display();
    }
    
    ship.move();
    ship.display();

    

}

function mousePressed(){
    if(!clicked){
        amplitude = new p5.Amplitude();
        amplitude.setInput(ambientSound);
    }
    ambientSound.play();
    ambientSound.playMode("untilDone");
    clicked = true;
    shot = new Shot();
    laserShot.play();
    laserShot.playMode("restart");
    for(let circle of asteroids){
        
        circle.clicked();
    }
}