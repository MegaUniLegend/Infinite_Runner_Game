var gamestate = "play";
var cube, cubeimg;
var spike1, spike2, spike3, spike4, spike5, spikegrp;
var ground, invground, groundimg;
var baccground, baccgroundimg;
var cloudimg, cloudgrp;
var jumpsnd, deathsnd, moosic;
var deathtext, scoretext;
var score, deaths;
var gameover, gameoverimg;
var restart, restarstimg;

function preload(){
    cubeimg = loadImage("cubeskin1.png");

    spike1 = loadImage("spike1.png");
    spike2 = loadImage("spike2.png");
    spike3 = loadImage("spike3.png");

    groundimg = loadImage("groundimg.png");
    gameoverimg = loadImage("gameoverimg.png")
    restartimg = loadImage("restartimg.png");

    cloudimg = loadImage("cloudimg.png");
    cloudgrp = createGroup();

    jumpsnd = loadSound("jump.mp3");
    deathsnd = loadSound("death.mp3");
    moosic = loadSound("music.mp3");
}

function setup() {
    createCanvas(windowWidth,windowHeight);
    deaths = 0;

    cube = createSprite(windowWidth/2,windowHeight/1.25);
    cube.addImage("cube",cubeimg);
    cube.scale = 0.075;

    ground = createSprite(windowWidth/2+110,windowHeight+25);
    ground.addImage("ground",groundimg);
    ground.scale = 1.25;

    invground = createSprite(windowWidth/2,windowHeight+300);
    invground.addImage("groundd",groundimg);
    invground.scale = 1.25;
    //invground.visible = false;

    gameover = createSprite(windowWidth/2,windowHeight/3);
    gameover.addImage("gameover",gameoverimg);
    gameover.scale = 0.75;

    restart = createSprite(windowWidth/2,windowHeight/1.5);
    restart.addImage(restartimg);
    restart.scale = 0.75;

    spikegrp = createGroup();
    cloudgrp = createGroup();

    score = 0;
    touches = [];
    moosic.play();
}

function draw() {
    background("darkblue");
    //cube.debug = true;

    textSize(30);
    textFont("impact");
    fill("black");
    scoretext = text("Your Score:  "+score, windowWidth/15,windowHeight/7.5);
    textSize(30);
    textFont("impact");
    fill("black");
    deathtext = text("Deaths:  "+deaths,+windowWidth/1.25,windowHeight/7.5);

    if(gamestate === "play") {
        gameover.visible = false;
        restart.visible = false;
        moosic.setLoop(true);

        score = score + Math.round(getFrameRate()/60);

        ground.velocityX = ground.velocityX-0.0075;
        if(ground.x < windowWidth/2-110) {
            ground.x = windowWidth/2+110;
        }
        cube.collide(invground);

        if(keyWentDown("space")||keyWentDown(UP_ARROW)||touches.length>0) {
            if(cube.y >= 488.95) {
                jumpsnd.play();
                cube.velocityY = -20;
                touches = [];
        }
        }

        if(cube.isTouching(spikegrp)) {
            gamestate = "end";
            deaths = deaths+1;
            deathsnd.play();
        }
        

        cube.velocityY = cube.velocityY+1;

        makeSomeClouds();
        hahaobstaclesgobrr();

    }else if(gamestate === "end") {
        ground.velocityX = 0;
        cloudgrp.setVelocityEach(0,0);
        cloudgrp.setLifetimeEach(-1);
        spikegrp.setVelocityEach(0,0);
        spikegrp.setLifetimeEach(-1);
        cube.velocityY = 0;
        moosic.stop();
        moosic.setLoop(false);
        gameover.visible = true;
        restart.visible = true;
        if(mousePressedOver(restart)||touches.length>0) {
            spikegrp.destroyEach();
            cloudgrp.destroyEach();
            frameCount = 0;
            score = 0;
            moosic.play();
            moosic.setLoop(true);
            touches = [];
            gamestate = "play";
        }
    }
    drawSprites()
}

function makeSomeClouds() {
    if(frameCount % 200 === 0) {
        var cloud = createSprite(windowWidth+20,windowHeight/5 + (random(0,100)));
        cloud.addImage(cloudimg);
        cloud.velocityX = random(-5,-7);
        cloud.scale = 0.5;
        cloud.lifetime = 300;
        cloud.depth = cube.depth;
        cube.depth = cube.depth+1;
        deathtext.depth = cube.depth;
        scoretext.depth = cube.depth;
        cloudgrp.add(cloud);
    }
}

function hahaobstaclesgobrr() {
    if(frameCount % 50 === 0 && frameCount>500) {
        var obstacle = createSprite(windowWidth+50,windowHeight/1.2);
        obstacle.lifetime = 300;
        obstacle.debug = false;
        obstacle.velocityX = -(6+score/100);
        var boi = Math.round(random(1,3));
        switch(boi) {
            case 1: obstacle.addImage(spike1);
                    obstacle.scale = 0.275;
                    obstacle.depth = ground.depth-0.1;
            break;
            case 2: obstacle.addImage(spike2);
                    obstacle.scale = 0.3;
                    obstacle.setCollider("rectangle",0,0,100,500)
                    obstacle.depth = ground.depth-0.1;
            break;
            case 3: obstacle.addImage(spike3);
                    obstacle.scale = 0.5;
                    obstacle.depth = ground.depth-0.1;
            break;
            default: break;
        }
        spikegrp.add(obstacle);
    }
}
