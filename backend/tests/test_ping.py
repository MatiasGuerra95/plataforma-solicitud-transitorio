def test_ping(client):
    res = client.get("/ping")
    assert res.status_code == 200
    assert res.json["message"] == "pong"
