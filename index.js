const input = document.querySelector("#name");
const duration = document.querySelector("#duration");
const pBtn = document.querySelector(".play");
const lBtn = document.querySelector(".like");
const hBtn = document.querySelector(".help");
const startTile = document.querySelector(".startTile");
const typeTest = document.querySelector(".typeTest");
const board = document.querySelector(".board");
const timer = document.querySelector(".timer");
const stroke = document.querySelector(".stroke");
const score = document.querySelector(".score");
const wps = document.querySelector(".wps");
const errPer = document.querySelector(".errPer");
let pb = document.querySelector(".pb");
let pclose = document.querySelector(".pclose");
let pheading = document.querySelector(".pheading");
let ptext = document.querySelector(".ptext");
const comment = document.querySelector(".comment");
const LeaderBoardList = document.querySelector(".leaderboard");
let leaderboard;
let keyStrokes = 0;
let onLetter = 0;
let points = 0;
let time = 0;
let timeLimit = 0;
let wordCount = 0;
let WordsPerMin = 0;
let liked = false;
let ErrorPrecentage = 0;
let Sentence = "";
let words = 10;
let wordPool;
let playerName;
const date = new Date(0);
function createTest() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onload = function () {
    let myObj = this.responseText;
    myObj = myObj.split(",");
    for (let i = 0; i < myObj.length; i++) {
      myObj[i] = myObj[i].split("\n");
      myObj[i].shift();
    }
    wordPool = myObj;
    serveTest();
    startTimer();
  };
  xmlhttp.open("GET", "unigram_freq.csv");
  xmlhttp.send();
}

function serveTest() {
  Sentence = "";
  onLetter = 0;
  for (let i = 0; i < words; i++) {
    Sentence += wordPool[Math.floor(Math.random() * (333000 - 1 + 1) + 1)];
    if (i != 4) Sentence += " ";
  }
  typeTest.innerHTML = null;
  let word, letterContent;
  let j = 0;
  typeTest.innerHTML += `<div id="word${j}" class="flex h-max my-[4px] mx-[2px]"></div>`;
  for (let i = 0; i < Sentence.length; i++) { 
    word = document.getElementById(`word${j}`);
    if (Sentence[i] !== " ") {
      letterContent = `<div id="letter${i}" class="h-max p-0 font-fira mx-[1px] font-light text-2xl sm:text-5xl flex">${Sentence[i]}</div>`;
    } else {
      j++;
      typeTest.innerHTML += `<div id="letter${i}" class="h-max p-0 font-fira mx-[1px] font-light text-2xl sm:text-5xl flex">&nbsp;</div>`;
      typeTest.innerHTML += `<div id="word${j}" class="flex h-max my-[4px] mx-[2px]"></div>`;
      continue;
    } 
  word.innerHTML += letterContent;
}
document.getElementById(`letter${onLetter}`).style.background = '#ffec53'; 
}

function countDown(x = 3, arr) {
  let count = x;
  let countInterval = setInterval(() => {
    typeTest.innerHTML = "";
    typeTest.innerHTML = `<p class="text-9xl mx-auto font-bold">${count}</p>`;
    count--;
  }, 1000);
  setTimeout(() => {
    typeTest.innerHTML = "";
    clearInterval(countInterval);
    arr.forEach(function (element) {
      element();
    });
  }, x * 1000 + 1000);
}

function startTimer() {
  Timer = setInterval(() => {
    if (time >= timeLimit) {
      gameEnd();
    }
    date.setSeconds(time);
    date.setMinutes(time / 60);
    timer.innerHTML = `<p class="font-black text-2xl text-center font-mono">${date.getMinutes()}:${date.getSeconds()}</p>`;
    time++;
    WordsPerMin = ((wordCount / time) * 60).toPrecision(4);
    ErrorPrecentage = (((keyStrokes - points) * 100) / keyStrokes).toPrecision(
      4
    );
    ErrorPrecentage = ErrorPrecentage == NaN ? 0 : ErrorPrecentage;
    wps.innerText = WordsPerMin;
    errPer.innerText = `${ErrorPrecentage} %`;
  }, 1000);
}
function stopTimer() {
  clearInterval(Timer);
}

