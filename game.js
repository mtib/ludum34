/*
This is a game by:
Markus "TiByte" Becker   - Lead Developer
Lukas "LFalch"           - Programmer
Aileen                   - Graphic Designer
Kilian "Malloth Rha"     - Musician
Micha                    - Junior Programmer
Enrico                   - Q&A Tester

Using Libraries: Pixi.js and Howler.js
date: 13.12.2015 for LD34
theme: Two Buttons Control, Growing
*/

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
var numberconfig   = {font: "100px 'rockfire'", fill: "#CC2222", align:"right"};
var numberbgconfig = {font: "100px 'rockfire'", fill: "#FFFFFF", align:"right"};


var versionText    = new PIXI.Text("Version 0.06d", versionconfig);
var actionText     = new PIXI.Text("Fill all container ships\nSo that they carry    containers", actionconfig);
var actionbgText   = new PIXI.Text("Fill all container ships\nSo that they carry    containers", actionbgconfig);
var numberText     = new PIXI.Text("??", numberconfig);
var numberbgText   = new PIXI.Text("??", numberbgconfig);
// Fill in the gameState.goal value into the text
function setActionText(num){
    numberText.text   = " "+num;
    numberbgText.text = " "+num;
}
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
animstatText  .position = {x:WIDTH-130,   y:HEIGHT-5};
animstatbgText.position = {x:WIDTH-130+2, y:HEIGHT-5+2};
numberText    .position = {x:4*WIDTH/5-8,   y:HEIGHT/4-25};
numberbgText  .position = {x:4*WIDTH/5-8+2, y:HEIGHT/4-25+2};

actionText    .anchor = {x:0.5, y:3};
actionbgText  .anchor = {x:0.5, y:3};
statsText     .anchor = {x:1,   y:1};
statsbgText   .anchor = {x:1,   y:1};
animstatText  .anchor = {x:1,   y:1};
animstatbgText.anchor = {x:1,   y:1};
numberText    .anchor = {x:1,   y:1};
numberbgText  .anchor = {x:1,   y:1};

// Adding info text
cGui.addChild(actionbgText);
cGui.addChild(statsbgText);
cGui.addChild(animstatbgText);
cGui.addChild(numberbgText);
cGui.addChild(actionText);
cGui.addChild(statsText);
cGui.addChild(animstatText);
cGui.addChild(numberText);
cGui.addChild(versionText);

// Keyboard IO
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
var container_file2  = "assets/image/sprites/container_layer2.png";
var container_file3  = "assets/image/sprites/container_layer3.png";
var container_file4  = "assets/image/sprites/container_layer4.png";
var displace_file   = "assets/image/sprites/displace.png";
var mutem_file      = "assets/image/buttons/mutem_btn.png";
var mutes_file      = "assets/image/buttons/mutes_btn.png";
var start_file      = "assets/image/buttons/start_btn.png";
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
    .add(container_file)
    .add(container_file2)
    .add(container_file3)
    .add(container_file4)
    .add(port_file)
    .add(displace_file)
    .load(setup)

// Global sprites
var loadbtn    = null;
var unloadbtn  = null;
var soundbtn   = null;
var musicbtn   = null;
var startbtn   = null;
var background = null;
var testship   = null;
var ylose      = null;

