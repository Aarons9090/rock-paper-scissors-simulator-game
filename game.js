var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  backgroundColor: "#FAFAFA",
  parent: "content",
  dom: {
    createContainer: true,
  },
}

var game = new Phaser.Game(config)
var scene = null
const amount = 20
const imageWidth = 20
const imageHeight = 20
var rocks = []
var papers = []
var scissors = []

function preload() {
  this.load.image("ground", "assets/platform.png")
  this.load.image("rock", "assets/rock.png")
  this.load.image("paper", "assets/paper.png", {
    frameWidth: 32,
    frameHeight: 32,
  })
  this.load.image("scissors", "assets/scissors.png", {
    frameWidth: 32,
    frameHeight: 32,
  })
}

function collider(physics, sprite1, newSpriteName, array1, array2) {
  // sprite 1 is destroyed and a new sprite is created in its place
  var x = sprite1.x
  var y = sprite1.y
  var newSprite = physics.add.sprite(x, y, newSpriteName)
  newSprite.displayWidth = imageWidth
  newSprite.displayHeight = imageHeight
  newSprite.setVelocity(sprite1.body.velocity.x, sprite1.body.velocity.y)
  newSprite.setBounce(1, 1)
  newSprite.setCollideWorldBounds(true)
  array2.push(newSprite)
  sprite1.destroy()
  array1.splice(array1.indexOf(sprite1), 1)
}

function create() {
  rocks = []
  papers = []
  scissors = []

  const images = [
    { name: "rock", array: rocks },
    { name: "paper", array: papers },
    { name: "scissors", array: scissors },
  ]

  // spawn sprites in random locations with random velocities
  for (image of images) {
    for (var i = 0; i < amount; i++) {
      var x = Phaser.Math.Between(0, 800)
      var y = Phaser.Math.Between(0, 600)
      var sprite = this.physics.add.sprite(x, y, image.name)
      sprite.displayWidth = imageWidth
      sprite.displayHeight = imageHeight
      sprite.setVelocity(
        Phaser.Math.Between(-200, 200),
        Phaser.Math.Between(-200, 200)
      )
      sprite.setBounce(1, 1)
      sprite.setCollideWorldBounds(true)
      image.array.push(sprite)
    }
  }

  this.physics.add.collider(rocks, rocks)
  this.physics.add.collider(papers, papers)
  this.physics.add.collider(scissors, scissors)

  this.physics.add.collider(
    rocks,
    papers,
    function (rock, _paper) {
      collider(this.physics, rock, "paper", rocks, papers)
    },
    null,
    this
  )

  this.physics.add.collider(
    scissors,
    rocks,
    function (scissor, _rock) {
      collider(this.physics, scissor, "rock", scissors, rocks)
    },
    null,
    this
  )

  this.physics.add.collider(
    papers,
    scissors,
    function (paper, _scissor) {
      collider(this.physics, paper, "scissors", papers, scissors)
    },
    null,
    this
  )

  scene = game.scene.scenes[0].scene
  scene.pause()
}

function update() {
  const noPapers = papers.length === 0
  const noRocks = rocks.length === 0
  const noScissors = scissors.length === 0

  if (noPapers && noRocks) {
    scene.pause()
    document.getElementById("game-status").innerHTML = "Scissors win!"
  } else if (noPapers && noScissors) {
    scene.pause()
    document.getElementById("game-status").innerHTML = "Rocks win!"
  } else if (noRocks && noScissors) {
    scene.pause()
    document.getElementById("game-status").innerHTML = "Papers win!"
  }
}

function restart() {
  scene.restart()
}

function play() {
  scene.resume()
  document.getElementById("game-status").innerHTML = ""
}
