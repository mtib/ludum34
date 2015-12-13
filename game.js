// Canvas Size
var WIDTH = 1280;
var HEIGHT = 720;

// Initialize Renderer
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {antialiasing: false, transparent: false, resolution: 1});
renderer.backgroundColor = 0xABC8D2;
document.getElementById("game").appendChild(renderer.view);

// Master Containter
var stage = new PIXI.Container();

// Config goes here:
var fontConfig = {font: "30px 'rockfire'", fill: "#000000", align: "left"};
var relcenter = (0.5,0.5);

// Layers
var cBack = new PIXI.Container();
var cMiddle = new PIXI.Container();
var cFront = new PIXI.Container();
var cGui = new PIXI.Container();
/*
    stage
      |
      +-- cBack
      +-- cMiddle
      +-- cFront
      +-- cGui

Drawn from top to bottom
*/
stage.addChild(cBack);
stage.addChild(cMiddle);
stage.addChild(cFront);
stage.addChild(cGui);

// Version Text (top left)
var versionconfig  = fontConfig;
var actionconfig   = {font: "65px 'rockfire'", fill: "#6DA1D7", align:"center"};
var statsconfig    = {font: "28px 'rockfire'", fill: "#6DA1D7", align:"right"};
var actionbgconfig = {font: "65px 'rockfire'", fill: "#000000", align:"center"};
var statsbgconfig  = {font: "28px 'rockfire'", fill: "#000000", align:"right"};

var versionText    = new PIXI.Text("Version 0.02d", versionconfig);
var actionText     = new PIXI.Text("Fill all container ships\nSo that they carry 9 containers", actionconfig);
var actionbgText   = new PIXI.Text("Fill all container ships\nSo that they carry 9 containers", actionbgconfig);
var statsText      = new PIXI.Text("Mistake[s]\nPoint[s]\n#   Ship", statsconfig);
var statsbgText    = new PIXI.Text("Mistake[s]\nPoint[s]\n#   Ship", statsbgconfig);
var animstatText   = new PIXI.Text("n\nm\nN", statsconfig);
var animstatbgText = new PIXI.Text("n\nm\nN", statsbgconfig);

versionText   .position = {x:10,          y:10};
actionText    .position = {x:2*WIDTH/3,   y:HEIGHT/2};
actionbgText  .position = {x:2*WIDTH/3+2, y:HEIGHT/2+2};
statsText     .position = {x:WIDTH-10,    y:HEIGHT-5};
statsbgText   .position = {x:WIDTH-10+2,  y:HEIGHT-5+2};
animstatText  .position = {x:WIDTH-130,   y:HEIGHT-5};
animstatbgText.position = {x:WIDTH-130+2, y:HEIGHT-5+2};

actionText    .anchor = {x:0.5, y:2.25};
actionbgText  .anchor = {x:0.5, y:2.25};
statsText     .anchor = {x:1,   y:1};
statsbgText   .anchor = {x:1,   y:1};
animstatText  .anchor = {x:1,   y:1};
animstatbgText.anchor = {x:1,   y:1};

// Adding info text
cGui.addChild(actionbgText);
cGui.addChild(statsbgText);
cGui.addChild(animstatbgText);
cGui.addChild(versionText);
cGui.addChild(actionText);
cGui.addChild(statsText);
cGui.addChild(animstatText);

// Keyboard IO
// TODO on screen keys (interactive=true)
var loadKey = keyboard(65);
loadKey.press=function(){
    ingameLoad();
};
var unloadKey = keyboard(68);
unloadKey.press=function(){
    ingameUnload();
};


// init Gamestate
var gameState = new State();

// Image Locations
var loadbtn_file    = "assets/image/buttons/load_btn.png";
var unloadbtn_file  = "assets/image/buttons/unload_btn.png";
var sky_file        = "assets/image/bg/sky_layer.png";
var seabg_file      = "assets/image/bg/sea_layer.png";
var shitsprite_file = "assets/image/sprites/boat_layer.png";
var crane_base_file = "assets/image/sprites/cran_layer.png";
var crane_arm_file  = "assets/image/sprites/cranarm_layer.png";
var port_file       = "assets/image/sprites/port_layer.png";
var container_file  = "assets/image/sprites/container_layer.png";
var displace_file   = "assets/image/sprites/displace.png";
//var wave_file = "assets/image/sprites/displace.png";

