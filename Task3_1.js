//Алгоритм вычисления быков и коров:
//1. Сравниваем длину чисел: Если разная -> следующая итерация
//2. Стираем цифры, которые совпали в обоих числах.
// Количество пар = быки
//3. Поэлементно ищем для каждой цифры из первого числа пару во втором, если находим, затираем оба.
// Количество пар = коровы


const readline = require('readline-sync')

// Генерация числа для отгадывания
function generator() {
    let res = '';
    let requiredLength = Math.round(Math.random() * 3 + 3);
    //Дополнительная проверка длины (для обработки случая когда Math.random генерирует 0)
    while (res.length !== requiredLength) {
        res = Math.random().toString(10).substr(2, requiredLength);
    }
    return res;
}

// Функция замены символа в строке на любую подстроку
function replaceAt(str, idx, newChar) {
    return str.substr(0,idx) + newChar + str.substr(idx + 1);
}

//Функция сравнения чисел (введенного и загаданного)
function check(input, secretNumber){
    //Обработка несовпадения длины чисел
    if (input.length !== secretNumber.length) {
        console.log('\nWrong input\n');
        return;
    }

    //console.log(input + ' ' + secretNumber); // DEBUG

    //Сравнение чисел (по позициям)
    let positionGuessedCount = 0;
    for (let i = 0; i < secretNumber.length; i++) {
        if (secretNumber[i] === input[i]) {
            positionGuessedCount++;
            secretNumber = replaceAt(secretNumber, i, '');
            input = replaceAt(input, i, '');
            i--;
        }

    }
    // Сравнение оставшихся
    let sameDigitsCount = 0;
    if (secretNumber.length !== 0) {
        let i = 0;
        while (i < secretNumber.length){
            let charToReplace = secretNumber[i];
            if (secretNumber.includes(charToReplace) && input.includes(charToReplace)) {
                secretNumber = secretNumber.replace(charToReplace, '');
                input = input.replace(charToReplace, '');
                sameDigitsCount++;
            } else {
                i++;
            }
        }
    } else {
        return 1;
    }
    console.log(`Digits guessed by position: ${positionGuessedCount}\nDigits guessed without position: ${sameDigitsCount}\n`);
    return 0;
}

const numberOfTry = 10; //Количество попыток
let secretNumber = generator();
let currentTry = 0;

while (currentTry++ < numberOfTry) {
    console.log('~'.repeat(30));
    //Ввод
    let input = readline.question(
        `Number have ${secretNumber.length} digits\nEnter your suggestion:\n`
    ).toString();

    if (check(input, secretNumber) === 1){
        console.log('You won!!!\n');
        break;
    }
    console.log('~'.repeat(30));
}
console.log('No pain - no gain...\nTry again...\n');
console.log(`Number was ${secretNumber}`)

