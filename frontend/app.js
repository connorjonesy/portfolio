//-----------------------Not Sudoku---------------------------

//Links
let about_me_link = document.getElementById('link1');
let experience_link = document.getElementById('link2');
let education_link = document.getElementById('link3');
let resume_link = document.getElementById('link4');
let contact_link = document.getElementById('link5');
let sudoku_link = document.getElementById('link6');


//Contact Page
let button = document.getElementById('btn1');

button.addEventListener('click', popUp);

function popUp() {
	alert('Your message has been sent :)');
}


//-----------------------Sudoku---------------------------

//ya im not manually writing 81 divs bossman
function makeGrid() {
	let container = document.getElementById('sud_container');
	for (i = 0; i < 81; i++)
		container.append(document.createElement("div"));
}
