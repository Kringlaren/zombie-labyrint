const States = {
    Agressive: 0,
    Patrolling: 1
}

export class Zombie {
    constructor (x, y, maze, colors, radius = 10, speed = 1, detectRadius = 200, state = States.Patrolling) {
        this.x = x;
        this.y = y;
        this.maze = maze;
        this.colors = colors;
        this.radius = radius;
        this.speed = speed;
        this.detectRadius = detectRadius;
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

    move(ctx, player) {
        //Byter target varje 300 frames för att inte fastna
        if (this.stepCountSinceTarget >= 300) { 
            if (this.state == States.Patrolling) {
                this.target = this.getPatrollCoord();
                this.atTarget = false;
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
                this.speed += 1;
            }
            this.target = this.getChasingCoord(player);
        }
        else {
            if (this.state != States.Patrolling) {
                this.state = States.Patrolling;
                this.speed -= 1;
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
            this.walkToward(this.closeTarget);
        }

        this.stepCountSinceTarget += 1;
        this.drawZombie(ctx);
    }

    walkToward(coord) {
        if (this.closeTarget[0] === this.x && this.closeTarget[1] === this.y) {
            this.nextCloseTarget();
        }

        if (this.x < coord[0]) {
            this.x += this.speed;
        }
        else if (this.x > coord[0]) {
            this.x -= this.speed;
        }

        if (this.y < coord[1]) {
            this.y += this.speed;
        }
        else if (this.y > coord[1]) {
            this.y -= this.speed;
        }

        if (Math.abs(this.x - coord[0]) < this.speed && Math.abs(this.y - coord[1]) < this.speed) {
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
        let cellSize = this.maze.cellSize;
        let nextCell;
        let currentCell = [Math.floor(this.x/cellSize), Math.floor(this.y/cellSize)];

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
        
        if (nextCell && (this.targetCell[0] != currentCell[0] || this.targetCell[1] != currentCell[1])) {
            let randomX = Math.round(Math.random() * (cellSize - 2*this.radius) + nextCell[0] * cellSize + this.radius);
            let randomY = Math.round(Math.random() * (cellSize - 2*this.radius) + nextCell[1] * cellSize + this.radius);
            this.closeTarget = [randomX, randomY];
        }
        else {
            this.closeTarget = this.target
        }
    }

    getPatrollCoord() {
        let cellSize = this.maze.cellSize;
        let cellFound = false;

        while (!cellFound) {
            let randomDist = Math.random() * 200 + 200;
            let randomDir = Math.random() * 2*Math.PI;
            let newX = Math.round(this.x + Math.cos(randomDir) * randomDist);
            let newY = Math.round(this.y + Math.sin(randomDir) * randomDist);
            //För att zombiesen ska stanna innaför labyrintens gränser
            newX = (newX + this.maze.width) % this.maze.width;
            newY = (newY + this.maze.height) % this.maze.height;

            this.targetCell = [Math.floor(newX / cellSize), Math.floor(newY / cellSize)];

            //Om målet inte är en vägg
            if (this.maze.maze[this.targetCell[1]][this.targetCell[0]] === 0) {
                if (Math.round(newX / cellSize) != Math.round((newX - this.radius)/cellSize)){
                    newX += this.radius;
                } else if (Math.round(newX / cellSize) != Math.round((newX + this.radius)/cellSize)) {
                    newX -= this.radius
                }
                if (Math.round(newY / cellSize) != Math.round((newY - this.radius)/cellSize)) {
                    newY += this.radius;
                } else if (Math.round(newY / cellSize) != Math.round((newY + this.radius)/cellSize)) {
                    newY -= this.radius;
                }
                return [newX, newY];
            }
        }
    }

    getChasingCoord(player) {
        let cellSize = this.maze.cellSize;
        this.targetCell = [Math.floor(player.x / cellSize), Math.floor(player.y / cellSize)];

        return [player.x, player.y];
    }


    
}