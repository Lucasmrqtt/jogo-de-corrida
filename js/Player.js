class Player {
  constructor() {
    this.name = null
    this.index = null
    this.posX = 0
    this.posY = 0
    this.rank = 0
    this.score = 0
    this.fuel = 185
    this.life = 185
  }

  getCount(){
    database.ref('playerCount').on('value', data =>{
      playerCount = data.val()
    })
  }

  updateCount(count){
    database.ref('/').update({
      playerCount: count
    })
  }

  addPlayer(){
    var playerIndex = 'players/player'+this.index
    if (this.index == 1) {
      this.posX= width/2-100
    } else {
      this.posX= width/2+100
    }

    database.ref(playerIndex).set({
      name:this.name,
      posX:this.posX,
      posY:this.posY,
      score:this.score,
      rank:this.rank,
      life:this.life
    })
  }

  static getPlayersInfo(){
    database.ref("players").on('value',data => {
      allPlayers = data.val()
    })
  }

  getDistance(){
    database.ref('players/player'+this.index).on('value',data => {
      var data = data.val()
      this.posX = data.posX
      this.posY = data.posY
    })
  }

  update(){
    var playerIndex = 'players/player'+this.index
    database.ref(playerIndex).update({
      posX:this.posX,
      posY:this.posY,
      score:this.score,
      rank:this.rank,
      life:this.life
    })
  }

  getCarsAtEnd(){
    database.ref('carsAtEnd').on('value', data =>{
      this.rank = data.val()
    })
  }

  static updateCar(rank){

    database.ref('/').update({
      carsAtEnd: rank
    })
  }
}
