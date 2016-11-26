// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var terrainPattern;
var player = new Player();
var shots = [];
var lastFire = Date.now();
canvas.width = 600;
canvas.height = 600;
document.body.appendChild(canvas);

// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function update(dt) {
    shots.forEach(function (item) {
        item.move(dt);
    });
    handleInput(dt);
}

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.moveDown(dt);
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.moveUp(dt);
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.moveLeft(dt);
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.moveRight(dt);
    }
    if(input.isDown('SPACE')) {
        if (Date.now() - lastFire > 500) {
            var shot = new Shot(player.direction);
            switch (player.direction) {
                case 'up':
                    shot.pos[0] = player.pos[0] + player.width / 4;
                    shot.pos[1] = player.pos[1] - player.height * 0.5;
                    break;
                case 'down':
                    shot.pos[0] = player.pos[0] + player.width / 4;
                    shot.pos[1] = player.pos[1] + player.height / 2;
                    break;
                case 'left':
                    shot.pos[0] = player.pos[0] - player.width / 2;
                    shot.pos[1] = player.pos[1] + player.height / 2;
                    break;
                default:
                    shot.pos[0] = player.pos[0] + player.width / 2;
                    shot.pos[1] = player.pos[1] + player.height / 2;
            }
            shots.push(shot);
            lastFire = Date.now();
        }
    }
}

// Draw everything
function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the player if the game isn't over
    renderEntity(player);
    shots.forEach(function (item) {
        renderEntity(item);
    })
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.render(ctx);
    ctx.restore();
}

function init() {
    terrainPattern = ctx.createPattern(resources.get('images/terrain.png'), 'repeat');


    reset();
    lastTime = Date.now();
    main();
}

resources.load([
    'images/mage.png',
    'images/terrain.png',
    'images/shotUp.png',
    'images/shotDown.png',
    'images/shotLeft.png',
    'images/shotRight.png'
]);
resources.onReady(init);


// Reset game to original state
function reset() {
    player.pos = [canvas.width / 2, canvas.height / 2];
};