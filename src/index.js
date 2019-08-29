import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={ props.winner?"win_square":"square"} onClick={() => props.onClick()}>
            {props.value}
        </button>);
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square key={i} value={this.props.board[i]} onClick={() => this.props.onClick(i)} winner={this.props.winner.includes(i)} />;
    }

    renderRow(row) {
        const squares = row.map(square => this.renderSquare(square));
        const div = <div className="board-row">
            {squares}
        </div>

        return div;
    }

    render() {
        return (
            <div>
                {this.renderRow([0, 1, 2])}
                {this.renderRow([3, 4, 5])}
                {this.renderRow([6, 7, 8])}
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
        gameHistory.push({ board: prevBoard, mark: prevMark, lastMove: i,});
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
            const x = Math.ceil((history[i].lastMove + 1) / 3);
            let y = ((history[i].lastMove + 1) % 3);
            y = y ? y : 3;
            list.push(< li key={i} ><button onClick={() => this.jumpTo(i)}>{(history[i].mark + " on " + x + "," + y)}</button></li >);
        }

        return list;
    }

    render() {
        const winner = calculateWinner(this.state.current);
        let status;
        if (winner) {
            status = "The Winner is " + this.state.current[winner[0]];
        } else {
            status = "Next player: " + this.state.mark;
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board board={this.state.current}
                        mark={this.state.mark}
                        onClick={(i) => this.handleCheck(i)}
                        winner={winner?winner:[-1,-1,-1]}/>
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
            return [a, b, c];
        }
    }

    return null;
}