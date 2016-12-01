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
var shots = [];
var explosions = [];
var lastFire = Date.now();
var enemies = [];
var walls = [];
var player;
var numberOfEnemies;
var score = 0;
var scoreEl = document.getElementById('score');
var isGameOver = false;
canvas.width = 600;
canvas.height = 600;
document.body.appendChild(canvas);
createBattleField(configMatrix);

// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    if(!isGameOver){
        update(dt);
    }
    render();

    lastTime = now;
    requestAnimFrame(main);
}

function update(dt) {
    shots.forEach(function (item) {
        item.move(dt);
    });
    enemies.forEach(function (item) {
        item.move(dt);
        checkEnemyBounds(item);
    });
    explosions.forEach(function (item) {
        item.update(dt);
    });
    walls.forEach(function (item) {
        item.update(dt);
    });
    deleteFinishExplosions();
    handleInput(dt);
    checkPlayerBounds();
    checkShotBounds();
    checkCollisions();
    checkEnemyWall(dt);
    checkShotWall();
    deathMatch(numberOfEnemies);
    checkIsGameOver();

    scoreEl.innerHTML = score;
}

function deleteFinishExplosions() {
    for(var i = 0; i < explosions.length; i++){
        if(explosions[i].isDone()){
            explosions.splice(i, 1);
            i--;
        }
    }
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
        if (Date.now() - lastFire > 350) {
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
    enemies.forEach(function (item) {
        renderEntity(item);
    });
    shots.forEach(function (item) {
        renderEntity(item);
    });
    explosions.forEach(function (item) {
        renderEntity(item);
    });
    walls.forEach(function (item) {
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
    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    lastTime = Date.now();
    main();
}

//Check bounds

function checkPlayerBounds() {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.width) {
        player.pos[0] = canvas.width - player.width;
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.height) {
        player.pos[1] = canvas.height - player.height;
    }
}

function checkEnemyWall(dt) {
    enemies.forEach(function (item) {
        var enemy = item;
        walls.forEach(function (item) {
            if (boxCollides(enemy.pos, enemy.height, enemy.width, item.pos, item.height, item.width)) {
                switch (enemy.direction){
                    case 'up':
                        enemy.pos[1] += enemy.speed * dt;
                        enemy.rotate();
                        break;
                    case 'down':
                        enemy.pos[1] -= enemy.speed * dt;
                        enemy.rotate();
                        break;
                    case 'left':
                        enemy.pos[0] += enemy.speed * dt;
                        enemy.rotate();
                        break;
                    default:
                        enemy.pos[0] -= enemy.speed * dt;
                        enemy.rotate();
                }
            }
        });
    })
}

function checkEnemyBounds(enemy) {
    if(enemy.pos[0] < 0) {
        enemy.pos[0] = 0;
        enemy.rotate();
    }
    else if(enemy.pos[0] > canvas.width - enemy.width) {
        enemy.pos[0] = canvas.width - enemy.width;
        enemy.rotate();
    }

    if(enemy.pos[1] < 0) {
        enemy.pos[1] = 0;
        enemy.rotate();
    }
    else if(enemy.pos[1] > canvas.height - enemy.height) {
        enemy.pos[1] = canvas.height - enemy.height;
        enemy.rotate();
    }
}

function checkShotBounds() {
    for(var i = 0; i < shots.length; i++){
        if(shots[i].pos[1] < 0 || shots[i].pos[1] > canvas.height ||
            shots[i].pos[0] > canvas.width || shots[i].pos[0] < 0) {
            shots.splice(i, 1);
            i--;
        }
    }
}

function checkShotWall() {
    for(var i = 0; i < shots.length; i++){
        for(var j = 0; j < walls.length; j++){
            if (boxCollides(shots[i].pos, shots[i].height, shots[i].width,
                    walls[j].pos, walls[j].height, walls[j].width)) {
                shots.splice(i, 1);
                i--;
                break;
            }
        }
    }
}


//enemy die
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
    b <= y2 || y > b2);
}

function boxCollides(enemyPos, enemyHeight, enemyWidth, shotPos, shotHeight, shotWidth) {
    return collides(enemyPos[0], enemyPos[1],
        enemyPos[0] + enemyWidth, enemyPos[1] + enemyHeight,
        shotPos[0], shotPos[1],
        shotPos[0] + shotWidth, shotPos[1] + shotHeight);
}

function checkCollisions() {

    // Run collision detection for all enemies and bullets
    for(var i=0; i<enemies.length; i++) {
        var enemyPos = enemies[i].pos;
        var enemyHeight = enemies[i].height;
        var enemyWidth = enemies[i].width;

        for(var j=0; j<shots.length; j++) {
            var shotPos = shots[j].pos;
            var shotHeight = shots[j].height;
            var shotWidth = shots[j].width;

            if(boxCollides(enemyPos, enemyHeight, enemyWidth, shotPos, shotHeight, shotWidth)) {
                // Remove the enemy
                score += 50;
                numberOfEnemies = enemies.length;
                enemies.splice(i, 1);
                i--;
                shots.splice(j, 1);
                explosions.push(new Explosion(enemyPos));
                break;
            }
        }
    }
}

function checkIsGameOver() {
    enemies.forEach(function (item) {
        if(boxCollides(item.pos, item.height, item.width, player.pos, player.height, player.width)){
            gameOver();
        }
    })
}

function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    isGameOver = true;
}

resources.load([
    'images/mage.png',
    'images/terrain.png',
    'images/shotUp.png',
    'images/shotDown.png',
    'images/shotLeft.png',
    'images/shotRight.png',
    'images/enemy.png',
    'images/explosion.png',
    'images/wall.png'
]);
resources.onReady(init);


// Reset game to original state
function reset() {
    score = 0;
    shots.length = 0;
    enemies.length = 0;
    numberOfEnemies = 0;
    createBattleField(configMatrix);
    document.getElementById('game-over').style.display = 'none';
    isGameOver = false;
}