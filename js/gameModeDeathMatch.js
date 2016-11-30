function deathMatch(numberOfEnemies) {
    if (enemies.length < numberOfEnemies){
        enemies.push(new Enemy([randomRespawn(), randomRespawn()]));
        enemies.push(new Enemy([randomRespawn(), randomRespawn()]));
    }
}

function randomRespawn() {
    return Math.floor(Math.random() * (500 - 100 + 1)) + 100;
}