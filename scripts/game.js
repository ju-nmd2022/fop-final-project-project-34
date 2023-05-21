let mainCharacter;
let characterImages = [];
let visiblePlatforms = [];
let gameState = "start";
let animationFrame = 0;
let score = 0;
let grace = 0;

function preload(){
    characterImages[0] = loadImage('running.gif');
    characterImages[1] = loadImage('jumping.gif');
    characterImages[2] = loadImage('idle.gif');
    characterImages[3] = loadImage('falling.png');
}

class Character{
    constructor(x, y){
        this.positionX = x;
        this.positionY = y;
        this.velocity = 5;
        this.acceleration = 0;
    }
    move(){
        this.positionX += this.velocity;
        if(this.positionX > width + 20){
            this.positionX = 0;
        }
    }
    accelerate(){
        this.velocity += this.acceleration;
    }
    jump(){
        
    }
    draw(action){
        push();
        // stroke(150);
        // strokeWeight(2);
        // fill(20);
        translate (this.positionX, height - this.positionY);
        // ellipse(0, 0, 40);
        switch(action){
            case 'running':
                image(characterImages[0], -25, -35, 55, 55);
                break;
            case 'jumping':
                image(characterImages[1], -25, -35, 55, 55);
                break;
            case 'idle':
                image(characterImages[2], -25, -35, 30, 55);
                break;
            case 'falling':
                image(characterImages[3], -25, -35, 55, 55);
                break;
            default:
                break;
        }
        pop();
    }
}

class Platform{
    constructor(x, y, gap){
        this.centerX = x ;
        this.centerY = y ;
        this.gapWidth = gap;
        this.verticalVelocity = 8;
    }

    moveDown(){
        this.centerY += this.verticalVelocity;
    }

    moveUp(){
        this.centerY -= this.verticalVelocity;
    }

    draw(){
        push();
        translate (this.centerX, this.centerY);
        stroke(100);
        noFill();
        rect(-(this.gapWidth / 2) - 600, -20, 600, 40, 10);
        rect(+(this.gapWidth / 2), -20, 600, 40, 10);
        pop();  
    }
}

function initializePlatforms(){
    for(let iterator = 1; iterator <= 6; iterator++){
        visiblePlatforms.push(new Platform(Math.floor(Math.random() * (width - 220)) + 100, Math.floor(height * iterator / 5) - 240, Math.floor(Math.random() * 40) + 80));
    }
    visiblePlatforms[4] = new Platform(0, visiblePlatforms[4].centerY, 0); // The first platform should not have a gap in it
}

function initializeCharacter(){
    mainCharacter = new Character(45, 285);
}

function setup(){
    frameRate(60);
    createCanvas(600, 800);
    initializePlatforms();
    initializeCharacter();
}

function gameWindow(){
    push();
    noStroke();
    fill(20);
    rect(0, 0, width, 20);
    rect(0, 0, 20, height);
    rect(width - 20, 0, 20, height);
    rect(0, height - 20, width, 20);
    stroke(125);
    strokeWeight(1);
    noFill();
    rect(10, 10, width - 20, height - 20);
    rect(20, 20, width - 40, height - 40);
    pop();
}

function drawCharacter (action){
    mainCharacter.draw(action);
}

function drawPlatforms(){
    for(let platform of visiblePlatforms){
        platform.draw();
    }
}

function checkInput(){
    if(keyIsPressed || touches.length >= 1){
        if(key === " " || touches.length >= 1){
            switch(gameState){
                case "start":
                    gameState = "running";
                    break;
                case "running":
                    if(grace === 0)
                        gameState = "jumping";
                    else grace--;
                    break;
                case "jumping":
                    break;
                case "end":
                    gameState = "start";
                    score = 0;
                    visiblePlatforms = [];
                    initializePlatforms();
                    initializeCharacter();
                    grace = 5;
                    break;
                default:
                    break;
            }
        }
    }
}

function showScore (){
    push();
    fill (155);
    textFont("Helvetica");
    textSize (32);
    text(score, 286, 150);
    pop();
}

function instructions(){
    push();
    fill(20);
    stroke(125);
    rect(150, 150, 300, 200);
    fill(200);
    textSize(36);
    text("Press Space", 200, 260);
    pop();
}

function gameOver(){
    push();
    fill(20);
    stroke(125);
    rect(100, 100, 400, 250);
    fill(200);
    textSize(30);
    text("Game Over", 230, 200);
    textSize(20);
    text("Press Space To Try Again", 190, 300);
    pop();
}

function draw(){
    switch(gameState){
        case "start":
            background(20);
            drawPlatforms();
            mainCharacter.move();  
            drawCharacter('running');
            gameWindow();
            if(grace === 0)
                instructions();
            break;
        case "running":
            background(20);
            drawPlatforms();
            mainCharacter.move();
            drawCharacter('running');
            gameWindow();
            showScore();
            if(((mainCharacter.positionX > 40 + visiblePlatforms[4].centerX - visiblePlatforms[4].gapWidth / 2) && (mainCharacter.positionX < (visiblePlatforms[4].centerX + visiblePlatforms[4].gapWidth / 2) - 40))){
                gameState = "end";
                // In this case we have lost
            }
             break;
        case "jumping":
            background(20);
            for(let platform of visiblePlatforms){
                platform.moveDown();
            }
            drawPlatforms();
            mainCharacter.move();            
            drawCharacter('jumping');
            gameWindow();
            animationFrame++;
            if(animationFrame == 20){
                gameState = "running";
                animationFrame = 0;
                visiblePlatforms.pop();
                visiblePlatforms.unshift(new Platform(Math.floor(Math.random() * (width - 220)) + 100, Math.floor(height / 5) - 240, Math.floor(Math.random() * 40) + 80));
                score++;
                break;
            }
            if((animationFrame > 10) && ((mainCharacter.positionX < 10 + visiblePlatforms[3].centerX - visiblePlatforms[3].gapWidth / 2) || (mainCharacter.positionX > (visiblePlatforms[3].centerX + visiblePlatforms[3].gapWidth / 2) - 10))){
                gameState = "end";
                animationFrame = 0;
                // In this case we have lost
            }
            showScore();
            break;
        case "end":
            gameOver();
            break;
        default:
            break;
    }
    checkInput();
}