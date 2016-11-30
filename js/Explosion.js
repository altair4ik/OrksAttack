function Explosion(pos) {
    var sprite = new Sprite('images/explosion.png',
        [0, 0], [39, 39], 13, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'horizontal', true);
    this.render = function (ctx) {
        sprite.render(ctx);
    };
    this.pos = pos;
    this.update = function (dt) {
        sprite.update(dt)
    };
    this.isDone = function () {
        return sprite.done;
    }
}