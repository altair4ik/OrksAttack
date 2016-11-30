function Shot(direction) {
    var sprite,
        speed = 150;
    this.pos = [0, 0];
    this.height = 15;
    this.width = 15;

    switch(direction){
        case 'up':
            sprite = new Sprite('images/shotUp.png', [0, 0], [16, 28], 12, [3, 2, 1, 0], 'vertical');
            break;
        case 'down':
            sprite = new Sprite('images/shotDown.png', [0, 0], [16, 28], 12, [0, 1, 2, 3], 'vertical');
            break;
        case 'left':
            sprite = new Sprite('images/shotLeft.png', [0, 0], [28, 16], 12, [3, 2, 1, 0]);
            break;
        default:
            sprite = new Sprite('images/shotRight.png', [0, 0], [28, 16], 12, [0, 1, 2, 3]);
    }

    this.move = function (dt) {
        switch(direction){
            case 'up':
                this.pos[1] -= speed * dt;
                break;
            case 'down':
                this.pos[1] += speed * dt;
                break;
            case 'left':
                this.pos[0] -= speed * dt;
                break;
            default:
                this.pos[0] += speed * dt;
        }
        sprite.update(dt);
    };

    this.render = function (ctx) {
        sprite.render(ctx);
    };
}