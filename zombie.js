const States = {
    Agressive: 0,
    Patrolling: 1
}

let speedMultiplyer = 1.8;

export class Zombie {
    constructor (x, y, maze, colors, speed, state = States.Patrolling) {
        this.x = x;
        this.y = y;
        this.maze = maze;
        this.colors = colors;
        this.cellSize = maze.cellSize;
        this.radius = Math.max(1, Math.round(this.cellSize/6));
        this.speed = speed;
        this.detectRadius = this.cellSize * 4;
        this.state = state;
        this.target = this.getPatrollCoord();
        this.targetCell;
        this.atTarget = false;
        this.closeTarget;
        this.stepCountSinceTarget = 0;
    }

    drawZombie(ctx){
        ctx.fillStyle = this.colors.zombie;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    move(ctx, player, delta) {
        //Byter target varje efter ett tag eller vid resize för att inte fastna
        if (this.stepCountSinceTarget >= 30000 * delta/1000) { 
            if (this.state == States.Patrolling) {
                this.target = this.getPatrollCoord();
                this.atTarget = false;
                this.nextCloseTarget();
            }
            else if (this.state == States.Agressive) {
                this.target = this.getChasingCoord(player);
                this.nextCloseTarget();
            }

            this.stepCountSinceTarget = 0;
        }

        let dx = player.x - this.x + this.radius;
        let dy = player.y - this.y + this.radius;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance + player.radius <= this.detectRadius) {
            if (this.state != States.Agressive) {
                this.state = States.Agressive;
                this.speed = this.speed * speedMultiplyer;
            }
            this.target = this.getChasingCoord(player);
        }
        else {
            if (this.state != States.Patrolling) {
                this.state = States.Patrolling;
                this.speed = this.speed / speedMultiplyer;
            }
            if (this.atTarget === true) {
                this.target = this.getPatrollCoord();
                this.atTarget = false;
            }
        }

        if (this.atTarget === false) {
            if (this.stepCountSinceTarget == 0) {
                this.nextCloseTarget();
            }
            this.walkToward(this.closeTarget, delta);
        }

        this.stepCountSinceTarget += 1;
        this.drawZombie(ctx);
    }

    walkToward(coord, delta) {
        let speed = this.speed * delta/1000;

        if (this.closeTarget[0] === this.x && this.closeTarget[1] === this.y) {
            this.nextCloseTarget();
        }

        if (this.x < coord[0]) {
            this.x += speed;
        }
        else if (this.x > coord[0]) {
            this.x -= speed;
        }

        if (this.y < coord[1]) {
            this.y += speed;
        }
        else if (this.y > coord[1]) {
            this.y -= speed;
        }

        if (Math.abs(this.x - coord[0]) < speed && Math.abs(this.y - coord[1]) < speed) {
            this.x = coord[0];
            this.y = coord[1];
            if (this.closeTarget[0] === this.target[0] && this.closeTarget[1] === this.target[1]) {
                this.atTarget = true;
                this.stepCountSinceTarget = 0;
            } else {
                this.nextCloseTarget();
            }
        }
    }

