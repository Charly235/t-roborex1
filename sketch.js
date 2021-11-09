var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameoverImage;
var restartImage;
var score;
var gameOver;
var restart;

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(90,height -50,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 1;
 //trex.debug = true;
  trex.setCollider("rectangle", 0,0,32,64)
  
  ground = createSprite(width/2,height -20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(width/2,height -10,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  score = 0;
  gameOver = createSprite (width/2, height/2, 200, 40);
  gameOver.addImage (gameoverImage);  
  gameOver.scale = 0.75;
  restart = createSprite(width/2, height/2 +80, 200, 40);
  restart.addImage (restartImage);
  restart.scale = 0.75;
}

function draw() {
  background(25,25,100);
  //displaying score
  textSize(20);
  text("Score: "+ score, width -200,50);
  
  
  
  if(gameState === PLAY){
    restart.visible = false;
    gameOver.visible = false;
    //move the ground
    ground.velocityX = -4;
    //scoring
    score = score + Math.round(getFrameRate()/35);
    trex.changeAnimation ("running", trex_running );
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length>0||keyDown("space")&& trex.y >= height-70) {
        trex.velocityY = -13;
      touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
   else if (gameState === END) {
         restart.visible = true;
    gameOver.visible = true;
      ground.velocityX = 0;
     trex.velocityY = 0 
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
      obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     trex.changeAnimation ("collided",trex_collided);
      if (mousePressedOver(restart)||touches.length>0){
    reset()     
        touches = [];
  }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
 
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width+40,height -35,10,40);
   obstacle.velocityX = -6;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 400;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 10=== 0||frameCount % 40=== 0) {
     cloud = createSprite(width+40,100,40,10);
    cloud.y = Math.round(random(10,height-80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.02;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function reset (){
  gameState = PLAY;
      restart.visible = false;
    gameOver.visible = false;
  obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
  score = 0;
  
}
