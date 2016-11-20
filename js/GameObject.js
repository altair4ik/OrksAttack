function GameObject() {
    this.width = 32;
    this.height = 32;
    this.x = 0;
    this.y = 0;
    this.imageReady = false;
    this.image = new Image();
    this.image.onload = function () {
        this.imageReady = true;
    }
}

GameObject.prototype.drow = function (context) {
    if(this.imageReady) {
        context.drowImage(this.image, this.x, this.y);
    }
};


