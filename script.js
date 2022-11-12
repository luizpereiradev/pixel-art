const board = document.querySelector('#pixel-board');
const localColors = JSON.parse(localStorage.getItem('colorPalette'));
const colorPalette = document.querySelector('#color-palette');
const colors = localColors != null ? localColors : ['black', 'red', 'blue', 'green'];
const randomButton = document.querySelector('#button-random-color');
const clearButton = document.querySelector('#clear-board');
let pixels = document.querySelectorAll('.pixel');

const savePixels = () => {
  const pixelsColor = [];
  pixels.forEach((pixel) => {
    pixelsColor.push(pixel.style.backgroundColor);
  });
  localStorage.setItem('pixelBoard', JSON.stringify(pixelsColor));
};

const clearBoard = () => {
  for (let i = 0; i < pixels.length; i += 1) {
    pixels[i].style.backgroundColor = 'white';
    console.log(pixels);
  }
};

const createPixels = (px) => {
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${px}, 1fr)`;
  for (let index = 0; index < px * px; index += 1) {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    board.appendChild(pixel);
  }
};

const createPalette = (cl) => {
  for (let index = 0; index < cl.length; index += 1) {
    const color = document.createElement('div');
    color.className = index === 0 ? 'color selected' : 'color';
    color.style.backgroundColor = cl[index];
    colorPalette.appendChild(color);
  }
};

const randomPallet = () => {
  for (let index = 1; index < 4; index += 1) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    colors.splice(index, 1, `#${randomColor}`);
  }
  localStorage.setItem('colorPalette', JSON.stringify(colors));
};

const changeColor = (event) => {
  const color = event.target;
  if (color.className === 'color') {
    const selected = document.querySelector('.selected');
    selected.classList.remove('selected');
    color.classList.add('selected');
  }
};

const paintPixel = (event) => {
  const pixel = event.target;
  const selected = document.querySelector('.selected');
  const color = selected.style.backgroundColor;
  pixel.style.backgroundColor = color;
  savePixels();
};

randomButton.addEventListener('click', () => {
  randomPallet();
  colorPalette.innerHTML = '';
  createPalette(colors);
});

colorPalette.addEventListener('click', changeColor);

board.addEventListener('click', paintPixel);

clearButton.addEventListener('click', clearBoard);

const vqvButton = document.querySelector('#generate-board');
const input = document.querySelector('#board-size');
vqvButton.addEventListener('click', () => {
  if (input.value.length === 0) {
    alert('Board inválido!');
  } else if (input.value < 5) {
    input.value = 5;
    createPixels(input.value);
    localStorage.setItem('boardSize', input.value);
  } else if (input.value > 50) {
    input.value = 50;
    createPixels(input.value);
    localStorage.setItem('boardSize', input.value);
  } else if (input.value.length > 0) {
    createPixels(input.value);
    localStorage.setItem('boardSize', input.value);
  }
  input.value = '';
});

const loadPixels = () => {
  createPalette(colors);
  const boardSize = localStorage.getItem('boardSize');
  createPixels(boardSize != null ? boardSize : 5);
  const localPixels = JSON.parse(localStorage.getItem('pixelBoard'));
  pixels = document.querySelectorAll('.pixel');
  if (localPixels != null) {
    for (let i = 0; i < pixels.length; i += 1) {
      pixels[i].style.backgroundColor = localPixels[i];
    }
  }
};

window.onload = loadPixels;