function showIngame(){
    loadbtn.position = {x: 20,y: HEIGHT-100};
    loadbtn.height = 93;
    loadbtn.width = 160;
    unloadbtn.position = {x: loadbtn.width + 35, y: HEIGHT-100};
    unloadbtn.height = 93;
    unloadbtn.width = 160;
    musicbtn.position = {x: 2*loadbtn.width + 35+14, y: HEIGHT-100+24}
    musicbtn.height = 65; // d=28
    musicbtn.width = 112; // d=48
    soundbtn.position = {x: 2*loadbtn.width + 2*65 +25+14, y: HEIGHT-100+24}
    soundbtn.height = 65; // d=28
    soundbtn.width = 112; // d=48
    var info = new PIXI.Text("A - to add a container to the ship\nD - to remove a container\n\n~ try to fill or empty the ships to fit the task\n~ the number of containers changes periodically\n~ if you make 30 mistakes the game will end", {font: "60px 'rockfire'", fill: "#000", align: "left"});
    var credits = new PIXI.Text("a game by:\nMarkus 'Tibyte' Becker\nLucas 'LFalch'\nKilian 'Malloth Rha'\nAileen Bo 'honeycatani'", {font: "38px 'rockfire'", fill: "#000", align: "left"});
    ylose = new PIXI.Text("", {font: "150px 'rockfire'", fill: "#A00", align: "center"});
    startbtn.position = {x: WIDTH/2, y: HEIGHT/2};
    startbtn.anchor = {x:0.5,y:0.5};
    startbtn.height = 150; // d=28
    startbtn.width = 220; // d=48
    info.position = {x:0,y:startbtn.height+10};
    info.anchor = {x:0.4,y:0};
    credits.position.x = -1 * startbtn.position.x - 2* startbtn.width - 60;
    credits.position.y = -1 * startbtn.position.y - 2* startbtn.height + 5;
    ylose.position.y=-300;
    ylose.anchor = {x:0.5,y:1};
    startbtn.addChild(info);
    startbtn.addChild(credits);
    startbtn.addChild(ylose);
    cGui.addChild(loadbtn);
    cGui.addChild(unloadbtn);
    cGui.addChild(musicbtn);
    cGui.addChild(soundbtn);
    cGui.addChild(startbtn);
    loadbtn.interactive   = true;
    unloadbtn.interactive = true;
    musicbtn.interactive  = true;
    soundbtn.interactive  = true;
    startbtn.interactive  = true;
    loadbtn.click = function(data){ingameLoad();};
    unloadbtn.click = function(data){ingameUnload();};
    musicbtn.click = function(data){
        musictoggle=!musictoggle;
        if(musictoggle){
            gameSound.play();
        }else{
            gameSound.pause();
        }
    };
    soundbtn.click = function(data){
        soundtoggle=!soundtoggle;
    };
    startbtn.click = function(data){
            menuSound.stop();
            cGui.removeChild(startbtn);
            gameState.playing = true;
            gameState.points = 0;
            gameState.mistakes = 0;
            gameState.changeGoal(9);
            testship = new Ship();
            gameSound.play();
    };
}

// Do Howler Stuff here
var gameSound = new Howl({
    urls: ["assets/music/BuutonBoatBashingTheme.ogg"],
    loop: true,
    volume: 0.4,
    rate: 2,
    onend: function() { /* ... */}
});
var menuSound = new Howl({
    urls: ["assets/music/MenuTheme.ogg"],
    loop: true,
    volume: 0.4,
    rate: 2,
    onend: function() { /* ... */}
});
var successSound = new Howl({
    urls: ["assets/sounds/success.wav"],
    loop: false,
    volume: 0.2,
    rate: 1,
    onend: function() { /* ... */}
});
var failureSound = new Howl({
    urls: ["assets/sounds/mistake.wav"],
    loop: false,
    volume: 0.15,
    rate: 1,
    onend: function() { /* ... */}
});
var bleepSound = new Howl({
    urls: ["assets/sounds/bleep.wav"],
    loop: false,
    volume: 0.3,
    rate: 1,
    onend: function() { /* ... */}
});
var shipSuccessSound = new Howl({
    urls: ["assets/sounds/shipsuccess.wav"],
    loop: false,
    volume: 0.3,
    rate: 1,
    onend: function() { /* ... */}
});
var shipFailSound = new Howl({
    urls: ["assets/sounds/shipfail.wav"],
    loop: false,
    volume: 0.3,
    rate: 1,
    onend: function() { /* ... */}
});
var smashSound = new Howl({
    urls: ["assets/sounds/smash.wav"],
    loop: false,
    volume: 0.07,
    rate: 1.5,
    onend: function() { /* ... */}
});

menuSound.play();

