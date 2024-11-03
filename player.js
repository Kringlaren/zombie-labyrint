export class Player {
    constructor (x, y, colors, radius = 10, speed = 2.5) {
        this.x = x;
        this.y = y;
        this.colors = colors;
        this.radius = radius;
        this.speed = speed;
    }

    drawPlayer(ctx){
        ctx.fillStyle = this.colors.player;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    //Alla celler som spelaren täcker
    getCells(cellSize) {
        let cells = [];
        cells.push([Math.floor(this.x/cellSize), Math.floor((this.y - this.radius)/cellSize)]);
        cells.push([Math.floor((this.x + this.radius)/cellSize), Math.floor(this.y/cellSize)]);
        cells.push([Math.floor(this.x/cellSize), Math.floor((this.y + this.radius)/cellSize)]);
        cells.push([Math.floor((this.x - this.radius)/cellSize), Math.floor(this.y/cellSize)]);
        return cells;
    }
}

