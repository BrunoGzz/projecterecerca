// CREAR TAULELL TRES EN RATLLA
let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

// ESTABLIR SIGNE PER JUGADOR I ORDINADOR
const ai = "O";
const player = "X";
let gameOver = false;

function setStats(){
    if(localStorage.getItem("winNum") == null){
        localStorage.setItem("winNum", 0);
    }

    if(localStorage.getItem("loseNum") == null){
        localStorage.setItem("loseNum", 0);
    }

    if(localStorage.getItem("tieNum") == null){
        localStorage.setItem("tieNum", 0);
    }

    $("#winNum").html(localStorage.getItem("winNum"));
    $("#loseNum").html(localStorage.getItem("loseNum"));
    $("#tieNum").html(localStorage.getItem("tieNum"));
}

// COMPROVAR SI ALGÚ HA GUANYAT LA PARTIDA
function checkWinner() {
    // COMPROVAR FILES I COLUMNES
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return board[i][0];
        }
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            return board[0][i];
        }
    }
    
    // COMPROVAR DIAGONALS
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
    }
    
    // COMPROVAR SI HI HA EMPAT
    if (board.flat().every(cell => cell !== 0)) {
        return 'tie';
    }
    
    return false;
}

function addMove(row, column, sign) {
    if (gameOver) return;

    board[row - 1][column - 1] = sign;
    const dataPosition = String(row + "," + column);
    $(`.cell[data-position="${dataPosition}"]`).append(sign);

    const winner = checkWinner();

    if (winner) {
        gameOver = true;
        if(winner == "X"){
            localStorage.setItem("loseNum", Number(localStorage.getItem("loseNum"))+1);
            $("#gameResult").append("Has guanyat, felicitats!")
        }else if(winner == "O"){
            localStorage.setItem("winNum", Number(localStorage.getItem("winNum"))+1);
            $("#gameResult").append("Ha guanyat la intel·ligència artificial")
        }else{
            localStorage.setItem("tieNum", Number(localStorage.getItem("tieNum"))+1);
            $("#gameResult").append("Empat")
        }
        
        setStats();
    }
}

// DETECTAR QUAN ES POLSA UNA CASELLA
$(".cell").click(function() {
    // OBTENIR LA POSICIÓ DE LA CASELLA SENSE FORMAT
    const positionDirty = $(this).data("position");

    // APLICAR FORMAT PER PODER FER OPERACIONS
    const position = positionDirty.split(",");
    const row = Number(position[0]) - 1;
    const col = Number(position[1]) - 1;

    // COMPROVAR SI ESTÀ COMPLETA JA:
    if (board[row][col] !== 0) {
        return;
    }

    addMove(row + 1, col + 1, player);

    computer();
});

function computer() {
    let bestScore = -Infinity;
    let bestMove;
    // RECÓRRER TOTS ELS LLOCS DEL TAULELL
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            // ESTÀ LLIURE?
            if (board[r][c] === 0) {
                board[r][c] = ai;

                let score = minimax(board, 0, false);

                board[r][c] = 0;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = [r, c];
                }
            }
        }
    }
    addMove(bestMove[0] + 1, bestMove[1] + 1, ai);
}

// PUNTUACIÓ PER L'ALGORISME MINIMAX
const scores = {
    "O": 1,
    "X": -1,
    "tie": 0
}

function minimax(boardAI, isMaximizing) {
    const winner = checkWinner();
    if (winner) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                // ESTÀ LLIURE?
                if (boardAI[r][c] === 0) {
                    boardAI[r][c] = ai;
                    let score = minimax(boardAI, false);
                    boardAI[r][c] = 0;
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                // ESTÀ LLIURE?
                if (boardAI[r][c] === 0) {
                    boardAI[r][c] = player;
                    let score = minimax(boardAI, true);
                    boardAI[r][c] = 0;
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}


//RESTABLIR EL TAULELL DIGITAL I EL VISUAL
function resetBoard() {
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    $(".cell").empty();
    $("#gameResult").empty();
    gameOver = false;
}

//ESTABLIR ESTADÍSTIQUES AL INICI
setStats();