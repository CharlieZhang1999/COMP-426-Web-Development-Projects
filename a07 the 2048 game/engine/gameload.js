import Game from './game.js';
let model = null;
let controller = null;
let view = null;
$(document).ready (() => {
    model = new Game(4);
    view = new GameView(model);
    controller = new GameController(model, view);
    
    $('body').empty().append(view.div);
});