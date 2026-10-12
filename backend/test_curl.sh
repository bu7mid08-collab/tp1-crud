#!/bin/bash
# Test manuel des 5 opérations CRUD avec curl (le backend doit tourner sur :8000)
API=http://localhost:8000
JSON="Content-Type: application/json"

echo "1) AJOUTER"
REP=$(curl -s -X POST $API/products -H "$JSON" \
  -d '{"name":"Souris","description":"Souris sans fil","price":19.5,"quantity":20}')
echo "$REP"
ID=$(echo "$REP" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "2) LISTE";     curl -s $API/products; echo
echo "3) CONSULTER"; curl -s $API/products/$ID; echo
echo "4) MODIFIER";  curl -s -X PUT $API/products/$ID -H "$JSON" \
  -d '{"name":"Souris","description":"Souris sans fil","price":15,"quantity":18}'; echo
echo "5) SUPPRIMER"; curl -s -o /dev/null -w "HTTP %{http_code}\n" -X DELETE $API/products/$ID
echo "Vérification : "; curl -s -o /dev/null -w "GET après suppression -> HTTP %{http_code}\n" $API/products/$ID