// Called just before rendering the first frame
function setup(){
    counter = 0.0;
    // buttons
    loadbtn    = new PIXI.Sprite.fromImage(loadbtn_file);
    unloadbtn  = new PIXI.Sprite.fromImage(unloadbtn_file);
    musicbtn   = new PIXI.Sprite.fromImage(mutem_file);
    soundbtn   = new PIXI.Sprite.fromImage(mutes_file);
    background = new PIXI.Sprite.fromImage(seabg_file);
    startbtn   = new PIXI.Sprite.fromImage(start_file);
    // xblurb = new PIXI.filters.BlurXFilter();
    // background.filters = [xblurb];
    background.height = HEIGHT;
    background.width = WIDTH;
    var wavesprite = new PIXI.Sprite.fromImage(displace_file);
    wavesprite.scale={x:1,y:1};
    var wavey = new PIXI.filters.DisplacementFilter(wavesprite);
    var a = {x:0,y:0};
    var wavedisp = window.setInterval(function() {a.x += rinr(-30,30)/1000.0; a.y +=rinr(-30,30)/1000.0; wavesprite.position.x += a.x;wavesprite.position.y += a.y; a.x/=1.1; a.y/=1.1;},10);
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
    cranearm.scale.x=(cranearm.scale.x+vf)/2.0;
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
    this.goal = 9; // per ship
    this.playing = false;
    this.changeGoal = function(fg){
        this.goal = fg;
        setActionText(fg);
        if(soundtoggle){
            bleepSound.play();
        }
    }
    this.maxmistakes = 30; // 30 seems fine
    this.display = function(){
        // mistake, point, ship;
        animstatText.text=this.mistakes+"\n"+this.points+"\n"+this.level;
        animstatbgText.text=this.mistakes+"\n"+this.points+"\n"+this.level;
    }
    this.changeGoal(this.goal);
    window.setInterval(function(){gameState.display();},100);
    this.stopgame = function(){
        this.playing = false;
        cGui.addChild(startbtn);
        currlevel = 0;
        gameSound.stop();
        if(musictoggle){
            menuSound.play();
        }
        ylose.text = "YOU LOST";
    }
}

