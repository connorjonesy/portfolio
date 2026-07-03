def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_create_user(client):
    response = client.post("/users", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "secret123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "password" not in data
    assert "hashed_password" not in data # make sure neither field leaks !!
    assert "id" in data

def test_create_duplicate_user(client):
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "secret123"
    }
    client.post("/users", json=payload)
    response = client.post("/users", json=payload) # duplicate
    assert response.status_code == 409
    assert response.json()["detail"] == "User already exists"

def test_get_users_empty(client):
    response = client.get("/users")
    assert response.status_code == 200
    assert response.json() == []

def test_get_users_returns_created_user(client):
    client.post("/users", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "secret123"
    })
    response = client.get("/users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) == 1
    assert users[0]["username"] == "testuser"
    assert "password" not in users[0]
