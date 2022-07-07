
let startGame = document.querySelectorAll(".stamp_item"),
    home = document.querySelector(".home_screen"),
    gameScreen = document.querySelector(".game_screen"),
    selectedStamp, // выбранная марка на стартовом экране
    audio = document.querySelector("audio"),
    sourceAudio = document.querySelector("audio source");



startGame.forEach((item, i) => {
    item.addEventListener('click', (event) => {
        home.style.display = "none";
        gameScreen.style.display = "flex"; // display: flex

        initial();

        sourceAudio.src = "audio/toneStart.mp3";
        audio.load();
        audio.play();

        selectedStamp = event.target.id; // номер выбранной марки
        createPuzzle(); // создаём игровое поле
    });
});

// кнопка menu 
let menu = document.querySelector("#menu");
menu.onclick = function () {
    gameScreen.style.display = "none";
    home.style.display = "block";
    cardsField.innerHTML = "";
    audio.pause();
};

function initial() {
    // массив расположения картинок
    puzzles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    isReady = false; // для подмигивания кнопки "Перемешать" если не перемешано
    // количество ходов обнулить
    steps = 0;
    updateSteps();
    // кнопку перемешать показать
    shuffleButton.style.display = "block";
    // глаз убрать
    eye.style.display = "none";
}

// массив расположения картинок
let puzzles;
let isReady; // для подмигивания кнопки "Перемешать" если не перемешано
let steps; // количество ходов  

let cardsField = document.querySelector("#cards"); // игровое поле
let eye = document.querySelector("#help img");
let countCards = 16; // количество карточек на поле


// получаем кнопку "Перемешать"
let shuffleButton = document.querySelector("#start");
// при нажатии
shuffleButton.onclick = function () {
    // прячем кнопку
    shuffleButton.style.display = "none";
    // показываем глаз (посмотреть оригинал пазла)
    eye.style.display = "block";

    isReady = true;
    // удаляем класс disabled
    delClass();
    // перемешиваем пазл
    shuffleArray();

    sourceAudio.src = "audio/shuffle.mp3";
    audio.load();
    audio.play();

    // обнуляем количество ходов
    steps = 0;
    updateSteps();
};

// отображение экрана помощи
let helpShowing = false;
let helpScreen = document.querySelector("#help-screen");
let helpBtn = document.querySelector("#help");
helpBtn.onclick = function () {
    if (!helpShowing) {
        helpScreen.style.backgroundImage = "url(images/" + selectedStamp + "/" + "original.jpg)";
        helpScreen.style.display = "block";
        helpShowing = true;
    } else {
        helpScreen.style.display = "none";
        helpShowing = false;
    }
};

// Музыка
// переменная состояния звуа
let isSoundOn = true;

// кнопки звука
soundButton1 = document.querySelector("#sound1 img");
soundButton2 = document.querySelector("#sound2 img");

// при нажатии на кнопку звука
soundButton1.onclick = function () {
    changeMute();
};
soundButton2.onclick = function () {
    changeMute();
};

// при нажатии на кнопку звука
function changeMute() {
    audio.muted = !audio.muted;
    // если звук включен
    if (isSoundOn) {
        // поменять картинку на замучено
        soundButton1.src = "images/sound_off.png";
        soundButton2.src = "images/sound_off.png";
        // поменять состояние ны выкл
        isSoundOn = false;
    } else {
        // наоборот
        soundButton1.src = "images/sound_on.png";
        soundButton2.src = "images/sound_on.png";
        isSoundOn = true;
    }
}

let selected = []; // меняемые карточки

