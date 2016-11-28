function Enemy(pos) {
    this.pos = pos;
    this.height = 32;
    this.width = 32;
    this.direction = 'down';
    var _spriteDown = new Sprite('images/enemy.png', [0, 0], [32, 32], 9, [0, 1, 2]),
        _spriteLeft = new Sprite('images/enemy.png', [0, 32], [32, 32], 9, [0, 1, 2]),
        _spriteRight = new Sprite('images/enemy.png', [0, 64], [32, 32], 9, [0, 1, 2]),
        _spriteUp = new Sprite('images/enemy.png', [0, 96], [32, 32], 9, [0, 1, 2]),
        _sprite = _spriteDown,
        _speed = 50;
    this.render = function (ctx) {
        _sprite.render(ctx);
    };
    this.move = function (dt) {
      switch (this.direction){
          case 'down':
              this.moveDown(dt);
              break;
          case 'up':
              this.moveUp(dt);
              break;
          case 'left':
              this.moveLeft(dt);
              break;
          default:
              this.moveRight(dt);
      }
      if(Math.random() > 0.995) {
          this.rotate();
      }
    };
    this.rotate = function () {
        var directions = ['up', 'down', 'left', 'right'];
        directions.splice(directions.indexOf(this.direction));
        var index = Math.floor(Math.random() * 3);
        this.direction = directions[index];
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