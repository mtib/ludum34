// Canvas Size
var WIDTH = 1280;
var HEIGHT = 720;

// Initialize Renderer
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {antialiasing: false, transparent: false, resolution: 1});
renderer.backgroundColor = 0xFF00FF;

// Master Containter
var stage = new PIXI.Container();

// Config goes here:
var fontConfig = {font: "30px 'rockfire'", fill: "#000000", align: "left"};
var relcenter = {x: 0.5, y: 0.5};

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
var versionText = new PIXI.Text("Version 0.01d", fontConfig);
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
var fuckKey = keyboard(70);
fuckKey.press=function(){
    versionText.text="FUCK YOU!";
}


// init Gamestate
var gameState = new State();

// Load Images
// eg. assets/images/buttons/[load_btn.png, unload_btn.png]
/*

PIXI.loader
    .add("..");

*/

// Called just before rendering the first frame
function setup(){
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

// Start Rendering
setup();
