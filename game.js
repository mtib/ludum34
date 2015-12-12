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
var versionconfig = fontConfig;
var actionconfig = {font: "80px 'rockfire'", fill: "#000000", align:"center"};
var statsconfig = {font: "28px 'rockfire'", fill: "#000000", align:"right"};
var actionbgconfig = {font: "80px 'rockfire'", fill: "#FFFFFF", align:"center"};
var statsbgconfig = {font: "28px 'rockfire'", fill: "#FFFFFF", align:"right"};

var versionText = new PIXI.Text("Version 0.02d", versionconfig);
var actionText = new PIXI.Text("Fill all container ships\nSo that they carry 9 containers", actionconfig);
var statsText = new PIXI.Text("Mistake[s]\nPoint[s]\n#   Ship", statsconfig);
var animstatText = new PIXI.Text("n\nm\nN", statsconfig);
var actionbgText = new PIXI.Text("Fill all container ships\nSo that they carry 9 containers", actionbgconfig);
var statsbgText = new PIXI.Text("Mistake[s]\nPoint[s]\n#   Ship", statsbgconfig);
var animstatbgText = new PIXI.Text("n\nm\nN", statsbgconfig);

versionText.position = {x:10,y:10};
actionText.position = {x:WIDTH/2,y:HEIGHT/2};
actionText.anchor = {x:0.5,y:2.25};
statsText.position = {x:WIDTH-10, y:HEIGHT-5};
statsText.anchor = {x:1,y:1}
animstatText.position = {x:WIDTH-130, y:HEIGHT-5};
animstatText.anchor = {x:1,y:1}
actionbgText.position = {x:WIDTH/2+2,y:HEIGHT/2+2};
actionbgText.anchor = {x:0.5,y:2.25};
statsbgText.position = {x:WIDTH-10+2, y:HEIGHT-5+2};
statsbgText.anchor = {x:1,y:1}
animstatbgText.position = {x:WIDTH-130+2, y:HEIGHT-5+2};
animstatbgText.anchor = {x:1,y:1}

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
// Don't worry about this one
var fuckKey = keyboard(70);
fuckKey.press=function(){
    versionText.text="FUCK YOU!";
}


// init Gamestate
var gameState = new State();

// Image Locations
var loadbtn_file = "assets/image/buttons/load_btn.png";
var unloadbtn_file = "assets/image/buttons/unload_btn.png";
var seabg_file = "assets/image/bg/sea_layer.png";
var shitsprite_file = "assets/image/sprites/boat_layer.png";
var crane_base_file = "assets/image/sprites/cran_layer.png";
var crane_arm_file = "assets/image/sprites/cranarm_layer.png";
var port_file = "assets/image/sprites/port_layer.png";
var sky_file = "assets/image/bg/sky_layer.png";

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
    .load(setup)

// Global sprites
var loadbtn = null;
var unloadbtn = null;
var background = null;

function showIngame(){
    loadbtn.position = {x: 10,y: HEIGHT-100};
    loadbtn.height = 93;
    loadbtn.width = 190;
    unloadbtn.position = {x: loadbtn.width + 15, y: HEIGHT-100};
    unloadbtn.height = 93;
    unloadbtn.width = 190;
    cGui.addChild(loadbtn);
    cGui.addChild(unloadbtn);
    loadbtn.interactive = true;
    unloadbtn.interactive = true;
    loadbtn.click = function(data){ingameLoad();};
    unloadbtn.click = function(data){ingameUnload();};
}

// TODO: Do Howler Stuff here
// TODO: "rate" changes speed

// Called just before rendering the first frame
function setup(){
    loadbtn = new PIXI.Sprite.fromImage(loadbtn_file);
    unloadbtn = new PIXI.Sprite.fromImage(unloadbtn_file);
    background = new PIXI.Sprite.fromImage(seabg_file);
    background.height = HEIGHT;
    background.width = WIDTH;
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
    cranearm.anchor={x:0.1958,y:0.39125};
    cranearm.position={x:250.624,y:281.7};
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

    // FIXME: this is just debug, switch sin to tan for fun
    counter = 0.0;
    interv2 = window.setInterval(function(){cranearm.scale.x=1+0.55*Math.sin(counter);counter +=0.01 },10)

    renderStage();
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
    this.end = 9;
    this.filter = new PIXI.filters.ColorMatrixFilter();
    this.filter.hue(rinr(0,360));
    this.sprite = new PIXI.Sprite.fromImage(shitsprite_file);
    this.sprite.scale={x:1.6,y:1.6};
    this.sprite.position={x:WIDTH+5,y:HEIGHT-350};
    this.sprite.filters = [this.filter];
    cMiddle.addChild(this.sprite);
    this.leftlevel = parseInt(rinr(2,6));
    this.middlelevel = parseInt(rinr(2,6));
    this.rightlevel = parseInt(rinr(2,6));
    this.die = function(){
        window.clearInterval(this.movement);
        cMiddle.removeChild(this.sprite);
        testship = new Ship();
        var sum = this.leftlevel + this.middlelevel + this.rightlevel;
        gameState.mistakes += abs(this.end-sum);
        gameState.points += abs(this.start-sum);
    };
    // FIXME: If this part generates properly, it'll work fine!
    this.start = this.leftlevel + this.middlelevel + this.rightlevel;
    this.bobx = 0;
    this.boby = 0;
    this.move = function(){
        this.sprite.x -= gameState.points/4+3;
        // TODO: Bobbing...
        // this.bobx += rinr(-100,100)/100000.0;
        // this.boby += rinr(-100,100)/100000.0;
        // this.sprite.anchor = {x:this.bobx, y:this.boby};
        if (this.sprite.x+this.sprite.width<-4) {
            gameState.level += 1;
            this.die();
        }
    }
    this.sumv = function(){return this.leftlevel + this.middlelevel + this.rightlevel;};
    this.lose=function(){
        if(this.sumv()<=1){
            gameState.mistakes += 1;
            return false;
        } else {
            if(this.leftlevel>0){
                this.leftlevel -= 1;
            } else if (this.middlelevel>0){
                this.middlelevel -= 1;
            } else if (this.rightlevel>0){
                this.rightlevel -= 1;
            } else {
                return false;
            }
            return true;
        }
    }
    this.movement = window.setInterval(function(){ship.move();},20);
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
function renderLoop(){

}
