
let ctx;
let cw;
let ch;
let n = 1;

let x = [];
let y = [];
let diam = [];
let r = [];
let dx = [];
let dy = [];
let col = [];
let eli = [];


let bgRed = 0;
let bgGreen = 0;
let bgBlue = 0;
let cycle = false;

function createCircle(i){
    diam[i] = random(20, 75);
    eli[i] = diam[i];
    r[i] = diam[i]/2;
    x[i] = random(r[i], cw-r[i]);
    y[i] = random(r[i], ch - r[i]);
    dx[i] = random(1, 10);
    dy[i] = random(1, 10);

    let red = random(256);
    let green = random(256);
    let blue = random(256);

    col[i] = color(red, green, blue);
    if(Math.random() < 0.5){
        dx[i] *= -1;
    }
    if(Math.random() < 0.5){
        dy[i] *= -1;
    }
}



function setup(){
    frameRate(60);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);

    for(let i = 0; i < n; ++i){
        createCircle(i);
    }

}



function draw(){
    background(bgRed, bgGreen, bgBlue, 80);
    
    if(!cycle){
        if(bgBlue < 256){
            bgBlue++;
        } else if(bgGreen< 256){
            bgGreen++;
        }else if(bgRed< 256){
            bgRed++
            
        } else{
            cycle = true;
        }
    } else {
        if(bgBlue > 0){
            bgBlue--;
        } else if(bgGreen>0){
            bgGreen--;
        }else if(bgRed>0){
            bgRed--
            
        } else{
            cycle = false;
        }
    }


    for(let i = 0; i < n; ++i){
        fill(col[i]);
        ellipse(x[i], y[i], diam[i], eli[i]);


        if(x[i] < r[i] || x[i]> cw - r[i]){
            dx[i] = -dx[i];
            col[i] = color(random(256), random(256), random(256));
            eli[i]-= 10;
            createCircle(n);
            n++;
        }
        if(y[i] < r[i] || y[i] > ch - r[i]){
            dy[i] = -dy[i];
            col[i] = color(random(256), random(256), random(256));
            eli[i]-= 10;

        }


        x[i]+=dx[i];
        y[i]+=dy[i];
    }
}