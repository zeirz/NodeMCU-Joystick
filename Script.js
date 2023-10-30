let container = document.getElementById("joystick-container");
let joystick = document.getElementById("joystick");

container.addEventListener("mousedown", function (e) {
  let rect = container.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  joystick.style.left = x + "px";
  joystick.style.top = y + "px";
});

values = { X: 0, Y: 0, aleron: 0, elevator: 0 };

power = false;

const Http = new XMLHttpRequest();
var pre = false;

bd = body.getBoundingClientRect();
X = bd.width / 2;
Y = bd.height / 2;
compile(X, Y);

url =
  "http://192.168.4.1/?X=" +
  Math.round(values["aleron"]) +
  "&Y=" +
  Math.round(values["elevator"]);
Http.onreadystatechange = function () {
  if (this.readyState == 4) {
    console.log(Http);
    pre = false;
  }
};

function compile(X, Y) {
  X = X > bd.width ? bd.width : X;
  X = X < 0 ? 0 : X;
  values["X"] = X;
  X = (X / bd.width) * 200;
  X -= 100;
  values["aleron"] = X;

  Y = Y > bd.height ? bd.height : Y;
  Y = Y < 0 ? 0 : Y;
  values["Y"] = Y;
  Y = (Y / bd.height) * -200;
  Y += 100;
  values["elevator"] = Y;

  place();
}

function throttel(e) {
  e.preventDefault();
  bd = body.getBoundingClientRect();
  Y = e.targetTouches[0].clientY - bd.top;
  X = e.targetTouches[0].clientX - bd.left;
  compile(X, Y);
}

function throttelEnd() {
  bd = body.getBoundingClientRect();
  X = bd.width / 2;
  Y = bd.height / 2;
  compile(X, Y);
}

function place() {
  dime = joystick.getBoundingClientRect();
  joystick.style.left = values["X"] - dime.width / 2 + "px";
  joystick.style.top = values["Y"] - dime.height / 2 + "px";
}

c = 0;

function repeat() {
  if (!power) {
    return;
  }
  if (c % 7 == 0 && !pre) {
    url =
      "http://192.168.4.1/?X=" +
      Math.round(values["aleron"]) +
      "&Y=" +
      Math.round(values["elevator"]);
    pre = true;
    Http.open("GET", url);
    Http.send();
  }
  c += 1;
  window.requestAnimationFrame(repeat);
}

function start() {
  power = true;
  window.requestAnimationFrame(repeat);
  document.getElementById("stop").disabled = false;
  document.getElementById("start").disabled = true;
}

function end() {
  power = false;
  document.getElementById("stop").disabled = true;
  document.getElementById("start").disabled = false;
}

// Http.onload = () => {
//     console.log('DONE', Http.readyState); // readyState will be 4
// };
