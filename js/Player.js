function Player() {
    this.pos = [0, 0];
    this.height = 32;
    this.width = 32;
    this.direction = 'down';
    var _spriteDown = new Sprite('images/mage.png', [0, 0], [32, 32], 9, [0, 1, 2]),
        _spriteLeft = new Sprite('images/mage.png', [0, 32], [32, 32], 9, [0, 1, 2]),
        _spriteRight = new Sprite('images/mage.png', [0, 64], [32, 32], 9, [0, 1, 2]),
        _spriteUp = new Sprite('images/mage.png', [0, 96], [32, 32], 9, [0, 1, 2]),
        _sprite = _spriteDown,
        _speed = 50;
    this.render = function (ctx) {
        _sprite.render(ctx);
    };
    this.moveUp = function (dt) {
        this.direction = 'up';
        this.pos[1] -= _speed * dt;
        _sprite = _spriteUp;
        _sprite.update(dt);
    };
    this.moveDown = function (dt) {
        this.direction = 'down';
        this.pos[1] += _speed * dt;
        _sprite = _spriteDown;
        _sprite.update(dt);
    };
    this.moveRight = function (dt) {
        this.direction = 'right';
        this.pos[0] += _speed * dt;
        _sprite = _spriteRight;
        _sprite.update(dt);
    };
    this.moveLeft = function (dt) {
        this.direction = 'left';
        this.pos[0] -= _speed * dt;
        _sprite = _spriteLeft;
        _sprite.update(dt);
    };
}