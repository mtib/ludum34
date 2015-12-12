// Canvas Size
var WIDTH = 1280;
var HEIGHT = 720;

// Initialize Renderer
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {antialiasing: false, transparent: false, resolution: 1});
renderer.backgroundColor = 0xFF00FF;
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
var statsconfig = {font: "45px 'rockfire'", fill: "#000000", align:"right"};

var versionText = new PIXI.Text("Version 0.02d", versionconfig);
var actionText = new PIXI.Text("Fill all container ships\nSo that they carry 9 containers", actionconfig);
var statsText = new PIXI.Text("Mistake[s]\nPoint[s]\n#   Ship", statsconfig);
var animstatText = new PIXI.Text("n\nm\nN", statsconfig);

versionText.position = {x:10,y:10};
actionText.position = {x:WIDTH/2,y:HEIGHT/2};
actionText.anchor = {x:0.5,y:2.25};
statsText.position = {x:WIDTH-10, y:HEIGHT-10};
statsText.anchor = {x:1,y:1}
animstatText.position = {x:WIDTH-180, y:HEIGHT-10};
animstatText.anchor = {x:1,y:1}

// Adding info text
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

// Load Images
// eg. assets/images/buttons/[load_btn.png, unload_btn.png]
PIXI.loader
    .add(loadbtn_file)
    .add(unloadbtn_file)
    .add(seabg_file)
    .add(shitsprite_file)
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
    loadbtn.click = function(data){ingameLoad(); loadbtn.rotation=-0.03;window.setTimeout(function(){loadbtn.rotation=0.03;window.setTimeout(function(){loadbtn.rotation=0},200)},200)};
    unloadbtn.click = function(data){ingameUnload(); unloadbtn.rotation=-0.03;window.setTimeout(function(){unloadbtn.rotation=0.03;window.setTimeout(function(){unloadbtn.rotation=0},200)},200)};
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
    cBack.addChild(background);

    showIngame();
    testship = new Ship();

    // Filters
    // thisfil = new PIXI.filters.ColorMatrixFilter();
    // stage.filters = [thisfil];

    renderStage();
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
    }
    window.setInterval(function(){gameState.display();},100);
}

// Class for Ships
function Ship(){
    ship = this;
    this.start = parseInt(rinr(3,15));
    this.end = 9;
    this.filter = new PIXI.filters.ColorMatrixFilter();
    this.filter.hue(rinr(0,360));
    this.sprite = new PIXI.Sprite.fromImage(shitsprite_file);
    this.sprite.scale={x:1.6,y:1.6};
    this.sprite.position={x:WIDTH+5,y:HEIGHT-350};
    this.sprite.filters = [this.filter];
    cMiddle.addChild(this.sprite);
    this.die = function(){
        window.clearInterval(this.movement);
        cMiddle.removeChild(this.sprite);
        testship = new Ship();
        var sum = this.leftlevel + this.middlelevel + this.rightlevel;
        gameState.mistakes += abs(this.end-sum);
        gameState.points += abs(this.start-sum);
    };
    // FIXME: If this part generates properly, it'll work fine!
    this.leftlevel = 0;
    this.middlelevel = 0;
    this.rightlevel = 0;
    this.bobx = 0;
    this.boby = 0;
    this.move = function(){
        this.sprite.x -= gameState.points+3;
        // TODO: Bobbing...
        // this.bobx += rinr(-100,100)/100000.0;
        // this.boby += rinr(-100,100)/100000.0;
        // this.sprite.anchor = {x:this.bobx, y:this.boby};
        if (this.sprite.x+this.sprite.width<-4) {
            gameState.level += 1;
            this.die();
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
    // Debug
    gameState.points += 1;
}

// Called on "Unload"-Press
function ingameUnload(){
    // Debug
    gameState.mistakes += 1;
}

// Called in-between rendering
// should be used for logic
function renderLoop(){

}
