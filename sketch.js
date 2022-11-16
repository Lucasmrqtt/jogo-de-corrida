var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,allPlayers, game;
var playerCount, gameState;
var pista, pista2;
var car1,carImg1,car2,carImg2, cars = []
var fuels, fuelImg, coins, coinImg;
var obstacles, obstacle1Image, obstacle2Image;
var lifeImage;
var blast;


function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  pista = loadImage("./assets/track.jpg")
  pista2 = loadImage("./assets/track_2.png")
  carImg1 = loadImage ("/assets/car1.png")
  carImg2 = loadImage ("/assets/car2.png")
  blast = loadImage ("/assets/blast.png")
  fuelImg = loadImage ("/assets/fuel.png")
  coinImg = loadImage ("/assets/goldCoin.png")
  lifeImage = loadImage ("/assets/life.png")
  obstacle1Image = loadImage ("./assets/obstacle1.png")
  obstacle2Image = loadImage ("./assets/obstacle2.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if (playerCount == 2) {
    game.updateState(1)
  }
  if (gameState == 1) {
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