// Class for Ships
function Ship(){
    ship = this;

    // target
    this.end = gameState.goal;
    this.minCStack = 0;
    this.maxCStack = 5;

    // Filter to change hue
    this.filter = new PIXI.filters.ColorMatrixFilter();
    hr = rinr(0,360);
    while(true){
        // no pink!
        if(hr>180 && hr<290){
            hr = rinr(0,360);
        }else{
            break;
        }
    }
    this.filter.hue(hr);

    // load sprite
    this.sprite = new PIXI.Sprite.fromImage(shitsprite_file);
    this.sprite.scale={x:1.6,y:1.6};
    this.sprite.position={x:WIDTH+5,y:HEIGHT-350};
    this.sprite.filters = [this.filter];
    cMiddle.addChild(this.sprite);

    // left, middle and right pile amount
    this.leftlevel   = parseInt(rinr(this.minCStack,this.maxCStack));
    this.middlelevel = parseInt(rinr(this.minCStack,this.maxCStack));
    this.rightlevel  = parseInt(rinr(this.minCStack,this.maxCStack));
    while(true){
        if(this.leftlevel+this.middlelevel+this.rightlevel == this.end){
            this.rightlevel = parseInt(rinr(2,5));
            continue;
        } else {
            break;
        }
    }
    // unload from renderer
    this.die = function(){
        window.clearInterval(this.movement);
        cMiddle.removeChild(this.sprite);
        var sum = this.leftlevel + this.middlelevel + this.rightlevel;
        should = sum-this.end;
        nm = abs(this.end-sum);
        gameState.mistakes += nm
        np = abs(this.start-sum);
        if(should<0){
            // would have needed to add more;
            np += should;
        } else {
            // have add too many;
            np -= should;
        }
        if (this.start-sum)
        if(soundtoggle && nm>np){
            shipFailSound.play();
        } else if (soundtoggle && np>0) {
            shipSuccessSound.play();
        }
        for (var i = 0; i < np; i++) {
            gameState.points   += 1;
            if(gameState.points%20==0){
                // Change game goal every 10 Points
                gameState.changeGoal(parseInt(rinr(3,13)));
            }
        }
        if (gameState.mistakes>gameState.maxmistakes){
            gameState.stopgame();
        }
        if (gameState.playing){
            testship = new Ship(); // This IS! very odd to hardcode
        }
    };
    // FIX?ME: If this part generates properly, it'll work fine!
    this.start = this.leftlevel + this.middlelevel + this.rightlevel;
    this.defy = this.sprite.y;
    // periodically called to move ship
    this.move = function(){
        // speed: http://wolfr.am/8Wej7DTi
        dx = 3 + 2*Math.pow(gameState.points/6,0.4);
        // old linear equation:
        // dx = gameState.points/2.5+3;
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
            if(soundtoggle){
                failureSound.play();
                gameState.mistakes += 1;
            }
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
                if(soundtoggle){
                    failureSound.play();
                    gameState.mistakes += 1;
                }
                return false;
            }
            if(soundtoggle){
                successSound.play();
            }
            return true;
        }
    }
    this.killCargo=function(lvl){
        that = this.cargo[lvl].pop();
        that.falldie(that); // "this" didn't work inside the timeout
    }
    this.loadc=function(){
        ncont = null;
        if (this.mode == null){
            gameState.mistakes += 1;
            if (soundtoggle){
                failureSound.play();
            }
            return false;
        } else if (this.mode == 0 && this.leftlevel < 5) {
            ncont = this.cargo[0][this.cargo[0].length]=new Container(this.sprite.x+ 900, this.sprite.y+this.shipv0  +this.leftlevel * (-1*this.cargoh), 1);
            this.leftlevel += 1;
        } else if (this.mode == 1 && this.middlelevel < 5) {
            ncont = this.cargo[1][this.cargo[1].length]=new Container(this.sprite.x+1300, this.sprite.y+this.shipv0-3+this.middlelevel*(-1*this.cargoh), 1);
            this.middlelevel += 1;
        } else if (this.mode == 2 && this.rightlevel < 5) {
            ncont = this.cargo[2][this.cargo[2].length]=new Container(this.sprite.x+1700, this.sprite.y+this.shipv0-6+this.rightlevel* (-1*this.cargoh), 1);
            this.rightlevel += 1;
        }
        ncont.sprite.anchor.y = (ncont.sprite.position.y-30)/this.cargoh;
        ncont.fall(ncont);
        return true;
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
    container = this;

    // instatiation position
    this.ix = x;
    this.iy = y;

    // pile to be on
    this.mode = me.mode;

    // loading sprite, positioning it
    possprite = [container_file, container_file2, container_file3, container_file4]
    this.sprite=new PIXI.Sprite.fromImage(possprite[parseInt(rinr(0,possprite.length)
    )]);
    this.sprite.position.set(x,y);
    this.sprite.anchor.set(0.5,1);

    // change color
    this.filter = new PIXI.filters.ColorMatrixFilter();
    hr = rinr(0,360);
    while(true){
        // no pink!
        if(hr>180 && hr<290){
            hr = rinr(0,360);
        }else{
            break;
        }
    }
    this.filter.hue(hr);
    this.sprite.filters = [this.filter];
    cMiddle.addChild(this.sprite);

    // Fall animation (onto boat)
    this.fall = function(that){
        if( that.sprite.anchor.y>1 ) {
            that.sprite.anchor.y-=0.1
            window.setTimeout(function(){that.fall(that)},10);
        } else {
            that.sprite.anchor.y=1;
            if(soundtoggle){
                smashSound.play();
            }
        }
    }

    // set position
    this.set = function(x,y){
        this.sprite.position.set(x,y);
    }

    this.falldie = function(that){
        if(that.sprite.anchor.y>-5){
            that.sprite.anchor.y-=0.3;
            window.setTimeout(function(){that.falldie(that)},10);
        }else{
            that.die();
        }
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
var musictoggle = true;
var soundtoggle = true;

// starting speed level
currlevel = 0;
function renderLoop(){
    try {
        // speed up
        if(musictoggle && gameState.points >= speedswitch[currlevel+1]){
            currlevel = currlevel+1;
            gameSound._rate=speedlevel[currlevel];
            gameSound.fade(0.4,0,10);
            gameSound.pause();
            gameSound.fade(0,0.4,10);
            gameSound.play();
            if(!gameState.playing){
                gameSound.stop();
            }
        }
    } catch (e) {
        // ends up here, if there isn't any faster level
    } finally {
        // nothing to do here
    }
}
