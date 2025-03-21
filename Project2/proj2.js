let shapes = [];
let n = 50;
let mod = 1;




class Shape {
    constructor(){
        this.shape = Math.floor(random(3));
        this.x = random(windowWidth);
        this.y = random(windowHeight);
        this.w = random(30) + 10;
        this.h = random(30) + 10;
        this.speed = random(3) + 1;
        this.angle = 0;
        this.gmod = random(155) + 100;
        this.bmod = random(155) + 100;
        this.size = random(5);
        this.startW = this.w;
        this.startH = this.h;

        this.outline = 255;

        this.r = 150;
        this.g = 0;
        this.b = 0;
    }

    display(){
        
        
        push();
        strokeWeight(this.size, 0.5);
        stroke(this.outline);
        fill(this.r, this.g, this.b, 95);
        translate(this.x, this.y);
        rotate(this.angle);

        if(this.shape == 0){
            rect(0, 0, this.w, this.h);
        } else if (this.shape == 1){
            ellipse(0, 0, this.w, this.h);
        } else if (this.shape == 2){
            triangle(-this.w / 2, this.h / 2, 0, -this.w / 2, this.h / 2, this.w / 2);
        }
        
        
        
        pop();
    }
    move(){


        let dy = mouseY - this.y;
        let dx = mouseX - this.x;
        let dist = Math.floor(Math.sqrt((dx)**2 + (dy)**2));
        
        if(this.x != mouseX){
            this.x += Math.sign(mouseX - this.x) * this.speed * mod;
        }
        if(this.y != mouseY){
            this.y += Math.sign(mouseY - this.y) * this.speed * mod;
        }
        

        

        this.angle = Math.atan2(dy , dx);

        this.g = this.gmod % dist;
        this.b = this.bmod % dist;

        this.outline = 255 % dist;

        this.w = dist / 5;
        this.h = dist/ 5;


    }

}


function setup(){
    frameRate(60);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);
    background(0, 0, 0, 0.3);
    for(let i = 0; i < n; i++){
        shapes[i] = new Shape();
    }

    angleMode(RADIANS);
}

function draw(){
    background(0, 0, 0, 50);
    for(let i = 0; i < n; i++){
        shapes[i].move();
        shapes[i].display();
    }

    
}

function mouseClicked(){
    mod = -mod;
    let newShape = new Shape();
    shapes[n] = newShape;
    n++;

}