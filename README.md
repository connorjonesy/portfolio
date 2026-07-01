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

**Dev Log**

In this project, I want to create a portfolio site that is both fun to work on and useful in learning web dev tools I don't usually use.

_yoga-bruno branch_

This branch is for the Bruno issue. I want to add Bruno so that I can manually test my API endpoints as I develop them. I have found in the past that I write out API files and then try and test them all in one-shot at the end; this method is prone to headache. 

Now I should be able to use Bruno (Which is pretty intuitive to use, I have found) to keep me in good health for API testing.

Why not postman?

Cute doggy. But also, I feel like Bruno is postman stripped of bloat.

* *bruno tips*

make sure bruno GUI has the local environment selected so bruno knows where to grab baseUrl
always start with a health check to confirm the connection
