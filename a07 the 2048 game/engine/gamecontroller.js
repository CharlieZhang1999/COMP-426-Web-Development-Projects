let GameController = class{
    constructor(model, view){
        this.model = model;
        this.view = view;
        
        view.addListeners((e) =>{
            if(e.action == "moveUp"){
                model.move('up');
                
            }
            else if(e.action == "moveDown"){
                model.move('down');
                

            }
            else if(e.action == "moveLeft"){
                model.move('left');
            }
            else if(e.action == "moveRight"){
                model.move('right');
            }
        });
    }
}