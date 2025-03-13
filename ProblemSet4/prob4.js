let mouseXStart;
let mouseYStart;
let newLine;
let lines = [];
let circles = [];
let n = 100;

class Circle{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.position = createVector(this.x, this.y);
    }

    display(){
        push();
        translate(this.position);
        stroke('rgba(255, 255, 255, 0.51)');
        strokeWeight(random(10) + 5);
        ellipse(this.x, this.y, 5);
        pop();
    }

    move(){
        this.y+=10;
        this.position = createVector(this.x, this.y);
    }
}

class Line{

    constructor(){
        this.noiseLevelX = random(windowWidth);
        this.noiseLevelY = random(windowHeight);
        this.noiseScale = 0.3;

        this.x = frameCount;
        this.nx = this.noiseScale * this.x;

        this.y = this.noiseLevelX * noise(this.nx);
        this.position = createVector(this.x, this.y);
    }

    display(){
        push();
        translate(this.position);
        let r = Math.floor(random(80));
        let g = Math.floor(random(80));
        let b = Math.floor(random(255));
        let a = random(1);
        stroke('rgba( '+ r + ", " + g + "," + b + ", " + a +')');
        strokeWeight(random(10) + 5);
        line(0, 0, this.x, this.y);
        pop();
        if(random() > 0.99){
            let circle = new Circle(this.x, this.y);
            circles.push(circle);
        }
        
        
    }

    move(){
        
        this.dx = this.noiseScale * this.y;
        this.x = this.noiseLevelX * noise(this.dx);
        this.x *= Math.sign(mouseX - this.x);

        this.nx = this.noiseScale * Math.abs(this.x);
        this.y = this.noiseLevelY * noise(this.nx);
        this.y *= Math.sign(mouseY - this.y);

        
        this.position = createVector(this.x + (mouseX - mouseXStart), this.y+ (mouseY - mouseYStart))
        mouseXStart = mouseX;
        mouseYStart = mouseY;
    }
}


function setup(){
    background(0);
    frameRate(30);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);
    for(let i = 0;  i < n; i++){
        newLine = new Line();
        lines.push(newLine);
    }
    
}

function draw(){
    background('rgba(0, 0, 0, 0.2)');
    for(let l in lines){
        lines[l].move();
        lines[l].display();
    }

    for(let i = 0; i < circles.length; i++){
        circles[i].move();
        circles[i].display();
        if(circles[i].y > windowHeight){
            circles.splice(i, 1);
        }
    }
    

}