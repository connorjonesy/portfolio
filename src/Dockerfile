#slim to keep the image size down
FROM python:3.12-slim 

#workin dir inside the container
WORKDIR /app

#only copy this file as a Docker caching optimization
COPY requirements.txt .

#run pip inside container to install dependencies
RUN pip install --no-cache-dir -r requirements.txt

#copy everything else, including the entrypoint for alembic upgrade head
COPY . .
RUN chmod +x alembic/docker-entrypoint.sh

ENTRYPOINT ["./alembic/docker-entrypoint.sh"]
CMD ["uvicorn", "admin.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
