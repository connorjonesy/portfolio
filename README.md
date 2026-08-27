# Portfolio

**Build Notes**

* When changing a model 

might need to change db url with localhost instead of db

```
alembic revision --autogenerate -m "describe the change"
```

* when adding dependency to requirements.txt 

```
docker compose up --build
```

* when spinning up the dev environment

```
source venv/bin/activate
docker compose up
```

Then, Append url provided by uvicorn with /health or /docs to confirm everything is groovy

* whence a change is made to pytest requirements

```
pip install -r src/requirements-dev.txt
```

* after a bunch of crazy changes
```
ruff check src/
```

**Dev Log**

In this project, I want to create a portfolio site that is both fun to work on and useful in learning web dev tools I don't usually use.

_bruno_

I want to add Bruno so that I can manually test my API endpoints as I develop them. I have found in the past that I write out API files and then try and test them all in one-shot at the end; this method is prone to headache. 

Now I should be able to use Bruno (Which is pretty intuitive to use, I have found) to keep me in good health for API testing.

Why not postman?

Cute doggy. But also, I feel like Bruno is postman stripped of bloat.

*bruno_tips*

make sure bruno GUI has the local environment selected so bruno knows where to grab baseUrl
always start with a health check to confirm the connection
copy and paste the access token from login when testing get-me

*pytest*

Now for some automated regression. Some key things to note here: Added a requirements-dev file as my local environment requirements in order to run pytest, also each test gets its own sqlite db test.db. I've git ignored it because its not important really, its just a sqlite database that stores data for my pytests to use

Now the CI runner obviously can't access my .env file, so I am going to add my super secret key to the github secrets of this repo. In my head, I'm thinking, isn't that kinda unsafe?? And the answer is yes! Since this is just for my development environment / CI environment... and this is a small project with few real users.. I guess its ok. But personally I like the idea of least privilege, each env only has access to what it needs. So Im writing this down to make a mental note to definitely generate a fresh key when it comes time to deploy, but for now this is fine.

*frontend*
Hot reloaded frontend? Not in this environment. I feel like 2 Dockerfiles in the same project is the 8th sin. Therefore, while developing, I am using the tried and true method of opening up VScode and running the live server plugin on my index.html file. But dont worry, Im not actually coding in that editor. I will still be developing in nvim. VScode has a vim plugin but its just not the same...


Sudoku
* Learned something new: Every HTML element has a classList property because html elements can have multiple classes. classList is a DOMTokenList that comes with methods like add, remove, toggle, contains etc. 
* I went with the add method for the sudoku link click target and remove method for all other pages. It doesn't look like any errors are thrown when removing something that isn't there, so, I think it works!
* Also learned querySelectorAll returns a NodeList, which does **not** have an addEventListener method. This means it's imperative to loop thru each element in the list and add it to its own event listener.
* Storing JWT in localStorage because this website is pretty low traffic low stakes. With a real data-intensive site I would need to do something different
* Added some allowed origins into the .env so I can test the frontend workflows connecting to the API in the dev environment and eventually the prod environemnt
* CSS square brackets for attributes. cool


small UI overlay for login overtop the board
logging in or pressing play triggers our API. API generates 26 numbers and positions for the board. API also has a verify function. we display the numbers and let the player play client side. Once the last number is played, call the API verify function and repeat until game over

Daily leaderboard and second tab for all-time leaderboard

alembic migration would include new table for all time scores related to a user
+ a daily time for the original table methinks (user table)

Order of changes should be:
1. Login Overlay -> connect to backend -> verify login functionality
2. Leaderboard UI -> Sudoku frontend logic
3. Write sudoku algorithm in rest api
4. connect frontend backend logic

Sudoku frontend logic basically complete
- last thing, need to write logic to not overwrite the API positions.
- ill do this after I build the endpoints though
Need a leaderboard UI and need to build out the sudoki API in the backend

Ideas for sudoku puzzle generator:
Idea 1: 26 random numbers [0,9], verify_its_legal(), repeat until True.
verify_its_legal would be basically the same as verify, except it makes fewer comparisons
a given position would need to check its column, row, and 3x3 square.

the positions in the kv pair are from 0 to 80 (DOUBLE CHECK THATS SAME AS THE JS)
note that the response will be a list of string,int pairs


UPDATE im not rolling my own solution anymore. Wow that was hard
just using a simple external api for now
can proxy requests thru backend later

TODO write here about how backtracking alg is maybe required for making the sudoku api so for now just calling a random one

TODO now: write leaderboard logic!! woohooo!!
TODO later or now: Firebase host

Leaderboard thoughts
Im thinking we should leave the leaderboard for later. For now we just can let the user play sudoku.
need to:
* make a HTML list that displays the username and score(time to solve)
  * this is for Daily scores only for now. Future potential is to list all time scores but... idk
  * scratch that list top 10 all time, i have no users
  * list can just be top 10 (i have no users, so)
* backend API endpoint POST to leaderboard.
* backend API endpoint GET full leaderboard
* change the DB... need to do the first big migration... adding 1 row to the users table that tracks daily score. I think this is all we need for now, because hopefully there is a way to query the DB with SQL Alchemy that allows us to get all users with a daily_score and sort them, then we spit this out of the GET full leaderboard endpoint
* JS calls postToLeaderboard function which does exactly that
* else JS tells user keep trying cuz theyre solution is wrong

FLOW:
1. if sol is correct, postToLeaderboard(time, something to identify the user [JWT?])
2. postToLeaderboard calls API
3. API posts score to the user in the DB. Once successful, it sends back the leaderboard. maybe change this to a GET then.
4. frontend gets the ledaerboard back and pushes it into the HTML


more logs

Im taking out the removal of the sudoku active classList from the on link click event listeners.
This is because its not actually necessary, I found out the hard way after struggling with debugging this. The active class is applied to a stale reference (index.html's initial herowrapper element), but the  section is rebuilt with each html fragment being grabbed on link click. So as long as we apply it to one, it has no affect on the others.

I removed the event listener from the cells for the hint cells. First time ive ever used it before. I didnt even know it was a thing until I was like wait can I remove an event listener. Works well!
In order to do this, I had to remove the inline event listener declaration.


PUT LEADERBOARD ON THE RIGHT HAND SIDE OF BOARD NOW@!
