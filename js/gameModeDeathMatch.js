function deathMatch(numberOfEnemies) {
    if (enemies.length < numberOfEnemies){
        var respawn = [
            [120, 120],
            [460, 120],
            [140, 460],
            [460, 460]
        ],
            indexOne = Math.floor(Math.random() * 3),
            indexTwo = Math.floor(Math.random() * 2);
        enemies.push(new Enemy(respawn[indexOne]));
        respawn.splice(indexOne, 1);
        enemies.push(new Enemy(respawn[indexTwo]));
    }
}