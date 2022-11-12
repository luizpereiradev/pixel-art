const board = document.querySelector('#pixel-board');
const clearButton = document.querySelector('#clear-board');
let pixels = document.querySelectorAll('.pixel');
const colorPallet = document.querySelector('#color-palette');
let painting
const selected = document.querySelector('.colorSelected');
const colorPicker = document.querySelector('.colorSelectedInput');
let selectedToll = document.querySelector('#selected-tool');
const tolls = document.querySelector('.tolls');

selected.style.backgroundColor = 'black';
selectedToll.style.backgroundColor = 'rgba(107, 107, 107, 50%)';

const createPalletColors = () => {
  for (let i = 0; i < 40; i += 1) {
    const color = document.createElement('div');
    color.className = 'color';
    colorPallet.appendChild(color);
    color.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  }
};

const savePixels = () => {
  const pixelsColor = [];
  pixels.forEach((pixel) => {
    pixelsColor.push(pixel.style.backgroundColor);
  });
  localStorage.setItem('pixelBoard', JSON.stringify(pixelsColor));
};

const clearBoard = () => {
  for (let i = 0; i < pixels.length; i += 1) {
    pixels[i].style.backgroundColor = i % 2 === 0 ? 'white' : '#E6E6E6';
  }
  localStorage.setItem('pixelBoard', null);
};

document.addEventListener("contextmenu", e => e.preventDefault());

const createPixels = (px) => {
  board.innerHTML = '';
  if(px % 2 === 0) {
    px -= 1;
  }
  localStorage.setItem('boardSize', px);
  board.style.gridTemplateColumns = `repeat(${px}, 1fr)`;
  let y = 1;
  let x = 0;
  for (let index = 0; index < px * px; index += 1) {
    if(index % px === 0 && index !== 0) {
      y += 1;
      x = 0;
    }
    x += 1;
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.style.height = `${500 / px}px`;
    pixel.style.width = `${500 / px}px`;
    pixel.id = `x${x}y${y}`;
    // um cinza e outro branco
    pixel.style.backgroundColor = index % 2 === 0 ? 'white' : '#E6E6E6';
    board.appendChild(pixel);
  }
  board.height = `500px`;
};

const changeColor = (event) => {
  const color = event.target;
  console.log(color);
  if (color.className === 'color') {
    selected.style.backgroundColor = color.style.backgroundColor;
  }
};

const paintPixel = (event) => {
  const pixel = event.target;
  const color = selected.style.backgroundColor;
  pixel.style.backgroundColor = color;
  savePixels();
};

clearButton.addEventListener('click', clearBoard);

const vqvButton = document.querySelector('#generate-board');
const input = document.querySelector('#board-size');
vqvButton.addEventListener('click', () => {
  if (input.value.length === 0) {
    alert('Board inválido!');
  } else if (input.value < 5) {
    input.value = 5;
    createPixels(input.value);
  } else if (input.value > 50) {
    input.value = 50;
    createPixels(input.value);
  } else if (input.value.length > 0) {
    createPixels(input.value);
  }
  input.value = '';
  localStorage.setItem('pixelBoard', null);
});

colorPallet.addEventListener('click', changeColor);

board.addEventListener('mousedown', (event) => {
  console.log(event);
  if (selectedToll.classList.contains('pen')) {
    paintPixel(event);
    painting = true;
  }else if(selectedToll.classList.contains('fill')){
    const color = selected.style.backgroundColor;
    const pixel = event.target;
    const pixelColor = pixel.style.backgroundColor;
    const x = parseInt(pixel.id.split('x')[1].split('y')[0]);
    const y = parseInt(pixel.id.split('y')[1]);
    const pixelsToPaint = [];
    pixelsToPaint.push([x,y]);
    floodfill(x,y,pixelColor,color)
  }
});

board.addEventListener('mouseover', (event) => {
  if (painting) {
    paintPixel(event);
  }
  console.log(event.target.id)
});

board.addEventListener('mouseup', () => {
  painting = false;
});

const loadPixels = () => {
  const boardSize = localStorage.getItem('boardSize');
  console.log(boardSize);
  createPixels(boardSize != null ? boardSize : 5);
  const localPixels = JSON.parse(localStorage.getItem('pixelBoard'));
  pixels = document.querySelectorAll('.pixel');
  if (localPixels != null) {
    for (let i = 0; i < pixels.length; i += 1) {
      pixels[i].style.backgroundColor = localPixels[i];
    }
  }
  createPalletColors();
};

let color_pickers = [
  new ColorPickerControl({ container: document.querySelector('#color-picker')}),
];

window.onload = loadPixels;


color_pickers.forEach(color_picker => {
  color_picker.on('change', function(color){
    selected.style.setProperty('background-color', color.toHEX());
    selected.style.setProperty('background-color', color.a / 255);
    color_pickers.filter(p=>p!=color_picker).forEach((p) => {
      p.color.fromHSVa(color.h, color.s, color.v, color.a);
      p.update(false);
    });
  });
});

colorPicker.addEventListener("change", watchColorPicker, false);

function watchColorPicker(event) {
  selected.style.backgroundColor = event.target.value;
}

function get_color(x,y) {
  return document.getElementById("x"+x+"y"+y).style.backgroundColor;
}

function set_color(x,y,color) {
  document.getElementById("x"+x+"y"+y).style.backgroundColor = color;
}

function floodfill(x,y,A,B) {
  console.log(x,y,A,B)
  const boardSize = localStorage.getItem('boardSize');
  if ((x<1) || (x>boardSize) || (y<1) || (y>boardSize)) return;
  console.log(get_color(x,y))
  if (get_color(x,y)!=A && get_color(x,y)!= '#E6E6E6' &&  get_color(x,y)!= 'rgb(230, 230, 230)') return;
  set_color(x,y,B);
  floodfill(x-1,y-1,A,B);
  floodfill(x-1,y,A,B);
  floodfill(x-1,y+1,A,B);
  floodfill(x,y-1,A,B);
  floodfill(x,y+1,A,B);
  floodfill(x+1,y-1,A,B);
  floodfill(x+1,y,A,B);
  floodfill(x+1,y+1,A,B);
}

tolls.addEventListener('click', (event) => {
  const toll = event.target;
  selectedToll.classList.remove('selected-toll');
  selectedToll.style.backgroundColor = '';
  selectedToll.parentElement.style.backgroundColor = '';
  selectedToll = toll;
  selectedToll.classList.add('selected-toll');
  console.log(selectedToll);
  if(selectedToll.classList.contains('fa-solid')){
    selectedToll.parentElement.style.backgroundColor = 'rgba(107, 107, 107, 50%)';
  }else{
    selectedToll.style.backgroundColor = 'rgba(107, 107, 107, 50%)';
  }
});

const element = document.getElementById('panzoom')
	const panzoom = Panzoom(element, {
	});
	// enable mouse wheel
	const parent = element.parentElement
	parent.addEventListener('wheel', panzoom.zoomWithWheel);