// Load Images
// eg. assets/images/buttons/[load_btn.png, unload_btn.png]
PIXI.loader
    .add(loadbtn_file)
    .add(unloadbtn_file)
    .add(seabg_file)
    .add(shitsprite_file)
    .add(crane_base_file)
    .add(crane_arm_file)
    .add(port_file)
    .add(displace_file)
    .load(setup)

// Global sprites
var loadbtn    = null;
var unloadbtn  = null;
var background = null;

function showIngame(){
    loadbtn.position = {x: 20,y: HEIGHT-100};
    loadbtn.height = 93;
    loadbtn.width = 160;
    unloadbtn.position = {x: loadbtn.width + 35, y: HEIGHT-100};
    unloadbtn.height = 93;
    unloadbtn.width = 160;
    cGui.addChild(loadbtn);
    cGui.addChild(unloadbtn);
    loadbtn.interactive = true;
    unloadbtn.interactive = true;
    loadbtn.click = function(data){ingameLoad();};
    unloadbtn.click = function(data){ingameUnload();};
}

// Do Howler Stuff here
var gameSound = new Howl({
    urls: ["assets/music/BuutonBoatBashingTheme.ogg"],
    loop: true,
    volume: 0.4,
    rate: 2,
    onend: function() { /* ... */}
});
// FIXME: Add actual sounds

// Called just before rendering the first frame
function setup(){
    counter = 0.0;
    gameSound.play();
    // buttons
    loadbtn    = new PIXI.Sprite.fromImage(loadbtn_file);
    unloadbtn  = new PIXI.Sprite.fromImage(unloadbtn_file);
    background = new PIXI.Sprite.fromImage(seabg_file);
    // xblurb = new PIXI.filters.BlurXFilter();
    // background.filters = [xblurb];
    background.height = HEIGHT;
    background.width = WIDTH;
    var wavesprite = new PIXI.Sprite.fromImage(displace_file);
    wavesprite.scale={x:1,y:1};
    var wavey = new PIXI.filters.DisplacementFilter(wavesprite);
    var a = {x:0,y:0};
    var wavedisp = window.setInterval(function() {a.x += rinr(-30,30)/100.0; a.y +=rinr(-30,30)/100.0; wavesprite.position.x += a.x;wavesprite.position.y += a.y; a.x/=1.1; a.y/=1.1;},10);
    cBack.addChild(wavesprite);
    background.filters = [wavey]
    clouds = new Cloud();
    cBack.addChild(background);
    port = new PIXI.Sprite.fromImage(port_file);
    port.height=91;
    port.width=WIDTH;
    port.position = {x:0,y:HEIGHT-port.height};
    cFront.addChild(port);

    cranearm = new PIXI.Sprite.fromImage(crane_arm_file);
    cranearm.height=HEIGHT;
    cranearm.width=WIDTH;
    cranearm.anchor   = {x:0.1958,  y:0.39125};
    cranearm.position = {x:250.624, y:282.7};
    cFront.addChild(cranearm);

    cranebase = new PIXI.Sprite.fromImage(crane_base_file);
    cranebase.height=HEIGHT;
    cranebase.width=WIDTH;
    cFront.addChild(cranebase);

    showIngame();
    testship = new Ship();

    // Filters
    // thisfil = new PIXI.filters.ColorMatrixFilter();
    // stage.filters = [thisfil];

    // this is just debug, switch sin to tan for fun
    //interv2 = window.setInterval(function(){cranearm.scale.x=1+0.55*Math.sin(counter);counter +=0.01 },10)

    renderStage();
}

function hoverCrane(xval){
    vx0 = 250.624;
    cl = 372
    vd = xval - vx0;
    vf = vd/cl;
    cranearm.scale.x=vf;
}

function Cloud(){
    c = this;
    this.sprite1 = new PIXI.Sprite.fromImage(sky_file);
    this.sprite2 = new PIXI.Sprite.fromImage(sky_file);
    this.sprite1.scale = {x:1.5,y:1.5};
    this.sprite2.scale = {x:1.5,y:1.5};
    this.move= function(){
        if(this.sprite1.position.x<-1*this.sprite1.width){
            this.sprite1.position.x=this.sprite1.width;
        }
        if (this.sprite2.position.x<-1*this.sprite2.width) {
            this.sprite2.position.x=this.sprite2.width;
        }
        this.sprite1.position.x -= 1;
        this.sprite2.position.x -= 1;
    };
    cBack.addChild(this.sprite1);
    cBack.addChild(this.sprite2);
    this.sprite2.position.x=this.sprite1.width*1280;
    this.interv = window.setInterval(function(){c.move();},100);
}

