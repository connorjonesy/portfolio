//-----------------------Not Sudoku---------------------------

let section = document.getElementById('dynamic_section');

//Links
let about_me_link = document.getElementById('link1');
let work_link = document.getElementById('link2');
let blog_link = document.getElementById('link3');
let contact_link = document.getElementById('link4');
let sudoku_link = document.getElementById('link5');

about_me_link.addEventListener('click', on_link_click);
work_link.addEventListener('click', on_link_click);
blog_link.addEventListener('click', on_link_click);
contact_link.addEventListener('click', on_link_click);
sudoku_link.addEventListener('click', on_link_click);

function on_link_click(e) {
	if (e.currentTarget == about_me_link) {
		fetch('abme.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				document.getElementById('wrapper').classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == work_link) {
		fetch('work.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				document.getElementById('wrapper').classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == blog_link) {
		fetch('blog.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				document.getElementById('wrapper').classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == contact_link) {
		fetch('contact.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				document.getElementById('wrapper').classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == sudoku_link) {
		fetch('sudoku.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				makeGrid();
				document.getElementById('wrapper').classList.add('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
}

//-----------------------Sudoku---------------------------

function makeGrid() {
	let container = document.getElementById('sud_container');
	for (let i = 0; i < 81; i++) {
		let cell = document.createElement("div");
		cell.classList.add("sud_cell");
		cell.dataset.row = Math.floor(i / 9);
		cell.dataset.col = i % 9;
		container.append(cell);
	}
}