// при клике по пазлу
cardsField.onclick = function (event) {
    let element = event.target;
    // проверяем что бы клик был именно по карточке. и что бы не по одной и той же
    if (element.tagName == "LI" && element.className != "active" && element.className != "disable") {
        //добавляем id выбраннлого пазла
        selected.push(element.id);

        sourceAudio.src = "audio/tone1.mp3";
        audio.load();
        audio.play();
        //класс active для промерки, что бы не была выбрана одна и та же 2 раза
        element.className = "active";


        //если выбраны 2 пазла
        if (selected.length == 2) {

            // меняем местаим значения в массиве
            let tmp = puzzles[selected[0]];
            puzzles[selected[0]] = puzzles[selected[1]];
            puzzles[selected[1]] = tmp;

            // получаем список li-шек
            let ulCards = document.querySelector("#cards");
            let liList = ulCards.querySelectorAll("li");

            // убираем класс active
            liList[selected[0]].className = "";
            liList[selected[1]].className = "";

            // обновляем картинки
            refreshPuzzles(liList);

            // проверяем, на своём месте картинка или нет
            for (let i = 0; i < 2; i++) {
                if (liList[selected[i]].id == puzzles[selected[i]]) {
                    liList[selected[i]].className = "disable";
                }
            }
            sourceAudio.src = "audio/tone2.mp3";
            audio.play();
            //обнулить выбранные пазлы
            selected = [];

            // увеличиваем количество ходов
            steps++;
            updateSteps();

            // проверка на победу
            isWin();
        }

    } else if (!isReady) {
        shuffleButton.style.boxShadow = "0 0 0 5px red";
        let timerID = setTimeout(function () {
            shuffleButton.style.boxShadow = "";
            clearInterval(timerID);
        }, 100);

    }
}


// создаём игровое поле
function createPuzzle() {
    // создаём карточки (li) на поле
    for (let i = 0; i < countCards; i = i + 1) {
        // создаём елемент li
        let li = document.createElement("li");
        // добавляем id 
        li.id = i;
        // даём класс disable
        li.className = "disable";
        // вставляем их в игровое поле
        cardsField.appendChild(li);
    }

    // присваиваем картинки
    refreshPuzzles();
}

// убрать class
function delClass() {
    let ulCards = document.querySelector("#cards");
    let liList = ulCards.querySelectorAll("li");
    for (let i = 0; i < liList.length; i = i + 1) {
        liList[i].className = "";
    }
}


// обновляем картинки
function refreshPuzzles() {
    let ulCards = document.querySelector("#cards");
    let liList = ulCards.querySelectorAll("li");
    // присваиваем li-шкам картинки в соответствии с массивом
    for (let i = 0; i < liList.length; i = i + 1) {
        // присваиваем картинки
        liList[i].style.backgroundImage = "url(images/" + selectedStamp + "/" + puzzles[i] + ".jpg)";
        // if (isReady) {
        //     liList[i].className = "";
        // }
    }
}


// перемешивание массива
function shuffleArray() {
    // элементы, которые будем менять местами
    let el1; // по порядку
    let el2; // случайный из не перемешанных

    // за каждую итерацию делаем одну замену
    for (let i = 0; i < puzzles.length - 1; i++) {
        el1 = puzzles[i];
        // случайное чисо от i+1 до конца массива
        el2 = Math.floor(i + 1 + Math.random() * (puzzles.length - (i + 1)));
        // перемена мест
        puzzles[i] = puzzles[el2];
        puzzles[el2] = el1;
    }

    // обновляем картинки
    refreshPuzzles();
}

// обновляем количество ходов
function updateSteps() {

    // получаем тег <p> в котором написано количество шагов
    let strokeCounter = document.querySelector("#strokeCounter");
    strokeCounter.innerText = "Зроблено кроків: " + steps;
}

// проверка на победу
function isWin() {
    for (let i = 0; i < puzzles.length; i++) {
        if (puzzles[i] != i) {
            return;
        }
    }
    // все на месте - победа
    setTimeout (function() {
        win();
    }, 1000);
}

// пазл собран
function win() {
    isReady = false;
    // кнопку перемешать показать
    shuffleButton.style.display = "block";
    // глаз убрать
    eye.style.display = "none";


    sourceAudio.src = "audio/gimn.mp3";
    audio.load();
    audio.play();

    showFinalScreen();



}

function showFinalScreen() {
    // отображение экрана победы
    let finalScreen = document.querySelector("#final_screen");
    finalScreen.style.display = "block";

    let timerID = setTimeout(function () {
        finalScreen.style.display = "none";
        clearInterval(timerID);
    }, 4000);
    
}