// Class for Gamestate
function State(){
    this.level = 1;
    this.name = "Testie";
    this.mistakes = 0;
    this.points = 0;
    this.display = function(){
        // mistake, point, ship;
        animstatText.text=this.mistakes+"\n"+this.points+"\n"+this.level;
        animstatbgText.text=this.mistakes+"\n"+this.points+"\n"+this.level;
    }
    window.setInterval(function(){gameState.display();},100);
}

// Class for Ships
function Ship(){
    ship = this;

    // target
    this.end = 9;

    // Filter to change hue
    this.filter = new PIXI.filters.ColorMatrixFilter();
    this.filter.hue(rinr(0,360));

    // load sprite
    this.sprite = new PIXI.Sprite.fromImage(shitsprite_file);
    this.sprite.scale={x:1.6,y:1.6};
    this.sprite.position={x:WIDTH+5,y:HEIGHT-350};
    this.sprite.filters = [this.filter];
    cMiddle.addChild(this.sprite);

    // left, middle and right pile amount
    this.leftlevel   = parseInt(rinr(2,5));
    this.middlelevel = parseInt(rinr(2,5));
    this.rightlevel  = parseInt(rinr(2,5));
    // unload from renderer
    this.die = function(){
        window.clearInterval(this.movement);
        cMiddle.removeChild(this.sprite);
        testship = new Ship(); // This IS! very odd to hardcode
        var sum = this.leftlevel + this.middlelevel + this.rightlevel;
        gameState.mistakes += abs(this.end-sum);
        gameState.points   += abs(this.start-sum);
    };
    // FIXME: If this part generates properly, it'll work fine!
    this.start = this.leftlevel + this.middlelevel + this.rightlevel;
    this.defy = this.sprite.y;
    // periodically called to move ship
    this.move = function(){
        dx = gameState.points/4+3;
        this.sprite.x -= dx;
        // Bobbing is dead!
        // this.bobx += rinr(-100,100)/100000.0;
        // this.boby += rinr(-100,100)/100000.0;
        // this.sprite.anchor = {x:this.bobx, y:this.boby};
        ly   = this.sprite.y;
        sink = this.sumv()*5;
        this.sprite.y=this.defy+sink;
        div  = this.sprite.y-ly;

        for (var lvl in this.cargo) {
            for (var elem in this.cargo[lvl]) {
                if (this.cargo[lvl].hasOwnProperty(elem)) {
                    this.cargo[lvl][elem].sprite.x -= dx;
                    this.cargo[lvl][elem].sprite.y += div;
                }
            }
        }

        if (this.sprite.x+this.sprite.width<-4) {
            gameState.level += 1;
            for (var lvl in this.cargo) {
                for (var elem in this.cargo[lvl]){
                    if (this.cargo[lvl].hasOwnProperty(elem)) {
                        this.cargo[lvl][elem].die();
                        delete this.cargo[lvl][elem];
                    }
                }
            }
            // delete ship (out of frame) & add now one;
            this.die();
        }

        if (this.sprite.x < -50 && this.sprite.x > -500){
            this.activespot = this.sprite.x + 900;
            this.mode = 0;
        } else if (this.sprite.x < -500 && this.sprite.x > -900){
            this.activespot = this.sprite.x + 1300;
            this.mode = 1;
        } else if (this.sprite.x < -900 && this.sprite.x > -1300){
            this.activespot = this.sprite.x + 1700;
            this.mode = 2;
        } else{
            this.mode = null;
            hoverCrane(630 + 100*Math.sin(counter));
            counter += 0.01;
            return
        }
        hoverCrane(this.activespot);
    }
    this.mode = null
    this.activespot = 0;
    this.sumv = function(){return this.leftlevel + this.middlelevel + this.rightlevel;};
    this.lose=function(){
        if(this.sumv() < 1){
            gameState.mistakes += 1;
            return false;
        } else {
            if(this.mode == 0 && this.leftlevel>0){
                this.leftlevel   -= 1;

                this.killCargo(this.mode);
            } else if (this.mode == 1 && this.middlelevel>0){
                this.middlelevel -= 1;

                this.killCargo(this.mode);
            } else if (this.mode == 2 && this.rightlevel>0){
                this.rightlevel  -= 1;

                this.killCargo(this.mode);
            } else {
                return false;
            }
            return true;
        }
    }
    this.killCargo=function(lvl){
        this.cargo[lvl].pop().die();
    }
    this.loadc=function(){
        if (this.mode == null){
            gameState.mistakes += 1;
        } else if (this.mode == 0 && this.leftlevel < 5) {
            this.cargo[0][this.cargo[0].length]=new Container(this.sprite.x+ 900, this.sprite.y+this.shipv0  +this.leftlevel * (-1*this.cargoh), 1);
            this.leftlevel += 1;
        } else if (this.mode == 1 && this.middlelevel < 5) {
            this.cargo[1][this.cargo[1].length]=new Container(this.sprite.x+1300, this.sprite.y+this.shipv0-3+this.middlelevel*(-1*this.cargoh), 1);
            this.middlelevel += 1;
        } else if (this.mode == 2 && this.rightlevel < 5) {
            this.cargo[2][this.cargo[2].length]=new Container(this.sprite.x+1700, this.sprite.y+this.shipv0-6+this.rightlevel* (-1*this.cargoh), 1);
            this.rightlevel += 1;
        }
    }
    // multidimensional array of cargo (left,middle,right)
    this.cargo = [[],[],[]];

    this.movement = window.setInterval(function(){ship.move();}, 10);
    // [800,1200,1600]
    this.cargoh = 91;
    this.shipv0 = 70;

    for (var i = 0; i < this.leftlevel; i++) {
        this.cargo[0][i] = new Container(this.sprite.x +  900, this.sprite.y + this.shipv0     + i * (-1*this.cargoh), 0);
    }
    for (var i = 0; i < this.middlelevel; i++) {
        this.cargo[1][i] = new Container(this.sprite.x + 1300, this.sprite.y + this.shipv0 - 3 + i * (-1*this.cargoh), 1);
    }
    for (var i = 0; i < this.rightlevel; i++) {
        this.cargo[2][i] = new Container(this.sprite.x + 1700, this.sprite.y + this.shipv0 - 6 + i * (-1*this.cargoh), 2);
    }
}

