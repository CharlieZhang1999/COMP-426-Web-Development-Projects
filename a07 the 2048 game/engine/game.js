/*
Add your code for Game here
 */
let Game = class{
    constructor(length){
        this.length = length;
        this.GameField = [];

        this.moveListeners = [];
        this.loseListeners = [];
        this.winListeners = [];
        
        this.gameState = {
            board: [],
            score: 0,
            won: false,
            over: false
        }
        this.setupNewGame();
    }

    addTile(){
        let freespace = [];
        for(let i = 0; i < this.length; i++){
            for(let j = 0; j < this.length; j++){
                if(this.GameField[i][j] == 0){
                    freespace.push({x: i, y: j,});
                }
            }
        }
        let coor = freespace[Math.floor(Math.random()*freespace.length)];
        
        let n = Math.random();
        this.GameField[coor.x][coor.y] = n < 0.9? 2:4;
        this.gameState.board[coor.x * this.length + coor.y] = n < 0.9? 2:4;

    }

    setupNewGame(){

        let board = [];
        let GameField = [];
        for(let r = 0; r < this.length; r++){
            let GameRow = [];
            for(let c = 0; c < this.length; c++){
                let cell = 0;
                GameRow.push(cell);
                board.push(cell);
            }
            GameField.push(GameRow);
        }
        this.gameState.board = board;
        this.gameState.score = 0;
        this.gameState.won = false;
        this.gameState.over = false;
        this.GameField = GameField;
        this.state = Game.Event.move;
        this.addTile();
        this.addTile();
        for(let i = 0; i < this.moveListeners.length; i++){
            this.moveListeners[i](this.gameState);
        }
    }

    loadGame(gameState){
        for(let i = 0; i < this.length; i++){
            for(let j = 0; j < this.length; j++){
                this.GameField[i][j] = gameState.board[i*this.length + j];
            }
        }
        this.gameState = gameState;
    }

    move(direction){
        /* Originally I used slice to create a copy. But I learned that slice is a shallow copy, 
        which still holds reference to the original array*/
        
        let copiedArr = this.deepClone(this.GameField);

        if(direction.localeCompare("left") == 0){
            this.moveLeft();
            //this.addTile();
        } 
        else if(direction.localeCompare("right") == 0){
            this.moveRight(); 
            //this.addTile();
        }
        else if(direction.localeCompare("up") == 0){
            this.moveUp();
        }
        else if(direction.localeCompare("down") == 0){
            this.moveDown();
        }

        if(!this.compareSameShapeArr(copiedArr, this.GameField)){// when legal moves occur
            this.addTile();
        }

        let board = [];
        for(let i = 0; i < this.GameField.length; i++){
            for(let j = 0; j < this.GameField.length; j++){
                board.push(this.GameField[i][j]);
            }
        }
        this.gameState.board = board;
        this.testforWin();
        this.testforOver();

        for(let i = 0; i < this.moveListeners.length; i++){
            this.moveListeners[i](this.gameState);
        }


        /* case: win */
        if(this.gameState.won){
            this.winListeners.forEach((l) => l(this.gameState));
        }
        /* case: lose */
        else if((!this.gameState.won) && this.gameState.over){
            this.loseListeners.forEach((l) => l(this.gameState));
        }

    }

    moveLeft(){
        this.slideLeft();
        this.combineLeft();
        this.slideLeft();
    }

    moveRight(){
        this.slideRight();
        this.combineRight();
        this.slideRight();
    }

    moveUp(){
        this.slideUp();
        this.combineUp();
        this.slideUp();
    }

    moveDown(){
        this.slideDown();
        this.combineDown();
        this.slideDown();
    }

    slideLeft(){
        for(let i = 0; i < this.length; i++){
            let leftArr = this.GameField[i].filter(val => val != 0);
            let rightArr = Array(this.length - leftArr.length).fill(0);
            leftArr = leftArr.concat(rightArr);
            this.GameField[i] = leftArr;
        }
        //return leftArr;
    }

    slideRight(){
        for(let i = 0; i < this.length; i++){   
            let rightArr = this.GameField[i].filter(val => val != 0);
            let leftArr = Array(this.length - rightArr.length).fill(0);
            leftArr = leftArr.concat(rightArr);
            this.GameField[i] = leftArr;
        }
        //return GameField
    }

    slideUp(){
        for(let j = 0; j < this.length; j++){
            let col = this.GameField.map(arr => arr[j]);
            let upArr = col.filter(val => val != 0);
            let downArr = Array(this.length - upArr.length).fill(0);
            upArr = upArr.concat(downArr);
            for(let i = 0; i < this.length; i++){
                this.GameField[i][j] = upArr[i];
            }
        }
    }

    slideDown(){
        for(let j = 0; j < this.length; j++){
            let col = this.GameField.map(arr => arr[j]);
            let downArr = col.filter(val => val != 0);
            let upArr = Array(this.length - downArr.length).fill(0);
            upArr = upArr.concat(downArr);
            for(let i = 0; i < this.length; i++){
                this.GameField[i][j] = upArr[i];
            }
        }
    }

    combineLeft(){
        for(let i = 0; i < this.length; i++){ // go through every row
            for(let j = 0; j < this.length-1; j++){
                if(this.GameField[i][j] == this.GameField[i][j+1]){
                    this.GameField[i][j] = this.GameField[i][j] * 2;
                    this.gameState.score +=  this.GameField[i][j];
                    this.GameField[i][j+1] = 0;// wait to be slided
                    
                }
            }
        }
        //return this.GameField;
    }

    combineRight(){
        for(let i = 0; i < this.length; i++){ // go through every row
            for(let j = this.length - 1; j > 0; j--){
                if(this.GameField[i][j] == this.GameField[i][j-1]){
                    this.GameField[i][j] = this.GameField[i][j-1] * 2;
                    this.gameState.score += this.GameField[i][j];
                    this.GameField[i][j-1] = 0;// wait to be slided
                }
            }
        }
        
    }
    combineUp(){
        for(let i = 0; i < this.length-1; i++){ // go through every row
            for(let j = 0; j < this.length; j++){
                if(this.GameField[i][j] == this.GameField[i+1][j]){
                    this.GameField[i][j] = this.GameField[i][j] * 2;
                    this.gameState.score += this.GameField[i][j];
                    this.GameField[i+1][j]= 0;// wait to be slided
                }
            }
        }
    }

    combineDown(){
        for(let i = this.length-1; i >0; i--){ // go through every row
            for(let j = 0; j < this.length; j++){
                if(this.GameField[i][j] == this.GameField[i-1][j]){
                    this.GameField[i][j] = this.GameField[i][j] * 2;
                    this.gameState.score += this.GameField[i][j];
                    this.GameField[i-1][j]= 0;// wait to be slided
                }
            }
        }
    }

    compareSameShapeArr(a, b){
        for(let i = 0; i < a.length; i++){
            for(let j = 0; j < a.length; j++){
                if(a[i][j] != b[i][j]){
                    return false;
                }
            }
        }
        return true;
    }
    
    deepClone(a){
        let res = [];
        for(let i = 0; i < a.length; i++){
            let row = [].concat(a[i]);
            res.push(row);
        }
        return res;
    }

    onMove(callback){
        // same as addListeners
        this.moveListeners.push(callback);
    }
    onLose(callback){
        this.loseListeners.push(callback);
    }
    onWin(callback){
        this.winListeners.push(callback);
    }

    testforWin(){
        if(this.state == Game.Event.win && this.gameState.won) return true;

        for(let i = 0; i < this.length; i++){
            if(this.GameField[i].indexOf(2048) != -1){
                this.state = Game.Event.win;
                this.gameState.won = true;
                this.gameState.over = true;
            }
        }
        return false;
    }
    testforOver(){
        if(this.gameState.over && this.state != Game.Event.move) return true;
        for(let i = 0; i < this.GameField.length; i++){
            for(let j = 0; j < this.GameField.length; j++){
                if(this.GameField[i][j] == 0){return false};
                if(i != this.GameField.length - 1 && this.GameField[i][j] == this.GameField[i+1][j]){
                    return false;
                }
                if(j != this.GameField.length - 1 && this.GameField[i][j] == this.GameField[i][j+1]){
                    return false;
                }
            }
        }
        this.gameState.over = true;
        this.state = Game.Event.lose;
        return true;
        

    }
    getGameState(){
        return this.gameState;
    }

    toString(){
        let s = "";
        for(let i = 0; i < this.GameField.length; i++){
            for(let j = 0; j < this.GameField.length; j++){
                s += `[${this.GameField[i][j] == 0? " ": this.GameField[i][j]}] `;
            }
            s += "\n";
        }
        return s;
    }

}

Game.Event = {
    move: 0,
    lose: 1,
    win: 2,
}

export default Game;



