square = document.querySelector("#game .left");

//repair screen
const _repair = () => {
  for (let i = 0; i < 81; i++)
    square.innerHTML += `
      <div class = 'sq'></div>
  `;
};
_repair();

//onclick game screen
current_square = -1;
sq_game = document.querySelectorAll(".sq");

// sq_game.forEach((sq, index) => {
//   sq.innerText = index;
// });

const _row = (index) => {
  return Math.floor(index / 9);
};

const _col = (index) => {
  return index % 9;
};

const _square = (index) => {
  let row = _row(index),
    col = _col(index);
  if (row <= 2 && col <= 2) return 0;
  else if (row <= 2 && col <= 5) return 1;
  else if (row <= 2 && col <= 8) return 2;
  else if (row <= 5 && col <= 2) return 3;
  else if (row <= 5 && col <= 5) return 4;
  else if (row <= 5 && col <= 8) return 5;
  else if (row <= 8 && col <= 2) return 6;
  else if (row <= 8 && col <= 5) return 7;
  else if (row <= 8 && col <= 8) return 8;
};
//[]{}
const _removeToggle = () => {
  sq_game.forEach((sq) => {
    sq.classList.remove("clr");
    sq.classList.remove("clr_choosen");
  });
};
const _info_square = (index) => {
  let row = _row(index),
    col = _col(index),
    square = _square(index);
  return { row, col, square };
};

const _chosenSq = (index) => {
  _checkSame(index);
  sq_game[index].classList.add("clr_choosen");
  current_square = index;
  let df = _info_square(index);
  sq_game.forEach((sq, idx) => {
    let dx = _info_square(idx);
    if (dx.row == df.row || dx.col == df.col || dx.square == df.square)
      sq.classList.add("clr");
  });
  sq_game[index].classList.remove("clr");
};

const _check_err = () => {
  sq_game.forEach((sq) => {
    sq.classList.remove("err");
  }); //[]{}
  sq_game.forEach((sq, index) => {
    let df = _info_square(index);
    sq_game.forEach((sqx, idx) => {
      if (index != idx && table[idx] == table[index] && table[idx] != 0) {
        let dx = _info_square(idx);
        if (dx.row == df.row || dx.col == df.col || dx.square == df.square) {
          sq.classList.add("err");
          sqx.classList.add("err");
        }
      }
    });
  });
};

const _checkSame = (index) => {
  sq_game.forEach((sq) => {
    sq.classList.remove("same");
  });
  if (table[index] == 0) return;
  let df = _info_square(index);
  sq_game.forEach((sq, idx) => {
    if (table[index] == table[idx] && index != idx) {
      let dx = _info_square(idx);
      if (dx.row == df.row || dx.col == df.col || dx.square == df.square) {
        sq.classList.add("err");
      } else sq.classList.add("same");
    }
  });
};

sq_game.forEach((sq, index) => {
  sq.addEventListener("click", () => {
    _removeToggle();
    _chosenSq(index);
    _checkSame(index);
  });
});

const _checkMask = () => {
  for (let i = 0; i < table.length; i++)
    if (table[i] != tableR[i]) return false;
  return true;
};
const _restart = () => {
  current_square = -1;
  for (let i = 0; i < table.length; i++)
    if (tableG[i] == 0) {
      table[i] = 0;
      sq_game[i].innerText = "";
    }
  _removeToggle();
  _check_err();
  _checkSame();
};

