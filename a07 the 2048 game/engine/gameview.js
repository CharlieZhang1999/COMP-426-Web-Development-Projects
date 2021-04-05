let GameView = class{
    constructor(model){
        this.model = model;
        this.div = $('<div></div>');
        this.listeners = [];
        this.gamecellArr = [];

        //field for instruction
        this.instructionfield = $('<div class=instructionfield></div>')
                                .html("Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!");

        //field for score
        this.scorefield = $('<div class=scorefield></div>')
                            .html(`Your Score: ${this.model.gameState.score}`);

        //field for reset button
        this.resetfield = $('<button class=resetfield></button>')
                            .html("reset")
                            .on('click', () => (this.model.setupNewGame()));

        this.winfield = $('<div></div>');
        this.overfield = $('<div></div>');
                        


        this.gamefield = $('<div class=gamefield></div>')
                            .css('position', 'relative')
                            .css('width', (100*this.model.length)+'px')
                            .css('height', (100*this.model.length)+'px');
        
        let keydownHandler = (e) => {
            let action = "";
            if(e.keyCode == "38"){
                //up arrow
                action = "moveUp";
            }
            else if(e.keyCode == "40"){
                //down arrow
                action = "moveDown";
            }
            else if(e.keyCode == "37"){
                //left arrow
                action = "moveLeft";
            }
            else if(e.keyCode == "39"){
                //right arrow
                action = "moveRight";
                
            }
            this.updateListeners({action: action});
        }

        
        for(let i = 0; i < this.model.length; i++){
            let gamecellRow = [];
            for(let j = 0; j < this.model.length; j++){
                let cellview = new CellView(i, j, this.model.GameField[i][j]);
                this.gamefield.append(cellview.div);
                gamecellRow.push(cellview);
            }
            this.gamecellArr.push(gamecellRow);
        }

        this.div.append(this.instructionfield);
        this.div.append($('<br>'));
        this.div.append(this.scorefield);
        this.div.append(this.resetfield);
        this.div.append(this.winfield);
        this.div.append(this.overfield);
        this.div.append(this.gamefield);
        $(document).keydown(keydownHandler);
        //model add view as Listeners so that it can inform view of any update through gameState objectffffffffffff
        model.onMove(this.loadGameBoard.bind(this));
    }


    loadGameBoard(){ 
        let gameState = this.model.getGameState();
        for(let i = 0; i < this.model.length; i++){
            for(let j = 0; j < this.model.length; j++){
                if(gameState.board[i * this.model.length + j] == 0){
                    this.gamecellArr[i][j].div.subdiv.empty();
                }
                else{
                    this.gamecellArr[i][j].div.subdiv.empty().html(gameState.board[i * this.model.length + j]);
                }
            }
        }
        this.scorefield.html(`Your Score: ${this.model.gameState.score}`);
        if(gameState.won){
            this.winfield.html("You win!!!");
        }
        if(gameState.over){
            this.overfield.html("Game is over.");
        }
    }

    addListeners(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx == -1) {
            this.listeners.push(listener);
        }
    }

    removeListeners(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx != -1) {
            this.listeners.splice(idx, 1);
        }
    }

    updateListeners(event) {
        this.listeners.forEach((l) => l(event));
    }


}

let CellView = class{
    constructor(row, col, data){
        this.div = $('<div></div>')
                    .addClass("cellview")
                    .css('left', (100*col) + 'px') 
                    .css('top', (100*row) + 'px');
        this.div.subdiv = $('<div></div>')
                            .addClass("center");
        
        if(data != 0){
            this.div.subdiv.html(data);
        }  
        this.div.append(this.div.subdiv)
    }
}

