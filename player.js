export class Player {
    constructor (x, y, colors, cellSize) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.colors = colors;
        this.radius = Math.round(cellSize/6);
        this.speed = this.cellSize/9 * 30; //Standardiserad hastighet på 30 FPS
    }

    drawPlayer(ctx){
        ctx.fillStyle = this.colors.player;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    //Alla celler som spelaren täcker
    getCells() {
        let cells = [];
        cells.push([Math.floor(this.x/this.cellSize), Math.floor((this.y - this.radius)/this.cellSize)]);
        cells.push([Math.floor((this.x + this.radius)/this.cellSize), Math.floor(this.y/this.cellSize)]);
        cells.push([Math.floor(this.x/this.cellSize), Math.floor((this.y + this.radius)/this.cellSize)]);
        cells.push([Math.floor((this.x - this.radius)/this.cellSize), Math.floor(this.y/this.cellSize)]);
        return cells;
    }

    resize(width, height, oldWidth, oldHeight) {
        let relativeX = this.x / oldWidth;
        let relativeY = this.y / oldHeight;

        this.cellSize = height/10;
        this.radius = Math.round(this.cellSize/6);
        this.speed = this.cellSize/9 * 30;

        this.x = relativeX*width;
        this.y = relativeY*height;
    }
}