const _checkFull = () => {
  for (val of table) if (val == 0) return;
  if (_checkMask()) {
    setTimeout(() => {
      if (confirm("Good Job Bro <3. Press ok to restart game")) _restart();
    }, 100);
  } else {
    setTimeout(() => {
      alert("Wrong Answer Bro </>");
    }, 100);
  }
};
//[]{}
const _no_tick = (index) => {
  sq_game[index].innerText = "";
  table[index] = 0;
  sq_game[index].classList.remove("true");
  sq_game[index].classList.remove("false");
  sq_game[index].classList.remove("err");
  sq_game[index].classList.remove("same");
  _checkSame(index);
  _check_err();
};
//[]{}
const _magic_square = (row, col) => {
  let index = 0;
  if (_checkMask()) return;
  for (let i = row; i < row + 3; i++) {
    for (let j = col; j < col + 3; j++) {
      index++;
      setTimeout(() => {
        let idx = i * 9 + j;
        let tmp = sq_game[idx].style.backgroundColor;
        sq_game[idx].style.setProperty(
          "background-color",
          "#d1dbef",
          "important"
        );
        setTimeout(() => {
          sq_game[idx].style.backgroundColor = tmp;
        }, index * 40);
      }, index * 80);
    }
  }
};

const _check_ok_square = (index) => {
  let df = _info_square(index);
  let rowF = Math.floor(df.square / 3) * 3;
  let colF = (df.square % 3) * 3;
  for (let i = rowF; i < rowF + 3; i++)
    for (let j = colF; j < colF + 3; j++) {
      if (table[i * 9 + j] == 0 || table[i * 9 + j] != tableR[i * 9 + j])
        return;
    }
  _magic_square(rowF, colF);
};

const _tick = (index, val) => {
  sq_game[index].classList.remove("err");
  sq_game[index].classList.remove("true");
  sq_game[index].classList.remove("false");
  sq_game[index].innerText = val;
  table[index] = +val;
  _check_ok_square(index);
  if (table[index] == tableR[index]) sq_game[index].classList.add("true");
  else sq_game[index].classList.add("false");
  _checkSame(index);
  _check_err();
};

numbers = document.querySelectorAll(".container-game .item");
numbers.forEach((number) => {
  number.addEventListener("click", () => {
    if (tableG[current_square] == 0) {
      if (sq_game[current_square].innerText == number.innerText) {
        _no_tick(current_square);
      } else {
        _tick(current_square, number.innerText);
        _checkFull();
      }
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (current_square != -1) {
    if (e.key == "ArrowUp") {
      if (current_square - 9 >= 0) {
        _removeToggle();
        _chosenSq(current_square - 9);
      }
    } else if (e.key == "ArrowDown") {
      if (current_square + 9 < 81) {
        _removeToggle();
        _chosenSq(current_square + 9);
      }
    } else if (e.key == "ArrowLeft") {
      if (current_square % 9 != 0) {
        _removeToggle();
        _chosenSq(current_square - 1);
      }
    } else if (e.key == "ArrowRight") {
      if ((current_square + 1) % 9 != 0) {
        _removeToggle();
        _chosenSq(current_square + 1);
      }
    }
  }
});

const _ok_key = (key) => {
  if (key == "Delete" || key == "Backspace") return true;
  for (let i = 1; i < 10; i++) if (+key == i) return true;
  return false;
};
document.addEventListener("keydown", (e) => {
  if (current_square != -1 && _ok_key(e.key)) {
    if (tableG[current_square] == 0) {
      if (
        sq_game[current_square].innerText == e.key ||
        e.key == "Delete" ||
        e.key == "BackSpace"
      ) {
        _no_tick(current_square);
      } else {
        _tick(current_square, e.key);
        _checkFull();
      }
    }
  }
});
//default value//[]{}
sq_game.forEach((sq, index) => {
  if (tableG[index] != 0) {
    table[index] = tableG[index];
    sq.innerText = tableG[index];
  }
});

// model
open = document.querySelector(".open");
nRight = document.querySelector(".right-container");
open.innerHTML = `<i class="fa-solid fa-bars"></i>`;

open.addEventListener("click", () => {
  if (open.innerHTML == `<i class="fa-solid fa-bars"></i>`) {
    console.log("aaa");
    open.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    nRight.style.display = "flex";
  } else {
    open.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    nRight.style.display = "none";
  }
});

btn = document.querySelector(".btn");
btn.addEventListener("click", () => {
  if (confirm("Do you want restart game?")) _restart();
});