function Container(x,y, me){
    // instatiation position
    this.ix = x;
    this.iy = y;

    // pile to be on
    this.mode = me.mode;

    // loading sprite, positioning it
    this.sprite=new PIXI.Sprite.fromImage(container_file);
    this.sprite.position.set(x,y);
    this.sprite.anchor.set(0.5,1);

    // change color
    this.filter = new PIXI.filters.ColorMatrixFilter();
    this.filter.hue(rinr(0,360));
    this.sprite.filters = [this.filter];
    cMiddle.addChild(this.sprite);

    // set position
    this.set = function(x,y){
        this.sprite.position.set(x,y);
    }

    // unload, and don't render
    this.die = function(){
        cMiddle.removeChild(this.sprite);
    }
}

// Request Animation Frame
function renderStage(){
    requestAnimationFrame(renderStage);
    renderLoop();
    renderer.render(stage);
}

// Called on "Load"-Press
function ingameLoad(){
    loadbtn.rotation=-0.03;window.setTimeout(function(){loadbtn.rotation=0.03;window.setTimeout(function(){loadbtn.rotation=0},200)},200)
    // Debug
    //gameState.points += 1;
    // TODO: Hitbox then change container
    testship.loadc();
}

// Called on "Unload"-Press
function ingameUnload(){
    unloadbtn.rotation=-0.03;window.setTimeout(function(){unloadbtn.rotation=0.03;window.setTimeout(function(){unloadbtn.rotation=0},200)},200)
    // Debug
    //gameState.mistakes += 1;
    if (testship.sprite.x < 600 && testship.sprite.x > -1500) {
        testship.lose();
    }
}

// Called in-between rendering
// should be used for logic
speedswitch = {1:10, 2:20, 3:50, 4:70, 5:100, 6:200};
speedlevel = {0:2,1:2.25,2:2.5,3:2.75,4:3,5:3.5,6:4};

// starting speed level
currlevel = 0;
function renderLoop(){
    try {
        // speed up
        if(gameState.points >= speedswitch[currlevel+1]){
            currlevel = currlevel+1;
            gameSound._rate=speedlevel[currlevel];
            gameSound.fade(0.4,0,10);
            gameSound.pause();
            gameSound.fade(0,0.4,10);
            gameSound.play();
        }
    } catch (e) {
        // ends up here, if there isn't any faster level
    } finally {
        // nothing to do here
    }
}
