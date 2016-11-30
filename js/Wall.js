function Wall(pos) {
    this.pos = pos;
    var sprite = new Sprite('images/wall.png', [0, 0], [32, 32], 1, [0]);
    this.height = 32;
    this.width = 32;
    this.render = function (ctx) {
        sprite.render(ctx);
    };
    this.update = function (dt) {
        sprite.update(dt)
    };
}