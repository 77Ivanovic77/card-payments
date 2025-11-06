# Payments Practice - Complete Bundle

Para correr la aplicación debes seguir los siguientes pasos:

1. Iniciar el servicio PostgreSQL via Docker:
   docker-compose up -d

2. Darle permisos de escritura al archivo bundle.sh (este es un scrip que va a construir y correr el aplicativo)
   chmod +x bundle.sh

4. Ejecutar el Script   
   ./bundle.sh

5. El aplicativo va a estar corriendo en
   Access: https://localhost:8443

Notes:
* La BD no tiene datos, para poder acceder tendrás que creear un usuario ADMIN y otro USER con la colección de postman que adjunto.
* Para poder crear los usuarios el backend ya debe estar corriendo.
* La API que crea los usuario se encuentran en la siguiente ruta:   GenerateUsersBD -> RegiterUser   GenerateUsersBD -> RegiterAdmin
* Una ves creado los usuarios podras loguearte al sistema.

