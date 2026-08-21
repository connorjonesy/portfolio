/*
const API_URL = window.location.hostname === "localhost"
	? "http://localhost:8000"
	: "" // prod
*/
const API_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
	? "http://localhost:8000"
	: "https://portfolio-api-5w8p.onrender.com"  // my Render URL :) yay
//const API_URL = "http://localhost:8000";
const SUD_API = "https://sudoku-api.vercel.app/api/dosuku"

//-----------------------Not Sudoku---------------------------

//globals
let section = document.getElementById('dynamic_section');
let wrapper = document.getElementById('wrapper');
let container;
let timerInterval;
let elapsedSeconds;
let sud_board = [];
let loggedIn = false;

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
				//herowrapper.classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == work_link) {
		fetch('work.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				//herowrapper.classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == blog_link) {
		fetch('blog.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				//herowrapper.classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == contact_link) {
		fetch('contact.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				//herowrapper.classList.remove('sudoku-active');
			})
			.catch(error => console.log('Error loading section: ', error));
	}
	if (e.currentTarget == sudoku_link) {
		fetch('sudoku.html')
			.then(response => response.text())
			.then(html => {
				section.innerHTML = html;
				let herowrapper = document.getElementById('herowrapper');
				makeGrid();
				herowrapper.classList.add('sudoku-active');
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
	container = document.getElementById('sud_container');
	for (let i = 0; i < 81; i++) {
		let cell = document.createElement("div");
		cell.classList.add("sud_cell");
		cell.dataset.row = Math.floor(i / 9);
		cell.dataset.col = i % 9;
		cell.tabIndex = 0; //lets the element be focusable
		cell.focus(); // ensures it can receive keydown
		cell.style.color = 'white';
		cell.addEventListener('keydown', (e) => {
			if (e.key.valueOf() >= 1 && e.key.valueOf() <= 9) {
				cell.textContent = e.key;
				on_puzzle_input();
			}
		});
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

/* setInterval(func, delay) 
 * func is executed every delay milliseconds
*/
function start_timer() {
	let elapsedSeconds = 0;
	timerInterval = setInterval(() => {
		elapsedSeconds++;
	}, 1000);
}

function stop_timer() {
	clearInterval(timerInterval)
	timerInterval = null
	return elapsedSeconds
}

document.addEventListener("submit", async (e) => {
	if (e.target.id === "login_form") {
		e.preventDefault()
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
			loggedIn = true;
			hide_login_forms();
			console.log("Login has worked");
			const puzzle = await fetch_puzzle();
			render_puzzle(puzzle);
			start_timer();
		} else {
			const error = await response.json();
			console.error(error.detail);
		}
	}
	if (e.target.id === "register_form") {
		e.preventDefault()
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
			loggedIn = true;
			hide_login_forms();
			console.log("Register has worked");
			const puzzle = await fetch_puzzle();
			render_puzzle(puzzle);
			start_timer();
		} else {
			const error = await response.json();
			console.error(error.detail);
		}
	}
});

async function fetch_puzzle() {
	const response = await fetch(`${SUD_API}?query={newboard(limit:1){grids{value}}}`);
	const data = await response.json();
	//console.log(data.newboard.grids[0].value[0][0])
	return data
}

function render_puzzle(puzzle) {
	parsed = [];
	for (i = 0; i < 9; i++) { //9 boxes
		for (j = 0; j < 9; j++) { //9 vals
			parsed.push(puzzle.newboard.grids[0].value[i][j]);
		}
	}
	const cells = document.querySelectorAll(".sud_cell");
	cells.forEach((cell, index) => {
		if (parsed[index] != 0)
			cell.textContent = parsed[index];
	});
}

function get_board() {
	const cells = document.querySelectorAll(".sud_cell");
	cells.forEach(cell => {
		sud_board.push(cell.textContent);
	});
	return sud_board;
}

async function verifySolution() {
	//const token = localStorage.getItem("token");
	const userSolution = get_board();

	const solution = await fetch(`${SUD_API}?query={newboard(limit:1){grids{solution}}}`);
	const data = await solution.json();
	//console.log(data.newboard.grids[0].solution[0][0])
	parsed = [];
	for (i = 0; i < 9; i++) { //9 boxes
		for (j = 0; j < 9; j++) { //9 vals
			parsed.push(data.newboard.grids[0].solution[i][j]);
		}
	}
	console.log("User Sol");
	console.log(userSolution);
	console.log("Sol");
	console.log(parsed);

	for (i = 0; i < 81; i++) {
		if (parsed[i] == userSolution[i])
			return false;
	}
	return true;
}

function displayStatusMsg(status) {
	let status_msg_0 = document.getElementById('status_msg_0');
	let status_msg_1 = document.getElementById('status_msg_1');
	if (status == 0)
		status_msg_0.style.display = 'block';
	if (status == 1)
		status_msg_1.style.display = 'block';
}

async function on_puzzle_input() {
	if (loggedIn && isPuzzleComplete()) {
		const correct = await verifySolution();

		if (correct) {
			const time = stop_timer();
			displayStatusMsg(1);
			console.log("Time is: ", time);
			//await postToLeaderboard(time); //TODO leaderboard, see readme
		} else {
			console.log("else block");
			displayStatusMsg(0);
		}
	}
}

function isPuzzleComplete() {
	const cells = document.querySelectorAll(".sud_cell");
	return [...cells].every(cell => cell.textContent !== "");
}
