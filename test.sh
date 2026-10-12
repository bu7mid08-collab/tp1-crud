#!/bin/bash
# Lance les tests CRUD automatiques (PostgreSQL doit être démarré) : ./test.sh
cd "$(dirname "$0")/backend"
sudo service postgresql start
./venv/bin/pytest -v
