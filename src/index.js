import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={{ color: props.highlight ? 'red' : 'black' }}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                highlight={this.props.line != null && this.props.line.includes(i) ? true : false}
                onClick={ () => this.props.onClick(i) }
            />
        );
    }

    render() {
        const size = 3;
        let rows = [];
        for (let i = 0; i < size*size; i+=size) {
            let squares = [];
            for (let j = 0; j < size; j++) {
                squares.push(this.renderSquare(i + j));
            }
            let row = <div className="board-row">{squares}</div>;
            rows.push(row);
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            ascending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: i,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    reverseMoves() {
        this.setState({
            ascending: !this.state.ascending,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares).winner;
        console.log(winner);

        let moves = history.map((step, move) => {
            const player = move % 2 !== 0 ? 'X' : 'O';
            const location = formatLocation(step.location);
            let desc = move ?
                player + ': (' + location + ')':
                'Game start';
            return (
                <li key={move}>
                    <button style={{ fontWeight: this.state.stepNumber == move ? 'bold' : 'normal' }} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        if (!this.state.ascending) {
            moves = moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;

        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        line={calculateWinner(current.squares).line}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.reverseMoves()}>
                        {this.state.ascending? 'Descending' : 'Ascending'}
                    </button>
                    <ol reversed={ this.state.ascending ? false : true }>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner:squares[a], line:[a, b, c]};
        }
    }
    return { winner:null, line:null };
}

function formatLocation(i) {
    const locations = [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2],
    ];
    return locations[i];
}