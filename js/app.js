/*
 * Create a list that holds all of your cards
 */

const Deck = document.querySelector('.deck');
let Cards_Fliped_Over = [];
let Fliped_Cards = 0;
let Stopwatch_Off = true;
let Time = 0;
let Stopwatch_ID;
let Matched = 0;

function Shuffle_Deck() {
    const Cards_To_Shuffle = Array.from(document.querySelectorAll('.deck li'));
    const Shuffled_Cards = Shuffle(Cards_To_Shuffle);
    for (card of Shuffled_Cards) {
        Deck.appendChild(card);
    }
}
Shuffle_Deck();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function Shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

Deck.addEventListener('click', event => {
    const Click_Card = event.target;
    if (Is_Click_Valid(Click_Card)) {
        if (Stopwatch_Off) {
            Stopwatch();
            Stopwatch_Off = false;
        }
        Card_Fliped_Over(Click_Card);
        Add_Card_Fliped_Over(Click_Card);
        if (Cards_Fliped_Over.length === 2) {
            Check_For_Match();
            Add_Fliped_Card();
            Check_Score();
        }
    }
});

function Is_Click_Valid(Click_Card) {
    return (
        Click_Card.classList.contains('card') &&
        !Click_Card.classList.contains('match') &&
        Cards_Fliped_Over.length < 2 &&
        !Cards_Fliped_Over.includes(Click_Card)
    );
}

function Stopwatch() {
    Stopwatch_ID = setInterval(() => {
        Time++;
        Display_Stopwatch();
    }, 1000);
}

function Display_Stopwatch() {
    const Stopwatch = document.querySelector('.Stopwatch');
    const min = Math.floor(Time / 60);
    const sec = Time % 60;

    if (sec < 10) {
        Stopwatch.innerHTML = `${min}:0${sec}`;
    } else {
        Stopwatch.innerHTML = `${min}:${sec}`;
    }
}

function Card_Fliped_Over(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function Add_Card_Fliped_Over(Click_Card) {
    Cards_Fliped_Over.push(Click_Card);
}

function Check_For_Match() {
    const Pairs = 8;

    if (
        Cards_Fliped_Over[0].firstElementChild.className ===
        Cards_Fliped_Over[1].firstElementChild.className
    ) {
        Cards_Fliped_Over[0].classList.toggle('match');
        Cards_Fliped_Over[1].classList.toggle('match');
        Cards_Fliped_Over = [];
        Matched++;
        if (Matched === Pairs) {
            The_Match_is_Over();
        }
    } else {
        setTimeout(() => {
            Card_Fliped_Over(Cards_Fliped_Over[0]);
            Card_Fliped_Over(Cards_Fliped_Over[1]);
            Cards_Fliped_Over = [];
        }, 1000);
    }
}

function The_Match_is_Over() {
    Pause_Stopwatch();
    Scoreboard();
    Write_Scoreboard_Stats();
}

function Pause_Stopwatch() {
    clearInterval(Stopwatch_ID);
}

function Scoreboard() {
    const Scoreboard = document.querySelector('.Scoreboard_Background');
    Scoreboard.classList.toggle('Hide');
}

function Write_Scoreboard_Stats() {
    const Scoreboard_Time_Stat = document.querySelector('.Scoreboard_Time');
    const Stopwatch_Time = document.querySelector('.Stopwatch').innerHTML;
    const Fliped_Cards_Stat = document.querySelector('.Scoreboard_Fliped_Cards');
    const Shooting_Stars_Stat = document.querySelector('.Scoreboard_Stars');
    const Shooting_Stars = Get_Shooting_Stars();

    Scoreboard_Time_Stat.innerHTML = `Time = ${Stopwatch_Time}`;
    Fliped_Cards_Stat.innerHTML = `Fliped Cards = ${Fliped_Cards}`;
    Shooting_Stars_Stat.innerHTML = `Shooting Stars = ${Shooting_Stars}`;
}

function Get_Shooting_Stars() {
    Shooting_Stars = document.querySelectorAll('.stars li');
    Shooting_Star_Count = 0;
    for (star of Shooting_Stars) {
        if (star.style.display !== 'none') {
            Shooting_Star_Count++;
        }
    }
    return Shooting_Star_Count;
}

function Add_Fliped_Card() {
    Fliped_Cards++;
    const Fliped_Cards_Text = document.querySelector('.Fliped_Cards');
    Fliped_Cards_Text.innerHTML = Fliped_Cards;
}

function Check_Score() {
    if (Fliped_Cards === 16 || Fliped_Cards === 24) {
        Hide_Shooting_Star();
    }
}

function Hide_Shooting_Star() {
    const Shooting_Star_List = document.querySelectorAll('.stars li');
    for (star of Shooting_Star_List) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

document.querySelector('.Scoreboard_Abort').addEventListener('click', () => {
    Scoreboard();
});

document.querySelector('.Scoreboard_New_Match').addEventListener('click', New_Match);

function New_Match() {
    Start_Over_From_The_Beginning();
    Scoreboard();
}

document.querySelector('.restart').addEventListener('click', Start_Over_From_The_Beginning);


function Start_Over_From_The_Beginning() {
    Reset_Stopwatch();
    Reset_Fliped_Cards();
    Reset_Shooting_Stars();
    Reset_Cards();
    Shuffle_Deck();
}

function Reset_Stopwatch() {
    Pause_Stopwatch();
    Stopwatch_Off = true;
    Time = 0;
    Display_Stopwatch();
}

function Reset_Fliped_Cards() {
    Fliped_Cards = 0;
    document.querySelector('.Fliped_Cards').innerHTML = Fliped_Cards;
}

function Reset_Shooting_Stars() {
    Shooting_Stars = 0;
    const Shooting_Star_List = document.querySelectorAll('.stars li');
    for (star of Shooting_Star_List) {
        star.style.display = 'inline';
    }
}

function Reset_Cards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}