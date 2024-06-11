import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

//Request manager class
export class Gamemanager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user != socket); //removing socket connection from the disconnected user
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendingUser) { //checking if a user is waiting to be connected in the ws
                    const game = new Game(this.pendingUser, socket); //to start a game, we provide the pendingUser & active socket as args.
                    this.games.push(game); //pushing current game to global games array
                    this.pendingUser = null; //updating pending user after start of game
                }
                else {
                    this.pendingUser = socket;
                }
            }

            if(message.type === MOVE) {
                const  game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload.move);
                }
            }
        })
    }
} 