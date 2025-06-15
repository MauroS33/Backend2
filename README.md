# Backend2
Proyecto Backend - eccomerce 4bros

Este es un proyecto de uso real para una pagina de ecommerce que estoy ideando y con un poco de suerte pueda lanzar al mercado en breve.

1. Tecnologías Principales
Node.js y Express.js : Se utilizó Node.js como entorno de ejecución y Express.js como framework para construir la API RESTful del servidor backend. Esto permitió manejar solicitudes HTTP de manera eficiente y modular.
MongoDB y Mongoose : La base de datos MongoDB fue elegida por su flexibilidad y escalabilidad, mientras que Mongoose se utilizó como ODM para interactuar con la base de datos de forma estructurada.
JWT (JSON Web Tokens) : Para la autenticación y autorización de usuarios, se implementó JWT, asegurando una gestión segura de tokens y roles de usuario.
Nodemailer : Se integró Nodemailer para habilitar el envío de correos electrónicos, como confirmaciones de compra o restablecimiento de contraseñas

2. Arquitectura y Patrones de Diseño
Patrón Repository : Se aplicó el patrón Repository para separar la lógica de acceso a datos de la lógica de negocio. Esto mejora la modularidad y facilita las pruebas unitarias.
Middleware de Autorización : Se implementaron middlewares personalizados para verificar roles de usuario (admin y user), asegurando que solo los usuarios autorizados puedan acceder a ciertas rutas.
Logs con Winston : Se configuró Winston para registrar eventos importantes, como errores, compras realizadas o intentos fallidos de autenticación, lo que facilita la depuración y el monitoreo del sistema 

3. Herramientas de Desarrollo
Git y GitHub : Se utilizó Git para el control de versiones y GitHub como repositorio remoto, permitiendo un flujo de trabajo colaborativo y organizado.
Postman : Para probar las rutas y endpoints de la API, se utilizó Postman, asegurando que todas las funcionalidades funcionaran correctamente antes del despliegue.
Variables de Entorno : Todas las configuraciones sensibles, como claves secretas y credenciales de correo, se almacenaron en un archivo .env para mejorar la seguridad y la portabilidad del proyecto 

4. Prácticas de Código
Modularidad : El código fue organizado en capas claras (controladores, servicios, repositorios) para mejorar la legibilidad y mantenibilidad.
Validación de Datos : Se implementaron validaciones tanto en el frontend como en el backend para garantizar la integridad de los datos ingresados por los usuarios.
Manejo de Errores : Se incluyó un sistema de manejo de errores robusto para capturar y responder adecuadamente a situaciones inesperadas.

5. Metodología de Trabajo
Desarrollo Incremental : El proyecto se desarrolló siguiendo un enfoque incremental, donde cada funcionalidad (como autenticación, carrito de compras y tickets) se implementó y probó de manera independiente antes de integrarse al sistema completo.
Pruebas Unitarias y de Integración : Se realizaron pruebas unitarias y de integración para validar el correcto funcionamiento de los módulos individuales y su interacción con otros componentes.