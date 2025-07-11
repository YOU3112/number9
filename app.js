document.addEventListener('DOMContentLoaded', () => {
    const puzzleBoard = document.getElementById('puzzle-board');
    const messageDisplay = document.getElementById('message');
    const resetButton = document.getElementById('reset-button');

    const boardSize = 3; // 3x3パズル
    const totalTiles = boardSize * boardSize; // 9タイル
    let board = []; // パズルの現在の状態を保持する配列

    // ゲームの初期化
    function initGame() {
        // 1から8までの数字と空のタイル（0）を生成
        board = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
        board.push(0); // 空のタイルを最後に追加

        shuffleBoard(); // ボードをシャッフル
        renderBoard(); // ボードを描画
        messageDisplay.textContent = ''; // メッセージをクリア
    }

    // ボードをシャッフルする関数
    // ソルバブル（解ける）な状態になるようにシャッフルする
    function shuffleBoard() {
        let shuffled = [...board];
        let inversions; // 転倒数
        let emptyRow; // 空のタイルの行 (下から数える)

        do {
            // Fisher-Yatesシャッフル
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            // 転倒数を計算
            inversions = 0;
            for (let i = 0; i < shuffled.length; i++) {
                for (let j = i + 1; j < shuffled.length; j++) {
                    if (shuffled[i] !== 0 && shuffled[j] !== 0 && shuffled[i] > shuffled[j]) {
                        inversions++;
                    }
                }
            }

            // 空のタイルの行を見つける (0-indexed)
            const emptyIndex = shuffled.indexOf(0);
            emptyRow = boardSize - Math.floor(emptyIndex / boardSize); // 下から数える

            // 3x3パズルのソルバビリティチェック:
            // 転倒数が偶数であれば、解ける
            // (空のタイルの位置は3x3の場合、ソルバビリティに影響しない)
        } while (inversions % 2 !== 0); // 転倒数が奇数の場合は再シャッフル

        board = shuffled;
    }

    // ボードを描画する関数
    function renderBoard() {
        puzzleBoard.innerHTML = ''; // ボードをクリア
        board.forEach((value, index) => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (value === 0) {
                tile.classList.add('empty');
                tile.textContent = ''; // 空のタイルには数字を表示しない
            } else {
                tile.textContent = value;
            }
            tile.dataset.index = index; // タイルの現在のインデックスをデータ属性として保存
            tile.addEventListener('click', () => handleClick(index));
            puzzleBoard.appendChild(tile);
        });
    }

    // タイルがクリックされたときの処理
    function handleClick(clickedIndex) {
        const emptyIndex = board.indexOf(0); // 空のタイルのインデックス
        
        // クリックされたタイルが空のタイルの隣にあるかチェック
        const canMove = (
            (Math.abs(clickedIndex - emptyIndex) === 1 && Math.floor(clickedIndex / boardSize) === Math.floor(emptyIndex / boardSize)) || // 同じ行で隣接
            (Math.abs(clickedIndex - emptyIndex) === boardSize) // 同じ列で隣接
        );

        if (canMove) {
            // タイルを交換
            [board[clickedIndex], board[emptyIndex]] = [board[emptyIndex], board[clickedIndex]];
            renderBoard(); // ボードを再描画

            if (checkWin()) {
                messageDisplay.textContent = 'おめでとうございます！パズルを解きました！';
                messageDisplay.style.color = '#27ae60'; // 勝利メッセージの色
                puzzleBoard.querySelectorAll('.tile').forEach(tile => tile.style.cursor = 'default'); // タイルを非活性化
            }
        }
    }

    // 勝利条件をチェックする関数
    function checkWin() {
        // 正しい順序 (1, 2, 3, 4, 5, 6, 7, 8, 0)
        for (let i = 0; i < totalTiles - 1; i++) {
            if (board[i] !== i + 1) {
                return false;
            }
        }
        return board[totalTiles - 1] === 0; // 最後のタイルが空であることを確認
    }

    // リセットボタンのイベントリスナー
    resetButton.addEventListener('click', initGame);

    // アプリ起動時にゲームを初期化
    initGame();
});
