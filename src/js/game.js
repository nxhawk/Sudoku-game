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

const _checkFull = () => {
  for (val of table) if (val == 0) return;
  alert("OKKKKKKK");
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
const _tick = (index, val) => {
  sq_game[index].classList.remove("err");
  sq_game[index].classList.remove("true");
  sq_game[index].classList.remove("false");
  sq_game[index].innerText = val;
  table[index] = +val;
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
  for (let i = 1; i < 10; i++) if (+key == i) return true;
  return false;
};
document.addEventListener("keydown", (e) => {
  if (current_square != -1 && _ok_key(e.key)) {
    if (tableG[current_square] == 0) {
      if (sq_game[current_square].innerText == e.key) {
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
