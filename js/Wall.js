function Wall(pos) {
    this.pos = pos;
    var sprite = new Sprite('images/wall.png', [0, 0], [20, 20], 1, [0]);
    this.height = 20;
    this.width = 20;
    this.render = function (ctx) {
        sprite.render(ctx);
    };
    this.update = function (dt) {
        sprite.update(dt)
    };
}