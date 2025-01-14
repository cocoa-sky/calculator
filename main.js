'use strict';

{
    //◆この電卓の注意点
    //999999999999より大きいか、0より小さい数の答えは表示されない（エラーになる）。
    //割り算の答えは、小数点以下2桁まで。たとえば、1.002の場合の表記は1になる。

    let resultNum = undefined; // 上に表示する数字（数字未入力状態ならundefined）
    const numAll = []; // 計算する数字を入れておく配列
    const signAll = []; // 押された符号（+,-,/,* → 1,2,3,4）を入れておく配列
    let sign = 0; // 連続で符号（+-*/）ボタンを押すのを防止して、最後に押した符号を変更するための変数
    let previousEqual = 0; // ひとつ前に「=」ボタンを押したことを伝えるための変数
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
            document.querySelector('#result').textContent = num;
        }
    };

    // リセット（初期化）
    const reset = () => {
        resultNum = undefined;
        previousEqual = 0;
        sign = 0;
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
            
            const signAllLast = signAll.length - 1; // 最後に押した符号のインデックス
            if (i === 0 && signAll[signAllLast] === 4) {
                err = 1; // 0で割った場合エラーを出す
            } else if (resultNum >= 1) { 
                // 前に1以上の数字が押されていたら
                resultNum = resultNum*10 + i;
            } else if (resultNum === 0) {
                resultNum = i;
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

    // Cボタンを押した時
    document.querySelector('#c').addEventListener('click', () => {
        // エラー表示か、上の数字が小数か、数字未入力状態なら
        if (err === 1 || resultNum - Math.trunc(resultNum) !== 0 || resultNum === undefined) {
            reset();
            return; // リセットして以降の処理をしない
        }

        previousEqual = 0; // ひとつ前が「=」でも計算を続けるので0に戻す
        sign = 0; // 符号を連続で押してないので0に戻す
        // 上の数字が0か1桁なら
        if (resultNum === 0 || resultNum.toString().length === 1) {
            resultNum = 0;
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