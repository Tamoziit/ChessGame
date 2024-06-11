/* eslint-disable @typescript-eslint/no-explicit-any */
import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game";

const ChessBoard = ({ chess, setBoard, board, socket }: {
    chess: any;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;

}) => {
    const [from, setFrom] = useState<null | Square>(null);

    return (
        <div className="text-white-200">
            {board.map((row, i) => {
                return <div key={i} className="flex">
                    {row.map((square, j) => {
                        const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square; //to represent chess squares as a standard repsentation of A9, B6, etc.

                        return <div onClick={() => {
                            if (!from) {
                                setFrom(squareRepresentation); //checking if square of type Square exists
                            } else {
                                socket.send(JSON.stringify({
                                    type: MOVE,
                                    payload: {
                                        move: {
                                            from,
                                            to: squareRepresentation
                                        }
                                    }
                                }));
                                //updating board states after every move
                                setFrom(null);
                                chess.move({
                                    from,
                                    to: squareRepresentation
                                });
                                setBoard(chess.board());
                            }
                        }} key={j} className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-green-200' : 'bg-green-700'}`}>
                            <div className="w-full flex justify-center h-full">
                                <div className="h-full flex justify-center flex-col">
                                    {square ? <img className="w-max" src={`/${square?.color === "b" ? square?.type : `${square?.type?.toUpperCase()} copy`}.svg`} /> : null}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}

export default ChessBoard