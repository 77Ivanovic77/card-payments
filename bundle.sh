#!/usr/bin/env bash
set -e
echo "Contruyendo frontend..."
(cd frontend && npm install && npm run build)
echo "Copiando y construyendo archivos backend..."
rm -rf backend/src/main/resources/static
mkdir -p backend/src/main/resources/static
#cp -r frontend/build/* backend/src/main/resources/static/
cp -r frontend/build/* backend/src/main/resources/static/
#echo "Bundle step complete. To run backend: (cd backend && ./mvnw spring-boot:run)"
echo "Construccion completa"
cd backend && ./mvnw spring-boot:run