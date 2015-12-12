var WIDTH = 1280;
var HEIGHT = 720;
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {antialiasing: false, transparent: false, resolution: 1});
var stage = new PIXI.Container();
renderer.backgroundColor = 0xFF00FF;
document.getElementById("game").appendChild(renderer.view);
var fontConfig = {font: "30px 'rockfire'", fill: "#000000", align: "left"};

var cBack = new PIXI.Container();
var cMiddle = new PIXI.Container();
var cFront = new PIXI.Container();
var cGui = new PIXI.Container();

stage.addChild(cBack);
stage.addChild(cMiddle);
stage.addChild(cFront);
stage.addChild(cGui);

var versionText = new PIXI.Text("Version 0.01d", fontConfig);
cGui.addChild(versionText);
versionText.position = {x:10,y:10};

var loadKey = keyboard(65);
loadKey.press=function(){
    ingameLoad();
};
var unloadKey = keyboard(68);
unloadKey.press=function(){
    ingameUnload();
};

var gameState = new State();

/*

PIXI.loader
    .add("..");

*/


function setup(){
    renderStage();
}

function State(){
    this.level = 0;
    this.name = "";
    this.mistakes = 0;
}

function Ship(st, en, typ){
    this.start = st;
    this.end = en;
    this.typ = typ;
    this.sprite = null;
    this.die = function(){
        // Remove Child from cMiddle
    };
}

function renderStage(){
    requestAnimationFrame(renderStage);
    renderLoop();
    renderer.render(stage);
}

function ingameLoad(){
    versionText.text="loading";
}

function ingameUnload(){
    versionText.text="unloading";
}

function renderLoop(){

}

// Start Rendering
setup();
