# TP1 — Application CRUD Full Stack (WSL2 Ubuntu)

Gestion de produits : ajouter, lister, consulter, modifier, supprimer.

| Couche | Technologie |
|---|---|
| Frontend | React 18 + Vite (port 5173) |
| Backend | FastAPI + SQLAlchemy (port 8000) |
| Base de données | PostgreSQL |

## Structure
```
tp1-crud/
├── backend/    # API REST FastAPI (main.py, models.py, schemas.py, database.py, tests/)
├── frontend/   # Interface React (src/App.jsx, src/api.js)
├── setup.sh    # installation (une seule fois)
├── start.sh    # lancement de tout
└── test.sh     # tests CRUD automatiques
```

## Lancer le projet (dans le terminal Ubuntu de WSL2)
Copiez le dossier dans votre home Linux (pas dans /mnt/c, c'est plus lent), par exemple :
```bash
cp -r /mnt/c/Users/VOTRE_NOM/Downloads/tp1-crud ~/tp1-crud
cd ~/tp1-crud
sed -i 's/\r$//' *.sh backend/*.sh   # si le zip a été extrait sous Windows
chmod +x *.sh backend/*.sh
```
1. Installation (une fois) : `./setup.sh`
2. Lancement : `./start.sh`
3. Ouvrir dans le navigateur Windows :
   - Application : http://localhost:5173
   - Documentation de l'API (Swagger) : http://localhost:8000/docs

`Ctrl+C` arrête tout. Au prochain démarrage de WSL, relancez simplement `./start.sh`
(il redémarre PostgreSQL).

## Endpoints REST
| Méthode | URL | Action |
|---|---|---|
| POST | /products | Ajouter |
| GET | /products | Liste |
| GET | /products/{id} | Consulter |
| PUT | /products/{id} | Modifier |
| DELETE | /products/{id} | Supprimer |

## Tests des opérations CRUD
- Automatiques (pytest, sur la vraie base) : `./test.sh`
- Avec curl (backend démarré) : `./backend/test_curl.sh`
- À la main : http://localhost:8000/docs (bouton "Try it out")
- Vérifier les données dans la base :
  ```bash
  sudo -u postgres psql -d tp1db -c "SELECT * FROM products;"
  ```

## Base de données
Créée par `setup.sh` : base `tp1db`, utilisateur `tp1user`, mot de passe `tp1pass`
(modifiable dans `backend/.env`). La table `products` est créée automatiquement au
démarrage du backend.

## Problèmes fréquents
- **`sudo service postgresql start` échoue** : vérifiez que vous êtes bien sous WSL2 (`wsl -l -v`).
- **"Impossible de joindre le backend"** dans l'interface : le backend n'est pas lancé, ou le port 8000 est occupé.
- **`bad interpreter` / `\r`** sur les .sh : exécutez `sed -i 's/\r$//' *.sh backend/*.sh`.
- **Port 5173 inaccessible depuis Windows** : essayez http://127.0.0.1:5173.
