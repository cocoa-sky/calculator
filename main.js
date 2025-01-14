'use strict';

{
    //◆この電卓の注意点
    //12桁（小数の場合は9桁）より大きいか、0より小さい数の答えは表示されない（エラーになる）。
    //割り算の答えは、小数点以下2桁まで。たとえば、1.002の場合の表記は1になる。

    let resultNum = undefined; // 上に表示する数字（数字未入力状態ならundefined）
    const numAll = []; // 計算する数字を入れておく配列
    const signAll = []; // 押された符号（+,-,/,* → 1,2,3,4）を入れておく配列
    let sign = 0; // 連続で符号（+-*/）ボタンを押すのを防止して、最後に押した符号を変更するための変数
    let previousEqual = 0; // ひとつ前に「=」ボタンを押したことを伝えるための変数
    let decimal = 0; // 次に押す数字ボタンが小数点以下なら1
    let decimalPoint0 = 0; // 「.0」を表示するための変数
    let err = 0; // エラーを表示する場合は1

    // 電卓の上の数字を表示
    const drawResult = (resultNum) => {
        if (resultNum < 0 || resultNum >= 1000000000000) {
            err = 1; // 計算結果が限界値（1兆、13桁）を超えるか、マイナスならエラー
        }

        if (err === 1) {
            document.querySelector('#result').textContent = 'ERROR'; // エラーと表示
        } else if (resultNum === undefined) {
            document.querySelector('#result').textContent = 0; // 数字未入力状態なら0と表示
        } else {
            const num = new Intl.NumberFormat().format(resultNum); // 数字3桁ごとに「,」を表示
            if (decimalPoint0 === 1) {
                document.querySelector('#result').textContent = num + '.0'; // 数字の末尾に「.0」を表示
            } else {
                document.querySelector('#result').textContent = num;
            }
        }
    };

    // リセット（初期化）
    const reset = () => {
        resultNum = undefined;
        previousEqual = 0;
        sign = 0;
        decimal = 0; // 小数点以下の数字入力終了
        decimalPoint0 = 0; // 「.0」の入力無効
        numAll.length = 0; // 数字の配列を空にする
        signAll.length = 0; // 符号の配列を空にする
        err = 0; // エラーの表記を消す
        drawResult(resultNum); // 電卓の上の数字も初期化
    };

    reset(); // リセット

    // 数字ボタンを押した時
    for (let i = 0; i <= 9; i++) {
        document.querySelector('#num' + i).addEventListener('click', () => {
            // 数字未入力状態なら
            if (resultNum === undefined) {
                resultNum = 0;
            }

            // 数字が12桁を超えているか、エラー表示なら
            if (resultNum.toString().length >= 12 || err === 1) {
                return; // 早期リターン（何もしない）
            }

            sign = 0; // 符号を連続で押してないので0に戻す

            // ひとつ前に「=」ボタンを押していたら
            if (previousEqual === 1) {
                resultNum = 0; // #上の数字を0にする（新たな計算をスタート）
                previousEqual = 0; // 確認済みなので0に戻す
            }

            // 小数なら（小数点以下は2桁までしか表示しない）
            if (decimal === 1) {
                if (i >= 1 && i <= 9) {
                    if (decimalPoint0 === 1 || resultNum.toString().length - Math.trunc(resultNum).toString().length === 2) {
                        // 「.0」か、小数点以下1桁まで表示されているなら
                        resultNum += 0.01*i;
                        resultNum = parseFloat(resultNum.toFixed(2)); // 小数点以下2桁まで表示
                        decimalPoint0 = 0; // 小数点以下2桁まで入力したので0に戻す
                    } else if (resultNum - Math.trunc(resultNum) === 0) {
                        // 整数なら（Math.truncは小数点以下切り捨て）
                        resultNum += 0.1*i;
                        resultNum = parseFloat(resultNum.toFixed(1)); // 小数点以下1桁まで表示
                    }
                } else if (i === 0 && resultNum - Math.trunc(resultNum) === 0) {
                    // 整数で、「.」と「0」が押されたら
                    decimalPoint0 = 1;
                }
            } else {
                //整数なら
                const signAllLast = signAll.length - 1; // 最後に押した符号のインデックス
                if (i === 0 && signAll[signAllLast] === 4) {
                    err = 1; // 0で割った場合エラーを出す
                } else if (resultNum >= 1) { 
                    // 前に1以上の数字が押されていたら
                    resultNum = resultNum*10 + i;
                } else if (resultNum === 0) {
                    resultNum = i;
                }
            }

            drawResult(resultNum);
        });
    }

    // 足し算、引き算、掛け算、割り算の符号ボタンを押した時
    for (let i = 1; i <= 4; i++) {
        document.querySelector('#sign' + i).addEventListener('click', () => {
            // エラー表示か、数字未入力状態なら
            if (err === 1 || resultNum === undefined) {
                return; // 早期リターン（何もしない）
            }

            previousEqual = 0; // ひとつ前が「=」でも計算を続けるので0に戻す
            decimal = 0; // 小数点以下の数字入力終了
            decimalPoint0 = 0; // 「.0」の入力無効
            if (sign === 1) {
                // ひとつ前に符号ボタンを押していたら、それを新しい符号ボタンで上書きする
                let m1 = signAll.length - 1;
                signAll[m1] = i; 
            } else {
                numAll.push(resultNum);
                signAll.push(i);
                resultNum = 0;
                drawResult(resultNum);
            }
            sign = 1 // 連続で符号（+-*/）ボタンを押すのを防止して、最後に押した符号を変更するための変数
        });
    }

    // 「=」ボタンを押した時
    document.querySelector('#equal').addEventListener('click', () => {
        sign = 0; // 符号を連続で押してないので0に戻す
        decimal = 0; // 小数点以下の数字入力終了
        decimalPoint0 = 0; // 「.0」の入力無効
        // 符号ボタンを押していないか、エラー表示か、ひとつ前に「=」ボタンを押しているか、数字未入力状態なら
        if (signAll.length <= 0 || err === 1  || previousEqual === 1 || resultNum === undefined) {
            return; // 早期リターン（何もしない）
        }

        numAll.push(resultNum); // 上に表示された数字を、数字の配列の末尾に追加
        let temp = numAll[0]; // 数字の配列の1つ目の数字を仮の変数に代入

        for (let i = 0; i < signAll.length; i++) {
            let i1 = i + 1;
            if (signAll[i] === 1) {
                temp += numAll[i1];
            } else if (signAll[i] === 2) {
                temp -= numAll[i1];
            } else if (signAll[i] === 3) {
                temp *= numAll[i1];
            } else if (signAll[i] === 4) {
                temp /= numAll[i1];
                temp = parseFloat(temp.toFixed(2)); // 小数点以下2桁まで表示
            }
        }

        resultNum = temp;
        drawResult(resultNum);

        numAll.length = 0; // 数字の配列を空にする
        signAll.length = 0; // 符号の配列を空にする
        previousEqual = 1; // ひとつ前に=ボタンを押したことを伝えるための変数
    });

    // 「.」小数点ボタンを押した時
    document.querySelector('#point').addEventListener('click', () => {
        // 上の数字が10桁以上か、整数でないなら
        if (resultNum.toString().length >= 10 || resultNum - Math.trunc(resultNum) !== 0) {
            return; // 何もしない
        }
        sign = 0; // 符号を連続で押してないので0に戻す
        decimal = 1; // 次に押す数字ボタンは小数点以下
    });

    // Cボタンを押した時
    document.querySelector('#c').addEventListener('click', () => {
        // エラー表示か、「.0」か、数字未入力状態なら
        if (err === 1 || resultNum === undefined) {
            reset();
            return; // リセットして以降の処理をしない
        }

        previousEqual = 0; // ひとつ前が「=」でも計算を続けるので0に戻す
        sign = 0; // 符号を連続で押してないので0に戻す
        // 上の数字が0か1桁なら
        if (resultNum === 0 || resultNum.toString().length === 1) {
            resultNum = 0;
        } else if (decimalPoint0 === 1) {
            // 「.0」と表示されていたら、表示を消す
            decimalPoint0 === 0;
        } else if (resultNum.toString().length - Math.trunc(resultNum).toString().length === 2) {
            // 小数点以下1桁まで表示されているなら
            resultNum = parseInt(resultNum); // 整数にする
            decimal = 0; // 小数点以下の数字入力終了
        } else if (resultNum.toString().length - Math.trunc(resultNum).toString().length === 3) {
            // 小数点以下2桁まで表示されているなら
            resultNum = parseFloat(resultNum.toFixed(1)); // 小数点以下1桁まで表示
        } else {
            //resultNum.toString().substring(resultNum.toString().length - 1)は、resultNumの1の位の数字
            resultNum = (resultNum - parseInt(resultNum.toString().substring(resultNum.toString().length - 1))) / 10;
        }
        drawResult(resultNum);
    });

    // ACボタンを押した時（リセット）
    document.querySelector('#ac').addEventListener('click', () => {
        reset();
    });

}