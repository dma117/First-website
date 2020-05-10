// task 4.1 

function checkDataReturnPow() {  
    var data = document.getElementById('inputLen').value;

    if (data <= 0) {
        alert("Сторона квадрата задана некорректно.");
        document.getElementById('outputRecSquare').value = "";
    } else {
        document.getElementById('outputRecSquare').value = countRectangleSquare(data);
    }
}

function countRectangleSquare(a) {
    return a * a;
}

// task 4.2

function checkDataReturnFib() {
    var data = document.getElementById('inputNumber').value;

    if (data <= 0) {
        alert("Число Фибоначчи задано некорректно.");
        document.getElementById('outputFib').value = "";
    } else if (data[0] == 0 && data.lenth > 1) {
        alert("Число Фибоначчи задано некорректно.");
        document.getElementById('outputFib').value = "";
    } else if (data > 1000) {
        document.getElementById('inputNumber').value = "1000";
        document.getElementById('outputFib').value = getFibNumber(1000);
    } else {
        document.getElementById('outputFib').value = getFibNumber(data);
    }
}

function getFibNumber(N) {
    let f1 = 1,
        f2 = 1;
            
    for (let i = 2; i < N; i++) {
        let tmp = f1 + f2;
        f1 = f2;
        f2 = tmp;
    }

    return f2;
}

// task 4.3

function getMatrix() {
    var size = document.getElementById('number').value;

    if (size <= 0) {
        alert("Размер задан некорректно.");
        document.getElementById('matrix').innerHTML = "";
        return;
    }
    if (size > 10) {
        alert("Ошибка!");
        return
    }
    var matrix = '';
    for (i = 0; i < size; i++){
        for (j = 0; j < size; j++) {
            matrix += '<input type="number" class="inputValue" value="1">';
        }
        matrix += '<br>';
    }
    matrix += '<button type="button" onclick=checkDataReturnAnswer() style="margin-top: 20px; margin-bottom: 20px;">' + "Определить" + '</button>';
    matrix += '<input type="text" style="margin-left:10px;" id="outputAnswer">';
    
    document.getElementById('matrix').innerHTML = matrix;
}

function checkDataReturnAnswer() {
    var size = document.getElementById('number').value;
    var array = document.getElementsByClassName("inputValue");
    var matrix = [];
    var index = 0;

    for (i = 0; i < size; i++) {
        matrix.push([]);
    }

    var sum = 0,
        tmpSum = 0;

    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            matrix[i][j] = array[index++].value;
            if (i == j) { //главная диагональ
                sum += +matrix[i][j]; 
            }
            if (i + j == (size - 1)) { //побочная диагональ
                tmpSum += +matrix[i][j]; 
            }
        }
    }
    if (sum == tmpSum) {
        tmpSum = 0;
        var newSum = 0;
        for (i = 0; i < size; i++) {
            for (j = 0; j < size; j++) {
                tmpSum += +matrix[i][j]; //строки
                newSum += +matrix[j][i]; //столбцы
            }
            if ((sum != tmpSum) || (sum != newSum)) {
                document.getElementById('outputAnswer').value = "No";
                return;
            }
            tmpSum = 0;
            newSum = 0;
        }
        document.getElementById('outputAnswer').value = "Yes";
    }
    else {
        document.getElementById('outputAnswer').value = "No";
    }
}

// task 4.4

function checkDataReturnArray() {
    var sizeArray = document.getElementById('sizeArray').value;

    if (sizeArray <= 0) {
        alert("Размерность матрицы задана некорректно.");
    } else {
        var sortedArray = getArray(sizeArray);
        var matrix = [];
        var index = 0;

        for (let i = 0; i < sizeArray; i++) {
            matrix.push([]);
        }

        for (let i = 0; i < sizeArray; i++) {
            if (i % 2 == 0){
                for (j = 0; j < sizeArray; j++){
                    matrix[j][i] = sortedArray[index++];
                }
            } else {
                for (j = sizeArray - 1; j >= 0; j--){
                    matrix[j][i] = sortedArray[index++];
                }
            }
        }

        var table = '<table cellpadding="2">';
        for (i = 0; i < sizeArray; i++){
            table = table + '<tr>';
                for (j = 0; j < sizeArray; j++){
                    table = table + '<td>' + " " + matrix[i][j] + " " + '</td>'; 
              }
              table = table + '</tr>';
        }
        table = table + '</table>';
        
        document.getElementById('table').innerHTML = table;
    }

}

function getRandomInt(min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min));
}

function getArray(n) {
    var minValue = Number(document.getElementById('min').value);
    var maxValue = Number(document.getElementById('max').value);

    if (maxValue < minValue) {
        alert("Минимальное число не должно превышать максимальное.");
    } else if (maxValue == minValue) {
        alert("Входные данные заданы некорректно.");
    } else {
        var array = [];

        for (let i = 0; i < n * n; i++) {
            array.push(getRandomInt(minValue, maxValue));
        }
        
        return getResultArray(array);
    }
}

function getResultArray(array) {
    if (array.length > 0) {
        return array.sort((a, b) => b - a);   
    }
}