function validText(t) {
  if (Sentence[onLetter] === t) {
    document.getElementById(`letter${onLetter}`).style.background = '#66ff51'; 
    points++;
  } else {
    document.getElementById(`letter${onLetter}`).style.background = '#ff5959'; 
  }
  keyStrokes++;
  onLetter++;
  score.innerText = points;
  if (Sentence[onLetter] === " ") wordCount++;
  if (onLetter == Sentence.length) {
    wordCount++;
    serveTest();
    return;
  }
  document.getElementById(`letter${onLetter}`).style.background = '#ffec53'; 
}

function prompt(heading, text, time = 5) {
  pb.style.display = "flex";
  pheading.innerText = heading;
  ptext.innerText = text;
}

function closePrompt() {
  pb.style.display = "none";
}

function gameStart() {
  document.body.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "Escape":
        document.location.reload();
        break;
      case "Shift":
        break;
      case "Control":
        break;
      case "Enter":
        break;
      case "Tab":
        break;
      case "Backspace":
        break;
      default:
        stroke.innerText = e.key;
        validText(e.key);
        break;
    }
  });
}

function gameEnd() {
  stopTimer(); 
  updateLeaderboard(
    "set",
    checkRank(WordsPerMin),
    playerName,
    WordsPerMin,
    ErrorPrecentage
  );
  prompt(
    "Your Score",
    `${playerName}... Your Average WORDS PRE MINUTE :- ${WordsPerMin}.....Your Error Percentage is :- ${ErrorPrecentage}`
  );
}

pBtn.addEventListener("click", () => {
  playerName = input.value;
  timeLimit = duration.value * 60;
  if (playerName.trim() == "") {
    alert("Please Enter the name!");
    return;
  }
  startTile.style.display = "none";
  typeTest.removeAttribute("style");
  board.removeAttribute("style");
  countDown(3, [createTest]);
  gameStart();
});
hBtn.addEventListener("click", () => { 
  prompt(
    "How to Play",
    "Its Quite Easy. When the countdown finishes, a text will appear. Just start typing and continue as long as you can. Remember to consider the Upper-case letters and punctuations too. If you made a mistake the Text will turn red, Backspace won't work. Every key you press will be shown in bottom-mid part. The more letters you write, your points will increase. Based on the timer, your Words per minute value will be shown.Play for ATLEAST 10s after that you can PRESS ESCAPE to stop the game and calculate score.Percentage of Error will be shown based on how much from the total text you got wrong.",
    100
  );
});
pclose.addEventListener("click", () => {
  closePrompt();
});
lBtn.addEventListener("click", () => {
  liked = liked == true ? false : true;
  lBtn.innerText = liked == true ? "Like ❤️" : "Like 🤍";
});

////////////LeaderBoard Script////////////

async function fillLeaderBoard() { 
  let promise = new Promise((v)=>{
    v(updateLeaderboard("get"));  
  });  
  promise.then((v)=>{
    leaderboard = v; 
    for (let i = 1; i <= leaderboard.length; i++) {
      LeaderBoardList.innerHTML += `<li>${leaderboard[i].name} - ${leaderboard[i].WPM} -WPM - ${leaderboard[i].Error}% -Error</li>`;
    } 
  })
}

async function updateLeaderboard(act, rank = null, name = null, wpm = 0, err = 0, extra = 0) {
  let promise = new Promise((v,e)=>{
    const xmlhttp = new XMLHttpRequest(); 
    let value = JSON.stringify({
      rank: rank,
      name: name,
      WPM: wpm,
      Error:err
    });
    xmlhttp.onload = function () { 
      v(JSON.parse(this.responseText));
    };
    xmlhttp.open(
      "POST",
      `script.php?v=${value}&a=${act}&e=${extra}`
    );
    xmlhttp.send();
  }) 
  return await promise;
}

function checkRank(wpm) {
  for (let i = 1; i <= leaderboard.length; i++) {
    if (wpm >= leaderboard[i].WPM) {
      return i;
    }
  }
  return (leaderboard.length + 1);
}

fillLeaderBoard();
