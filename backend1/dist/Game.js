"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.moveCount = 0;
        //Intimating the active users of a game with their colours on start of a game
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        //few base case validations for turn sequence
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("early return 1");
            console.log(this.moveCount);
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("early return 2");
            console.log(this.moveCount);
            return;
        }
        try {
            this.board.move(move); //move handled by chess.js "move()" func.
        }
        catch (e) { //if move is invalid
            return;
        }
        //PLAYER 1 side
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        //PLAYER 2 side
        if (this.moveCount % 2 === 0) { //validation check for turn
            console.log(this.moveCount);
            console.log("if check 2");
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE, //updating or sending the move of player1 to player 2
                payload: move
            }));
        }
        else {
            console.log(this.moveCount);
            console.log("else check 2");
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE, //updating or sending the move of player2 to player 1
                payload: move
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
