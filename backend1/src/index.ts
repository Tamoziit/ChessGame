import { WebSocketServer } from "ws";
import { Gamemanager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new Gamemanager();

wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on("disconnect", () => gameManager.removeUser(ws));
});