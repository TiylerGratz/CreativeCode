let circle;
let mouseXStart;
let mouseYStart;

let circles = [];
let n = 0;

let timer = false;



class Circle {
    constructor(){
        this.position = createVector(mouseX, mouseY);
        this.velocity;
        this.held = false;
        this.modX = (Math.random() * 2) - 1;
        this.modY = (Math.random() * 2) - 1;
        this.color = 200;
        this.colorInvert;
        this.size = 0;
        
    }

    
    display(){
        strokeWeight(this.size);
        push();
        translate(this.position);
        square(mouseX * this.modX, mouseY * this.modY, this.size);
        pop();
    }

    move(){
        stroke("#" + this.color.toString(16));
        this.velocity = createVector((mouseX - mouseXStart) * this.modX, (mouseY - mouseYStart) * this.modY);
        mouseXStart = mouseX;
        mouseYStart = mouseY;
        this.position.add(this.velocity);

        if(this.colorInvert){
            this.color -= 16;
        } else {
            this.color += 16;
        }
        if(this.color > 64500 || this.color < 0){
            this.colorInvert = !this.colorInvert;
        }

       
    }
}


function setup(){

    frameRate(60);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);
    background(0);
    circle = new Circle();
    circles[n] = circle;
    n++;
    mouseYStart = mouseY;
    mouseXStart = mouseX;
}

function draw(){
    background(0, 0, 0, 10);
    
    for(let i = 0; i < circles.length; i++){
        circles[i].move();
        circles[i].display();
    }
    console.log(circles.length);


    if(timer){
        if (frameCount % 30 == 0) { 
            for(let i = 0; i < circles.length; i++){
                circles[i].size++;

            }
        }
    }
    

}

function mousePressed() {
    
    circle.held = true;
    circle = new Circle();
    circles[n] = circle;
    n++;
    timer = true;
}

function mouseClicked() {
    circle.held = false;
    timer = false;
}



