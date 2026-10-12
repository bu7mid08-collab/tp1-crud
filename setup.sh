#!/bin/bash
# Installation complète dans WSL2 Ubuntu (à lancer une seule fois) : ./setup.sh
set -e
cd "$(dirname "$0")"

echo "==> Installation des paquets système (mot de passe sudo demandé)"
sudo apt update
sudo apt install -y postgresql postgresql-contrib python3 python3-venv python3-pip curl

if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 18 ]; then
  echo "==> Installation de Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

echo "==> Démarrage de PostgreSQL"
sudo service postgresql start
sleep 3

echo "==> Création de l'utilisateur et de la base"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='tp1user'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER tp1user WITH PASSWORD 'tp1pass';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='tp1db'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE tp1db OWNER tp1user;"

echo "==> Backend : environnement virtuel + dépendances"
cd backend
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt
cd ..

echo "==> Frontend : npm install"
cd frontend
npm install
cd ..

echo ""
echo "Installation terminée. Lancez maintenant : ./start.sh"
