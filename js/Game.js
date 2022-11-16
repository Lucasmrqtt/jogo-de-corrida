class Game {
  constructor() {
    this.resetTitle = createElement('h2')
    this.resetButton = createButton('') 
    this.leadeboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2"); 
    this.playerMove = false
    this.leftKeyActive = false
    this.blast = false
  }

  start() {
    player = new Player();
    playerCount = player.getCount();
    form = new Form();
    form.display();
    car1 = createSprite(width/2-50,height-100)
    car1.addImage('car1',carImg1)
    car1.scale = 0.07
    car2 = createSprite(width/2+100,height-100)
    car2.addImage('car2',carImg2)
    car2.scale = 0.07
    car1.addImage('blast', blast) 
    car2.addImage('blast', blast)
    cars = [car1,car2]
    fuels = new Group()
    coins = new Group()
    obstacles = new Group()
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 200, y: height - 1300, image: obstacle1Image },  
      { x: width / 2 - 50, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image }, 
      { x: width / 2, y: height - 900, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1500, image: obstacle1Image },
      { x: width / 2 + 500, y: height - 2000, image: obstacle2Image },
      { x: width / 2 + 100, y: height - 1000, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2500, image: obstacle2Image }
    ];
    this.addSprites(fuels,8,fuelImg,0.02)
    this.addSprites(coins,36,coinImg,0.09)
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions)
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale,positions=[]) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      if (positions.length>0) {
        x = positions[i].x
        y = positions[i].y
        spriteImage = positions[i].image
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 10, height - 400);
      }
      
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }

  }

  getState(){
    database.ref("gameState").on('value',data => {
      gameState = data.val()
    })
  }

  updateState(state){
    database.ref('/').update({
      gameState: state
    })
  }

  handleElements(){
    form.hide();
    form.titleImg.position(40,50)
    form.titleImg.class('gameTitleAfterEffect')

    this.resetTitle.html('Reset')
    this.resetTitle.position(width/2+230,40)
    this.resetTitle.class('resetText')
    this.resetButton.position(width/2+230,100)
    this.resetButton.class('resetButton')

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);
    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);
    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);

  }

  play(){
    this.handleElements()
    this.handleResetButton()
    Player.getPlayersInfo()
    player.getCarsAtEnd()
    if (allPlayers != undefined) {
      image(pista,0,-height*5,width,height*6)
      image(pista2,0,-height*10,width,height*6)
      this.showLeaderboard()
      this.showFuelBar()
      this.showLife()
      var index = 0
      for (const plr in allPlayers) {
        index ++
        var x = allPlayers[plr].posX
        var y = height-allPlayers[plr].posY
        var correntLife = allPlayers[plr].life
        if (correntLife <= 0) {
          cars[index-1].changeImage('blast')
          cars[index-1].scale = 0.3
        }
        cars[index-1].position.x = x
        cars[index-1].position.y = y
        if (index == player.index) {
          fill('orange')
          ellipse(x,y,60,60)
          this.handleFuel(index)
          this.handleCoins(index)
          this.handleObstacleCollision(index)
          this.handleCarACollisionWithCarB(index)
          if (player.life <= 0) {
            this.blast = true
            this.playerMove = false
            setTimeout(() => {
              this.gameOver()
              gameState = 2
            }, 1000);
          }
          if (cars[index-1].position.y > height-300) {
            camera.position.y = cars[index-1].position.y-270
          }else{
            camera.position.y = cars[index-1].position.y-100
          }
        }
      }
      this.handlePlayerControls()
      const finishLine = height*11-100
      if (player.posY > finishLine) {
        gameState = 2
        player.rank ++
        Player.updateCar(player.rank)
        player.update()
        this.showRank()
      }
        if (this.playerMove) {
          player.posY +=3        
          player.update()
        } 
      
      drawSprites()
    }
  }

  handlePlayerControls(){

    if (!this.blast) {
    
      if (keyIsDown(UP_ARROW)) {
        player.posY += 5
        player.update();
        this.playerMove = true
      } 

      if (keyIsDown(RIGHT_ARROW) && player.posX<width/2+250) {
        this.leftKeyActive = false
        player.posX += 5
        player.update();
      }

      if (keyIsDown(LEFT_ARROW) && player.posX>width/3-50) {
        this.leftKeyActive = true
        player.posX -= 5
        player.update();
      }
    }
  }

  handleResetButton(){
    this.resetButton.mousePressed(
      () => {
        database.ref('/').set({
          gameState:0,
          playerCount:0,
          players:{},
          carsAtEnd:0
      })
      window.location.reload()
    })
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1){
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 = players[0].rank + "&emsp;" + players[0].name +"&emsp;" + players[0].score;
      leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
      leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handleFuel(index) {
    //adicionando combustível
    cars[index - 1].overlap(fuels, function(collector, collected) {
      if (player.fuel < 135) {
        player.fuel += 50;
      }else {
        player.fuel = 185
      }
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });
    if (player.fuel > 0 && this.playerMove) {
      player.fuel -= 0.3  
    }
    if (player.fuel <= 0) {
      gameState = 2
      this.gameOver()
    }

  }

  handleCoins (index){
      cars[index-1].overlap(coins, function(collector,collected) {
        player.score += 21
        player.update();
        collected.remove();
      })
  }

  showRank() {
      swal({
        //title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
        title: `Incrível!${"\n"}${player.rank}º lugar`,
        text: "Você alcançou a linha de chegada com sucesso!",
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok"
      });
  }
  
  gameOver() {
      swal({
        title: `Fim de Jogo`,
        text: "Oops você perdeu a corrida!",
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        imageSize: "100x100",
        confirmButtonText: "Obrigado por jogar"
      });
  }
  
  showLife() {
      push();
      image(lifeImage, width / 2 - 130, height - player.posY - 400, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.posY - 400, 185, 20);
      fill("#f50057");
      rect(width / 2 - 100, height - player.posY - 400, player.life, 20);
      noStroke();
      pop();
  }
  
  showFuelBar() {
      push();
      image(fuelImg, width / 2 - 130, height - player.posY - 350, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.posY - 350, 185, 20);
      fill("#b38104");
      rect(width / 2 - 100, height - player.posY - 350, player.fuel, 20);
      noStroke();
      pop();
  }

  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.posX += 100;
      } else {
        player.posX -= 100;
      }

      //Reduzindo a vida do jogador
      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }



  handleCarACollisionWithCarB(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.posX += 100;
        } else {
          player.posX -= 100;
        }

        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.posX += 100;
        } else {
          player.posX -= 100;
        }

        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
  }

}


//final: -3025