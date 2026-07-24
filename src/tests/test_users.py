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

def test_login(client):
    response = client.post("/users", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "secret123"
    })
    assert response.status_code == 201
    login = client.post("/auth/login", json={
        "username": "testuser",
        "password": "secret123"
    })
    assert login.status_code == 200
    token = login.json()["access_token"]
    me = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["id"] == response.json()["id"]

def test_login_wrong_password(client):
    client.post("/users", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "secret123"
    })
    login = client.post("/auth/login", json={
        "username": "testuser",
        "password": "wrongpassword"
    })
    assert login.status_code == 401

def test_get_me_no_token(client):
    response = client.get("/users/me")
    assert response.status_code == 401
