let mazes = [
[
    [1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1],
    [0,0,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,0,0],
    [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,0,1,1,1,1,0,1,1,0,1,1,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [0,0,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1,0,0],
    [1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1]
],
[
    [1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [0,0,1,1,1,0,1,1,0,0,0,0,1,1,0,1,1,1,0,0],
    [1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1],
    [1,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,0,1],
    [1,1,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
    [0,0,1,1,0,1,0,0,1,1,1,1,0,0,1,0,1,1,0,0],
    [1,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1]
],
[
    [1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [0,0,1,1,1,1,0,1,0,0,0,0,1,0,1,1,1,1,0,0],
    [1,0,0,0,1,1,0,1,1,1,1,1,1,0,1,1,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,0,0,0,0,1,1,1,1,0,1,0,1],
    [0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0],
    [1,0,1,0,0,0,0,1,0,1,1,0,1,0,0,0,0,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1]
],
[
    [1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1],
    [1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1],
    [0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,0,0,0,0,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [0,0,1,0,1,0,0,0,1,1,1,1,0,0,0,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1]
]
];

const Feature = {
    Floor: 0,
    Wall: 1,
    Coin: 2,
    InfestedCoin: 3
}

let startCoinAmount = 4;
let infestedCoinChance = 20;

export class Maze {

    constructor (width, height, ctx, player, colors) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.player = player;
        this.colors = colors;
        this.cellSize = height/10;
        this.rows = 10;
        this.cols = 20;
        this.coinAmount = startCoinAmount;
        this.coinRadius = Math.max(2,Math.round(this.cellSize/8));
        this.coinPositions = [];
        this.maze = this.createMaze();
    }

    drawMaze() {
        this.ctx.fillStyle = this.colors.floor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.drawFeatures(0, 0);
    }

    createMaze() {
        let randomIdx = Math.floor(Math.random() * mazes.length);
        let maze = mazes[randomIdx];

        maze = this.removeCoins(maze);
        maze = this.addCoins(maze, startCoinAmount);

        return maze;
    }
    
    drawFeature(x, y) {
        let cord = [x*this.cellSize, y*this.cellSize];
    
        if (this.maze[y][x] == Feature.Wall) {
            this.ctx.fillStyle = this.colors.wall;
            this.ctx.fillRect(cord[0], cord[1], this.cellSize, this.cellSize);
        }
        else if(this.maze[y][x] == Feature.Coin) {
            this.ctx.fillStyle = this.colors.coin;
            this.ctx.beginPath();
            this.ctx.arc(cord[0] + this.cellSize/2, cord[1] + this.cellSize/2, this.coinRadius, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
        }
        else if (this.maze[y][x] == Feature.InfestedCoin) {
            this.ctx.fillStyle = this.colors.coin;
            this.ctx.beginPath();
            this.ctx.arc(cord[0] + this.cellSize/2, cord[1] + this.cellSize/2, this.coinRadius, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.fillStyle = this.colors.zombie;
            this.ctx.beginPath();
            this.ctx.arc(cord[0] + this.cellSize/2, cord[1] + this.cellSize/2, this.coinRadius/2, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
        }
      }
    
    //Använder recursion
    drawFeatures(x, y) {
        if (x < this.width/this.cellSize) {
            this.drawFeature(x, y);
            this.drawFeatures(x + 1, y);
        }
        else if (y < this.height/this.cellSize - 1) {
            this.drawFeatures(0, y + 1);
        }
        else {
            return;
        }
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.cellSize = height/10;
        this.coinRadius = Math.max(2,Math.round(this.cellSize/8));
    }

    addCoins(maze, amount) {
        let cellsFound = false;
        let iteration = 0;

        let playerCellX = Math.floor(this.player.x/this.cellSize);
        let playerCellY = Math.floor(this.player.y/this.cellSize);

        while (!cellsFound && amount > 0 && iteration < 1000) {
            let x = Math.floor(Math.random() * maze[0].length)
            let y = Math.floor(Math.random() * maze.length)

            if (maze[y][x] == Feature.Floor) {
                let canPlace = true;

                //Kontrollerar om ett mynt är för nära ett annat mynt
                for (let i = 0; i < this.coinPositions.length; i++) {
                    let coinX = this.coinPositions[i][0];
                    let coinY = this.coinPositions[i][1];
                
                    if (Math.abs(x - coinX) <= 3 && Math.abs(y - coinY) <= 3 && iteration < 800) {
                        canPlace = false;
                        break;
                    }
                
                }

                //Kontrollerar om ett mynt är för nära spelaren
                if (Math.abs(x - playerCellX) <= 3 && Math.abs(y - playerCellY) <= 3 && iteration < 800) {
                    canPlace = false;
                }
                
                if (canPlace) {
                    let r = Math.round(Math.random()*100);
                    if (r <= infestedCoinChance) {
                        maze[y][x] = Feature.InfestedCoin;
                    } else {
                        maze[y][x] = Feature.Coin;
                    }
                    this.coinPositions.push([x, y]);
                    amount--; 
                }
            }
            iteration++; //Undvika oändlig loop
            if (iteration == 999) {
                console.log("för många försök i addCoins");
            }
        }
        return maze;
    }
    updateCoins(x,y,amount) {
        this.removeCoin(x,y);
        this.addCoins(this.maze, amount);
    }
    removeCoin(x,y) {
        if (this.maze[y][x] == Feature.Coin || this.maze[y][x] == Feature.InfestedCoin) {
            this.maze[y][x] = Feature.Floor;
            this.coinPositions = this.coinPositions.filter(coin => coin[0] !== x || coin[1] !== y);
        }
    }

    removeCoins(maze) {
        for (let i = 0; i < maze[0].length; i++) {
            for (let j = 0; j < maze.length; j++) {
                if (maze[j][i] == Feature.Coin || maze[j][i] == Feature.InfestedCoin) {
                    maze[j][i] = Feature.Floor;
                }
            }
        }
        return maze;
    }
}