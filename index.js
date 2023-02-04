const input = document.querySelector("#name");
const btn = document.querySelector(".play");
const startTile = document.querySelector(".startTile");
const typeTest = document.querySelector(".typeTest");
const board = document.querySelector(".board");
const timer = document.querySelector(".timer");
const stroke = document.querySelector(".stroke");
const score = document.querySelector(".score");
let keyStrokes = 0;
let points = 0;
let Sentence = "Hello World I am a Dummy Text.";
let wordPool = [];

function createTest() {
  for (let i = 0; i < Sentence.length; i++) {
    if (Sentence[i] !== " ") {
      letterContent = `<p id="letter${i}">${Sentence[i]}</p>`;
    } else {
      letterContent = `<p id="letter${i}">&nbsp;</p>`;
    }
    typeTest.innerHTML += letterContent;
  }
}
function countDown(x = 3, fun1, fun2) {
  let count = x;
  let countInterval = setInterval(() => {
    typeTest.innerHTML = "";
    typeTest.innerHTML = `<p class="text-9xl mx-auto font-bold">${count}</p>`;
    count--;
  }, 1000);
  setTimeout(() => {
    typeTest.innerHTML = "";
    clearInterval(countInterval);
    fun1();
    fun2();
  }, x * 1000 + 1000);
}

function startTimer() {
  Timer = setInterval(() => {
    let t = timer.innerText;
    let c = 8;
    if (t >= 9) c -= 3;
    timer.innerHTML = `<p class="font-black text-${c}xl text-center font-mono">${
      parseInt(t) + 1
    }</p>`;
  }, 1000);
}
function stopTimer() {
  clearInterval(Timer);
}

function validText(t) {
  if (Sentence[keyStrokes] === t) {
    document.getElementById(`letter${keyStrokes}`).className +=
      "text-green-600";
    points++;
  } else {
    document.getElementById(`letter${keyStrokes}`).className += "text-red-600";
    points--;
  }
  keyStrokes++;
  score.innerText = points;
  if (keyStrokes == Sentence.length) {
    stopTimer();
  }
}

function gameStart() {
  countDown(5, startTimer, createTest);
  document.body.addEventListener("keydown", (e) => {
    if (
      e.key !== "Shift" &&
      e.key !== "Backspace" &&
      e.key !== "Control" &&
      e.key !== "Enter" &&
      e.key !== "Tab"
    ) {
      stroke.innerText = e.key;
      validText(e.key);
    }
  });
}

btn.addEventListener("click", () => {
  startTile.style.display = "none";
  typeTest.style.display = "flex";
  board.style.display = "flex";
  gameStart();
});
