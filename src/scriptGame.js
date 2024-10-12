var config = {
    type: Phaser.AUTO,
    //Tamaño de pantalla que usará Phaser:
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 300},
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var gameOver = false;

var gameOverText;

var playerHealth = 1000;

var healthText;

var score = 0;

var scoreText;

var hurt;

var gameOverSound = new Audio("Assets/Sounds/Game over.mp3");

//Sonido de fondo
var backgSound = new Audio("Assets/Sounds/Backg Sound.mp3");
backgSound.volume = 0.8;
backgSound.play();

var runSound = new Audio("Assets/Sounds/pasos corriendo.mp3");

var hurt = new Audio("Assets/Sounds/hurt.mp3");

var collectSound = new Audio("Assets/Sounds/Collect.mp3");

function preload() {
    //fondo
    this.load.image("layer1", "Assets/background/background_layer_1.png");
    this.load.image("layer2", "Assets/background/background_layer_2.png");
    this.load.image("layer3", "Assets/background/background_layer_3.png");

    //jugador
    this.load.spritesheet("player_1", "Assets/Player2/Warrior.png", {
        frameWidth: 69,
        frameHeight: 44
    });

    //plataformas
    this.load.image("platform1", "Assets/Platforms/0.png");
    this.load.image("platform2", "Assets/Platforms/1.png");
    this.load.image("platform3", "Assets/Platforms/2.png");
    
    //slimes
    this.load.spritesheet("slimes", "Assets/Slime/Slime.png", {
        frameWidth: 32,
        frameHeight: 32,
    });

    //Enemigo
    this.load.spritesheet("eyeUp", "Assets/Eye/Eye.png", {
        frameWidth: 150,
        frameHeight: 78,
    });
};


function create(){
    //fondo
    this.add.image(400, 230, "layer1").setScale(2.6,2.6);
    this.add.image(400, 230, "layer2").setScale(2.6,2.6);
    this.add.image(400, 230, "layer3").setScale(2.6,2.6);


    platforms = this.physics.add.staticGroup();
   
    //plataformas
    platforms.create(280, 320, "platform1").setScale(2,2).refreshBody();
    platforms.create(300, 150, "platform1").setScale(2,2).refreshBody();
    platforms.create(500, 350, "platform1").setScale(2,2).refreshBody();
    platforms.create(500, 200, "platform1").setScale(2,2).refreshBody();
    platforms.create(100, 230, "platform1").setScale(2,2).refreshBody();


    platforms.create(700, 300, "platform2").setScale(2.5,2).refreshBody();
    
    //piso
    platforms.create(65, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(200, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(330, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(460, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(590, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(720, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(850, 520, "platform3").setScale(2,2).refreshBody();


    //jugador
    player_1 = this.physics.add.sprite(100, 350, "player_1").setScale(2);
    player_1.setCollideWorldBounds(true);
    player_1.setBounce(0.2);
    this.physics.add.collider(player_1, platforms);
    player_1.body.setSize(22, 35, true);
    
    this.anims.create({
        key: "stand",
        frames: this.anims.generateFrameNumbers("player_1", {start: 0, end: 5}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: "run",
        frames: this.anims.generateFrameNumbers("player_1", {start: 6, end: 12}),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: "attack",
        frames: this.anims.generateFrameNumbers("player_1", {start: 14, end: 25}),
        frameRate: 10,
        repeat: 1
    })


    this.anims.create({
        key: "die",
        frames: this.anims.generateFrameNumbers("player_1", {start: 26, end: 29}),
        frameRate: 10,
        repeat: 1
    })


    cursors = this.input.keyboard.createCursorKeys();

    player_1.body.setGravityY(300);

    //slimes
    slimes = this.physics.add.group({
        key: "slimes",
        repeat: 11,
        setXY: {x: 12, y: 0, stepX: 70}
    });

    this.anims.create({
        key: "jump",
        frames: this.anims.generateFrameNumbers("slimes", {start: 21, end: 26}),
        frameRate: 10,
        repeat: -1
    });

    slimes.children.iterate(function(child) {
        child.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
        child.body.setSize(16, 22, true);
        child.anims.play("jump", true);
    });

    this.physics.add.collider(slimes, platforms);

    this.physics.add.overlap(player_1, slimes, collectSlimes, null, true);

        //Textos
        scoreText = this.add.text(16, 16, "puntuación: 0");

        healthText = this.add.text(16, 32, "salud: 1000");

        gameOverText = this.add.text(400, 500, "Game Over", {
            fontSize: "64px",
            fill: "#000000",
            fontStyle: "bold"});
        gameOverText.setOrigin(0.5);
        gameOverText.setVisible(false);

        //Enemigos
        enemy = this.physics.add.group();

        this.physics.add.collider(enemy, platforms);

        this.physics.add.collider(player_1, enemy, hit, null, this);


        //Eye
        this.anims.create({
            key: "eyeFly",
            frames: this.anims.generateFrameNumbers("eyeUp", {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "eyeDie",
            frames: this.anims.generateFrameNumbers("eyeUp", { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
};


function update(){

    if (gameOver) {
        return;
    }

//jugador
if (cursors.left.isDown) {
player_1.setVelocityX(-160)
player_1.anims.play("run", true);
player_1.flipX = true;
if (runSound.paused) {
    runSound.play();
}

} else if (cursors.right.isDown) {
player_1.setVelocityX(160);
player_1.anims.play("run", true);
player_1.flipX = false;
if (runSound.paused) {
    runSound.play();
}

} else {
player_1.setVelocityX(0)
player_1.anims.play("stand", true);
}

enemy.children.iterate(function(child) {
    if(cursors.down.isDown){
        player_1.anims.play("attack");
        if ((Math.abs(player_1.x - child.x) <= 500) && (Math.abs(player_1.y - child.y) <= 5)) {
            child.anims.play("eyeDie");
            hurt.play();
            setTimeout(() => {
            child.disableBody(true, true);
        }, 3000);
    
}}});

if (cursors.up.isDown && player_1.body.touching.down) {
    player_1.setVelocityY(-370);
};

if (playerHealth <= 0){
    gameOver = true;
    player_1.anims.play("die");
    gameOverText.setVisible(true);
    gameOverSound.play();
    setTimeout(() => {
        window.location.href = "index.html";
    },  9500);
};

};

function collectSlimes(player_1, slime) {
    slime.disableBody(true,true);
    score += 10;
    scoreText.setText("puntuación: " + score);
    collectSound.play();

    if (slimes.countActive(true) === 0) {
        slimes.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
        });
    };
        var x = (player_1.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        eyeUp = enemy.create(x, 16, "eyeUp");
        eyeUp.setBounce(1);
        eyeUp.setCollideWorldBounds(true);
        eyeUp.setVelocity(Phaser.Math.Between(-200, 200), 20);
        eyeUp.body.setSize(42, 36, true);
        eyeUp.anims.play("eyeFly");
    if (eyeUp) {
        if (player_1.x < eyeUp.x) {
            eyeUp.setVelocityX(-50);
            eyeUp.anims.play("eyeFly", true);
            eyeUp.flipX = true;
        } else if (player_1.x > eyeUp.x) {
            eyeUp.setVelocityX(50);
            eyeUp.anims.play("eyeFly", true);
            eyeUp.flipX = false;
        };
    };
};

function hit(player_1, enemy) {
    player_1.setTint("0xff0000");
    setTimeout(() => {
        player_1.clearTint();
    }, 1000);
    hurt.play();
    playerHealth -= 20;
    healthText.setText("salud :" + playerHealth);
};