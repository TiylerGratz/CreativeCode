

let pane;
let xdir = 0;
let ydir = 0;
let circles = [];
let food = [];
let speed = document.getElementById("speedSlider").value;
let cw;
let ch;
let numFood = document.getElementById("foodSpawn").value;
let foodTime = 60;
let colorPicker;
let size = document.getElementById("sizeSlider").value;
let randomColors = document.getElementById("randomColors").checked;




class Player {
    constructor(index) {
        if (circles.length == 0) {
            this.x = 200;
            this.y = 200;
        } else {
            this.x = circles[circles.length - 1].x - (xdir * 20);
            this.y = circles[circles.length - 1].y - (ydir * 20);
        }
        
        this.position = createVector(this.x + xdir, this.y + ydir);
        this.index = index;

        this.xdir = 0;
        this.ydir = 0;
        if (index != 0) {
            this.xdir = circles[this.index - 1].xdir;
            this.ydir = circles[this.index - 1].ydir;
        }
        this.color = "rgb(" + Math.floor(random(255)) + "," + Math.floor(random(255)) + "," + Math.floor(random(255)) + ")";



    }


    display() {

        push();
        translate(this.position);
        let color = colorPicker.value();
        if(randomColors){
            color = this.color;
        }
        fill(color);
        ellipse(this.x, this.y, size)
        if(this.index == 0){
            fill('black');
            ellipse(this.x - size /4, this.y, size/8);
            ellipse(this.x + size /4, this.y, size/8);
            noFill();
            strokeWeight(size/8);
            stroke('black');
            if(document.getElementById("emotionPicker").value == "happy"){
                arc(this.x, this.y + size/5, size/2, size/3, 0, PI);
            } else {
                arc(this.x, this.y + size/3.5, size/2, size/4, PI, 0);
            }
            
            
        }
        pop();
    }

    move() {
        if (this.index == 0) {
            this.position = createVector(this.x, this.y);
            this.x += xdir * speed ;
            this.y += ydir * speed;
            this.xdir = xdir;
            this.ydir = ydir;
        } else {
            this.x = circles[this.index - 1].x;
            this.y = circles[this.index - 1].y;
            this.position = createVector(this.x, this.y);
        }


    }
}

class Food {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.position = createVector(this.x, this.y);
        this.size = 15;
    }

    display() {
        push();
        translate(this.position);
        fill('rgb(12, 99, 186)');
        ellipse(this.x, this.y, this.size);
        pop();
    }
}


function setup() {

    let elementBounds = document.getElementById("elements").getBoundingClientRect();
    frameRate(speed);
    cw = elementBounds.width / 1.5;
    ch = elementBounds.width /1.5;
    let canvas = createCanvas(cw, ch);
    
    canvas.position(elementBounds.x + elementBounds.width/7, elementBounds.y + elementBounds.height)
    background(0);
    circles.push(new Player(0));

    colorPicker = createColorPicker('deeppink');
    colorPicker.position(elementBounds.x + 40, elementBounds.y + 20);


}

function draw() {

    frameRate(speed);
    background(0, 0, 0);
    speed = document.getElementById("speedSlider").value / 3;
    numFood = document.getElementById("foodSpawn").value;
    size = document.getElementById("sizeSlider").value;
    randomColors = document.getElementById("randomColors").checked

    for (let i = circles.length - 1; i > -1; i--) {
        circles[i].move();
        circles[i].display();  

    }
    if (circles[0].x*2 + size/2 > cw || circles[0].x*2 - size/2 < 0 || circles[0].y*2 + size/2 > ch|| circles[0].y*2 - size/2 < 0) {
            gameOver();
        }
    for (let j = 0; j < food.length; j++) {
            if (circles[0].x + size/2 > food[j].x && circles[0].x - size/2 < food[j].x && circles[0].y + size/2 > food[j].y && circles[0].y - size/2 < food[j].y) {
                circles.push(new Player(circles.length));
                food.splice(j, 1);
            }
        }
    for (let i = 0; i < food.length; i++) {
        food[i].display();
    }

    if (frameCount % foodTime == 0) {
        for(let i = 0; i < numFood; i++){
            let newFood = new Food(random(cw /2), random(ch/2));
            food.push(newFood);
        }
        

    }



}

function gameOver() {
    window.location.reload();
}

function up() {
    xdir = 0;
    ydir = -1;
}

function down() {
    xdir = 0;
    ydir = 1;
}

function left() {
    xdir = -1;
    ydir = 0;
}

function right() {
    xdir = 1;
    ydir = 0;
}



