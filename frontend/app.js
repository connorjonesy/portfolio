const API_URL = window.location.hostname === "localhost"
	? "http://localhost:8000"
	: "https://facebook.com" // my production site
//-----------------------Not Sudoku---------------------------

let section = document.getElementById('dynamic_section');
let wrapper = document.getElementById('wrapper');

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
				wrapper.classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == work_link) {
		fetch('work.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				wrapper.classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == blog_link) {
		fetch('blog.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				wrapper.classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == contact_link) {
		fetch('contact.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				wrapper.classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == sudoku_link) {
		fetch('sudoku.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				makeGrid();
				wrapper.classList.add('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
}

wrapper.addEventListener('click', function(e) {
	if (e.target.classList.contains('login_btns')) {
		on_login(e);
	}
});

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

function on_login(e) {
	let l_form = document.getElementById('login_form');
	let r_form = document.getElementById('register_form');
	if (e.target.id == 'login_btn') {
		l_form.style.display = 'block';
		r_form.style.display = 'none';
	}

	if (e.target.id == 'register_btn') {
		l_form.style.display = 'none';
		r_form.style.display = 'block';
	}
}

function hide_login_forms() {
	const login_div = document.getElementById('login_div');
	login_div.style.display = 'none';
}

document.getElementById("login_form").addEventListener("submit", async (e) => {
	e.preventDefault();  // stops the page from reloading

	const username = document.getElementById("username_login").value;
	const password = document.getElementById("pw_login").value;

	const response = await fetch(`${API_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password })
	});

	if (response.ok) {
		const data = await response.json();
		localStorage.setItem("token", data.access_token); //store the JWT
		//Start a timer..
		hide_login_forms();
		// Need to call the Sudoku API from here somehow...
	} else {
		const error = await response.json();
		console.error(error.detail);
	}
});


document.getElementById("register_form").addEventListener("submit", async (e) => {
	e.preventDefault();  // stops the page from reloading

	const username = document.getElementById("username_reg").value;
	const password = document.getElementById("pw_reg").value;
	const email = document.getElementById("email_reg").value;

	const response = await fetch(`${API_URL}/users`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, email, password })
	});

	if (response.ok) {
		const data = await response.json();
		localStorage.setItem("token", data.access_token); //store the JWT
		hide_login_forms();
		//Start a timer..
		// Need to call the Sudoku API from here somehow...
	} else {
		const error = await response.json();
		console.error(error.detail);
	}
});
