let button = document.getElementById('btn1');

button.addEventListener('click', popUp);

function popUp() {
	alert('Your message has been sent :)');
}


//-----------------------Sudoku ---------------------------

//ya im not manually writing 81 divs bossman
function makeGrid() {
	let container = document.getElementById('sud_container');
	for (i = 0; i < 81; i++)
		container.append(document.createElement("div"));
}
