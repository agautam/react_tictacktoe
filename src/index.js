import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//class Square extends React.Component {
//    render() {
//        const x = this.props.value;
//        return (
//            <button className="square" onClick={()=>this.props.onClick()}>
//        {x}
//      </button>
//    );
//  }
//}

function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick()}>
            {props.value}
        </button>);
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square value={this.props.board[i]} onClick={() => this.props.onClick(i)} />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            current: Array(9).fill(null),
            mark: 'X',
        };
    }

    handleCheck(i) {
        if (calculateWinner(this.state.current) || this.state.current[i]) {
            return;
        }

        const current = this.state.current.slice();
        const prevBoard = this.state.current;
        const prevMark = this.state.mark
        current[i] = prevMark;
        const mark = prevMark === 'X' ? 'O' : 'X';
        let gameHistory = this.state.history.slice();
        gameHistory.push({ board: prevBoard, mark: prevMark, });
        this.setState({
            history:  gameHistory, current: current, mark: mark,
        });
    }

    jumpTo(move) {
        const gameHistory = this.state.history.slice(0, move);
        const current = this.state.history[move].board;
        const mark = this.state.history[move].mark;
        this.setState({
            history: gameHistory, current: current, mark: mark,
        });
    }

    renderItems() {
        const history = this.state.history;
        let list = [];
        for (let i = 0; i < history.length; i++) {
            list.push(< li ><button onClick={() => this.jumpTo(i)}>{(history[i].board + " :: "+ history[i].mark + " :: "  + i)}</button></li >);
        }

        return list;
    }

    render() {
        const winner = calculateWinner(this.state.current);
        let status;
        if (winner) {
            status = "The Winner is " + winner;
        } else {
            status = "Next player: " + this.state.mark;
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board board={this.state.current}
                        mark={this.state.mark}
                        onClick={(i) => this.handleCheck(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{this.renderItems()
                    }</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const sets = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let [a,b,c] of sets) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}