    nextCloseTarget() {
        let nextCell;
        let currentCell = [Math.floor(this.x/this.cellSize), Math.floor(this.y/this.cellSize)];

        let directions;

        if (currentCell[0] === this.targetCell[0]) {  // Samma kolumn som mål
            directions = currentCell[1] < this.targetCell[1] ? directions = [[0, 1], [1, 0], [-1, 0], [0, -1]] : directions = [[0, -1], [-1, 0], [1, 0], [0, 1]];
        } else if (currentCell[1] === this.targetCell[1]) {  // Samma rad som mål
            directions = currentCell[0] < this.targetCell[0] ? directions = [[1, 0], [0, 1], [0, -1], [-1, 0]] : directions = [[-1, 0], [0, 1], [0, -1], [1, 0]];
        } else {
            directions = [
                [1, 0],  
                [0, 1],  
                [-1, 0], 
                [0, -1] 
            ];
        }
        if (currentCell[0] < this.targetCell[0] && currentCell[1] < this.targetCell[1]) {
            if (this.targetCell[0] - currentCell[0] < this.targetCell[1] - currentCell[1]) {
                directions = [
                    [0, 1],
                    [1, 0],
                    [-1, 0],
                    [0, -1]
                ];
            } else {
                directions = [
                    [1, 0],
                    [0, 1],
                    [-1, 0],
                    [0, -1]
                ];
            }
        }
        else if (currentCell[0] > this.targetCell[0] && currentCell[1] < this.targetCell[1]) {
            if (currentCell[0] - this.targetCell[0] < this.targetCell[1] - currentCell[1]) {
                directions = [
                    [0, 1],
                    [-1, 0],
                    [1, 0],
                    [0, -1]
                ];
            } else {
                directions = [
                    [-1, 0],
                    [0, 1],
                    [1, 0],
                    [0, -1]
                ];
            }
        }
        else if (currentCell[0] > this.targetCell[0] && currentCell[1] > this.targetCell[1]) {
            if (currentCell[0] - this.targetCell[0] < currentCell[1] - this.targetCell[1]) {
                directions = [
                    [0, -1],
                    [-1, 0],
                    [1, 0],
                    [0, 1]
                ];
            } else {
                directions = [
                    [-1, 0],
                    [0, -1],
                    [1, 0],
                    [0, 1]
                ];
            }
        }
        else if (currentCell[0] < this.targetCell[0] && currentCell[1] > this.targetCell[1]) {
            if (this.targetCell[0] - currentCell[0] < currentCell[1] - this.targetCell[1]) {
                directions = [
                    [0, -1],
                    [1, 0],
                    [-1, 0],
                    [0, 1]
                ];
            } else {
                directions = [
                    [1, 0],
                    [0, -1],
                    [-1, 0],
                    [0, 1]
                ];
            }
        }
        else if (directions == [[1, 0], [0, 1], [-1, 0], [0, -1]]){
            console.log("default dir");
        }

        for (let dir of directions) {
            let closeTargetCell = [currentCell[0] + dir[0], currentCell[1] + dir[1]];
    
            // Är cellen i labyrinten
            if (closeTargetCell[1] >= 0 && closeTargetCell[1] < this.maze.maze.length &&
                closeTargetCell[0] >= 0 && closeTargetCell[0] < this.maze.maze[0].length) {
    
                // Är cellen inte en vägg
                if (this.maze.maze[closeTargetCell[1]][closeTargetCell[0]] !== 1) {
                    nextCell = closeTargetCell;
                    break; // Avsluta vid valid cell
                }
            }
        }
        
        //Hitta en slumpmässig punkt i cellen om inte i samma cell som target
        if (nextCell && (this.targetCell[0] != currentCell[0] || this.targetCell[1] != currentCell[1])) {
            let randomX = Math.round(Math.random() * (this.cellSize - 2*this.radius) + nextCell[0] * this.cellSize + this.radius);
            let randomY = Math.round(Math.random() * (this.cellSize - 2*this.radius) + nextCell[1] * this.cellSize + this.radius);
            this.closeTarget = [randomX, randomY];
        }
        else {
            this.closeTarget = this.target
        }
    }

    getPatrollCoord() {
        let cellFound = false;

        while (!cellFound) {
            let randomDist = Math.random() * this.maze.width/5 + this.maze.width/5;
            let randomDir = Math.random() * 2*Math.PI;
            let newX = Math.round(this.x + Math.cos(randomDir) * randomDist);
            let newY = Math.round(this.y + Math.sin(randomDir) * randomDist);
            //För att zombiesen ska stanna innaför labyrintens gränser
            newX = (newX + this.maze.width) % this.maze.width;
            newY = (newY + this.maze.height) % this.maze.height;

            this.targetCell = [Math.floor(newX / this.cellSize), Math.floor(newY / this.cellSize)];

            //Om målet inte är en vägg
            if (this.maze.maze[this.targetCell[1]][this.targetCell[0]] === 0) {
                if (Math.round(newX / this.cellSize) != Math.round((newX - this.radius)/this.cellSize)){
                    newX += this.radius;
                } else if (Math.round(newX / this.cellSize) != Math.round((newX + this.radius)/this.cellSize)) {
                    newX -= this.radius
                }
                if (Math.round(newY / this.cellSize) != Math.round((newY - this.radius)/this.cellSize)) {
                    newY += this.radius;
                } else if (Math.round(newY / this.cellSize) != Math.round((newY + this.radius)/this.cellSize)) {
                    newY -= this.radius;
                }
                return [newX, newY];
            }
        }
    }

    getChasingCoord(player) {
        this.targetCell = [Math.floor(player.x / this.cellSize), Math.floor(player.y / this.cellSize)];

        return [player.x, player.y];
    }


    resize(width, height, oldWidth, oldHeight, speed) {
        this.cellSize = height/10;

        this.radius = Math.max(1, Math.round(this.cellSize/6));
        this.detectRadius = this.cellSize * 4;
        if (this.state == States.Agressive) {
            this.speed = speed * speedMultiplyer;
        } else if (this.state == States.Patrolling) {
            this.speed = speed;
        }
        
        this.x = Math.round(this.x / oldWidth * width);
        this.y = Math.round(this.y / oldHeight * height);   

        this.stepCountSinceTarget = 9999999;
    }
    
}