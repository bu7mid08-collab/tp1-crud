#!/bin/bash
# Lance PostgreSQL, le backend (port 8000) et le frontend (port 5173) : ./start.sh
cd "$(dirname "$0")"

sudo service postgresql start

trap 'kill 0' EXIT

(cd backend && ./venv/bin/uvicorn main:app --reload --port 8000) &
sleep 3
(cd frontend && npm run dev) &

echo ""
echo "Backend  : http://localhost:8000/docs"
echo "Frontend : http://localhost:5173"
echo "Ctrl+C pour tout arrêter"
wait
