"""Tests CRUD sur la vraie base PostgreSQL (lancer depuis backend/ : pytest -v)."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
PRODUIT = {"name": "Clavier", "description": "Clavier mécanique", "price": 49.9, "quantity": 10}


def test_crud_complet():
    # 1. Ajouter
    r = client.post("/products", json=PRODUIT)
    assert r.status_code == 201
    created = r.json()
    pid = created["id"]
    assert created["name"] == "Clavier"

    # 2. Liste
    r = client.get("/products")
    assert r.status_code == 200
    assert any(p["id"] == pid for p in r.json())

    # 3. Consulter
    r = client.get(f"/products/{pid}")
    assert r.status_code == 200
    assert r.json()["price"] == 49.9

    # 4. Modifier
    r = client.put(f"/products/{pid}", json={**PRODUIT, "price": 39.9, "quantity": 5})
    assert r.status_code == 200
    assert r.json()["price"] == 39.9
    assert client.get(f"/products/{pid}").json()["quantity"] == 5

    # 5. Supprimer
    r = client.delete(f"/products/{pid}")
    assert r.status_code == 204
    assert client.get(f"/products/{pid}").status_code == 404


def test_erreurs():
    assert client.get("/products/999999").status_code == 404
    assert client.post("/products", json={"name": "", "price": -1}).status_code == 422
