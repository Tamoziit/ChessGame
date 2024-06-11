"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gamemanager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
//Request manager class
class Gamemanager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user != socket); //removing socket connection from the disconnected user
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) { //checking if a user is waiting to be connected in the ws
                    const game = new Game_1.Game(this.pendingUser, socket); //to start a game, we provide the pendingUser & active socket as args.
                    this.games.push(game); //pushing current game to global games array
                    this.pendingUser = null; //updating pending user after start of game
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
exports.Gamemanager = Gamemanager;
