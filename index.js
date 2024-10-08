const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUE = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

let balance = 0;

const deposit = () => {
    const depositAmount = document.getElementById("depositAmount").value;
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
        alert("Invalid deposit amount. Please enter a positive number.");
    } else {
        balance = numberDepositAmount;
        document.getElementById("balance").innerText = "Balance: $" + balance;
        document.getElementById("balanceDisplay").classList.replace("hidden", "visible");
        document.getElementById("betSection").classList.replace("hidden", "visible");
    }
};

const placeBet = () => {
    const lines = document.getElementById("numberOfLines").value;
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
        alert("Invalid number of lines, please try again.");
        return;
    }

    const bet = document.getElementById("betAmount").value;
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / numberOfLines) {
        alert("Invalid bet, please try again.");
        return;
    }

    balance -= numberBet * numberOfLines;
    document.getElementById("balance").innerText = "Balance: $" + balance;
    document.getElementById("spinSection").classList.replace("hidden", "visible");
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; COLS > i; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; ROWS > j; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    const rows = transpose(reels);
    document.getElementById("rows").innerText = "";
    printRows(rows);

    const numberOfLines = parseFloat(document.getElementById("numberOfLines").value);
    const bet = parseFloat(document.getElementById("betAmount").value);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    document.getElementById("balance").innerText = "Balance: $" + balance;
    document.getElementById("winnings").innerText = "You won: $" + winnings;

    document.getElementById("results").classList.replace("hidden", "visible");
    document.getElementById("spinSection").classList.replace("visible", "hidden");

    if (balance <= 0) {
        alert("You're out of money. Game over!");
    } else {
        document.getElementById("playAgainSection").classList.replace("hidden", "visible");
    }
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; ROWS > i; i++) {
        rows.push([]);
        for (let j = 0; COLS > j; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    const rowsDiv = document.getElementById("rows");
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        const p = document.createElement("p");
        p.innerText = rowString;
        rowsDiv.appendChild(p);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; lines > row; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUE[symbols[0]];
        }
    }

    return winnings;
};

const playAgain = () => {
    document.getElementById("results").classList.replace("visible", "hidden");
    document.getElementById("playAgainSection").classList.replace("visible", "hidden");
    document.getElementById("betSection").classList.replace("hidden", "visible");
};

const playMusic = () => {
    document.getElementById("background-music").play();
};

const stopMusic = () => {
    document.getElementById("background-music").pause();
    document.getElementById("background-music").currentTime = 0; // Reset to start
};
