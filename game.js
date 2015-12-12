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
var versionText = new PIXI.Text("Version 0.02d", fontConfig);
cGui.addChild(versionText);
versionText.position = {x:10,y:10};

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

// Load Images
// eg. assets/images/buttons/[load_btn.png, unload_btn.png]
PIXI.loader
    .add(loadbtn_file)
    .add(unloadbtn_file)
    .load(setup)

// Global sprites
loadbtn = new PIXI.Sprite.fromImage(loadbtn_file)
unloadbtn = new PIXI.Sprite.fromImage(unloadbtn_file)

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
    loadbtn.click = function(data){console.log("load"); loadbtn.rotation=-0.03;window.setTimeout(function(){loadbtn.rotation=0.03;window.setTimeout(function(){loadbtn.rotation=0},200)},200)};
    unloadbtn.click = function(data){console.log("unload"); unloadbtn.rotation=-0.03;window.setTimeout(function(){unloadbtn.rotation=0.03;window.setTimeout(function(){unloadbtn.rotation=0},200)},200)};
}

// TODO: Do Howler Stuff here

// Called just before rendering the first frame
function setup(){
    showIngame();
    renderStage();
}

// Class for Gamestate
function State(){
    this.level = 0;
    this.name = "";
    this.mistakes = 0;
}

// Class for Ships
function Ship(st, en, typ){
    this.start = st;
    this.end = en;
    this.typ = typ;
    this.sprite = null;
    this.die = function(){
        // Remove Child from cMiddle
    };
}

// Request Animation Frame
function renderStage(){
    requestAnimationFrame(renderStage);
    renderLoop();
    renderer.render(stage);
}

// Called on "Load"-Press
function ingameLoad(){
    versionText.text="loading";
}

// Called on "Unload"-Press
function ingameUnload(){
    versionText.text="unloading";
}

// Called in-between rendering
// should be used for logic
function renderLoop(){

}
