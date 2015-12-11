# Pixi.js and Howler.js Overview
complete documentation:

[Pixi.js](https://github.com/pixijs/pixi.js)

[Howler.js](https://github.com/goldfire/howler.js/)

## Pixi.js
import
```html
<div id="game"></div>
<script type="text/javascript" src=".../pixi.min.js"/>
```
setup
```javascript
var WIDTH = 1280;
var HEIGHT = 720;
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {antialiasing: false, transparent: false, resolution: 1});
var stage = new PIXI.Stage(0x66FF99, true)
renderer.backgroundColor = 0xFFFFFF;
document.getElementById("game").appendChild(renderer.view);
renderer.render(stage) // rendering stage
```
resources
```javascript
PIXI.loader
    .add("file1.png")
    .add("file2.png");
        // ...

var sprite = new PIXI.Sprite.fromImage("file1.png");
```
containers
```javascript
var scene = new PIXI.Container();
scene.interactive = true; // to get interaction events
stage.addChild(scene)
```
working with sprites
```javascript
x = 100;
y = 200;
example = new PIXI.Sprite.fromImage("...");
// this v
example.position.set(x,y);
// ^ equals v
example.position.x = x;
example.position.y = y;
// ^ that
example.anchor = {x: 0.5, y: 0.5};
example.click = function(data){ /* do stuff */ }
example.visible = true;
```
helpful functions
```javascript
function rinr(min, max){
    return min + Math.random()*(max-min);
}
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}
// Usage
var optionkey = keyboard(80);
```
text
```javascript
var text = new PIXI.Text("Content", {
    font: "20px 'FONT'",
    fill: "#COLOR",
    align: "center"
});
```
non-blocking timeout
```javascript
miliseconds = 1000 // = 1 second
window.setTimeout(function() {
    changeState(menu);
    storyTextReset();
}, miliseconds);
```
## Howler.js
music
```javascript
var menuSoundVolume = 0.02;
var menuSound = new Howl({
    urls: ["menu.ogg"],
    loop: true,
    volume: menuSoundVolume,
    onend: function() { /* ... */}
});
// start
menuSound.play() // or
menuSound.fadeIn(1000) // TODO need to verify this..
// ... stop
menuSound.stop() // or
menuSound.fadeOut(1000)
```
sounds
```javascript
var shootSound = new Howl({
    urls: ["shoot1.ogg"],
    loop: false,
    volume: 0.3
});
shootSound.play()
```
## Javascript "Classes"
```javascript
// call update() from an array inside a Interval-function
// tankArray[i] = new Tank();
// enemyLogic = window.setInterval(function() {
//    enemyBehaviour()
// }, 50);
function Tank() {
    // Init
    var tank = this;
    var center = {
        x: 0.5,
        y: 0.5
    };
    var scale = {
        x: 0.7,
        y: 0.7
    };
    this.baseSprite = new PIXI.Sprite.fromImage("Images/creatures/tank_base.png");
    this.topSprite = new PIXI.Sprite.fromImage("Images/creatures/tank.png");
    this.bottomrotation = undefined;
    // Settings
    this.baseSprite.anchor = center;
    this.baseSprite.pivot = center;
    this.baseSprite.scale = scale;
    this.topSprite.scale = scale;
    this.topSprite.anchor = center;
    this.topSprite.pivot = center;
    // n*50ms;
    this.cooldown = 10;
    this.invicfram = 0; // Hit player on collision
    this.respawn = function() {
        this.x = rint(0, width);
        this.y = rint(-32, -20);
        if (Math.Random > 0.5) {
            this.y = -this.y;
        }
        this.vx = rint(-2, 2);
        this.vy = rint(-2, 2);
        this.bottomrotation = -Math.atan(this.vx / this.vy);
        if (this.vy > 0) {
            this.bottomrotation += 3.1415;
        }
        this.baseSprite.rotation = this.bottomrotation;
    };
    this.shoot = function() {
        var vec = normalize(diff(monster1, tank));
        var sx = Math.sin(this.topSprite.rotation) * 16;
        var sy = Math.cos(this.topSprite.rotation) * 16;
        new Shot(this.x + sx, this.y - sy, vec.x * 6, vec.y * 6, -300);
        new Shot(this.x + sx, this.y - sy, vec.x * 6, vec.y * 6, -300);
        new Shot(this.x + sx, this.y - sy, vec.x * 6, vec.y * 6, -300);
    }
    this.unload = function() {
        playC.removeChild(this.topSprite);
        playC.removeChild(this.baseSprite);
    };
    this.move = function() {
        this.x += this.vx;
        this.y += this.vy;
        this.topSprite.position.set(this.x, this.y);
        this.baseSprite.position.set(this.x, this.y);
        if (this.cooldown <= 0 && score > 0 && (this.x > 32 && this.x < width - 32 && this.y < height - 32 && this.y > 32)) {
            this.cooldown = 100;
            this.shoot();
        }
    };
    this.turn = function() {
        var vec = normalize(diff(monster1, this));
        var rot = -Math.atan(vec.x / vec.y);
        if (vec.y > 0) {
            rot += 3.1415;
        }
        this.topSprite.rotation = rot;
    };
    this.update = function() {
        this.turn();
        this.move();
        if (this.x > width + 32 || this.x < -32 || this.y > height + 32 || this.y < -32) {
            this.respawn();
        }
        if (vecDist(this, monster1) < 30 && this.invicfram <= 0) {
            health -= 20;
            this.invicfram = 20;
        }
        this.cooldown -= 1;
        this.invicfram -= 1;
    };
    this.respawn();
    playC.addChild(this.baseSprite);
    playC.addChild(this.topSprite);
}
// or
function Shot(x, y, vx, vy, travel) {
    if (travel === undefined) {
        travel = 0;
    }
    this.damage = 10;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    var shot = this;
    this.line = new PIXI.Graphics();
    this.move = function() {
        this.line.lineStyle(5, 0xD9600B, 1);
        this.line.moveTo(this.x, this.y);
        this.x += this.vx;
        this.y += this.vy;
        this.line.lineTo(this.x, this.y);
        playC.addChild(this.line);
        if (vecDist(this, monster1) < 27) {
            health -= this.damage;
            if (state == play) {
                hitSound.play();
                if (health <= 0) {
                    endSound.play();
                }
            }
        } else if (travel < 300) {
            window.setTimeout(function() {
                new Shot(shot.x, shot.y, shot.vx, shot.vy, travel + Math.sqrt(shot.vx * shot.vx + shot.vy * shot.vy));
            }, 30);
        }
        window.setTimeout(function() {
            playC.removeChild(shot.line)
        }, 200);
    };
    // this.remove = function(){
    //     playC.removeChild(line);
    // };
    this.move();
}
```
