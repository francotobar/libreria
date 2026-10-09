# Librería API

API REST para gestionar una biblioteca de libros, desarrollada con Node.js,
Express y MySQL. Proyecto individual realizado en la Tecnicatura Universitaria
en Desarrollo de Aplicaciones Informáticas (IUA).

## Tecnologías
- Node.js
- Express
- MySQL

## Requisitos
- Node.js instalado
- MySQL instalado y en funcionamiento

## Instalación
1. Clona el repositorio y entra en la carpeta del proyecto.
2. Instala las dependencias: `npm install`
3. Crea la base de datos ejecutando el script `database.sql` en MySQL.
4. Copia `.env.example` como `.env` y completa tus datos de conexión.
5. Inicia la API: `npm start`

La API quedará disponible en `http://localhost:3000`.

## Endpoints

| Método | Ruta          | Descripción                  |
|--------|---------------|------------------------------|
| GET    | /libros       | Lista todos los libros       |
| GET    | /libros/:id   | Busca un libro por su ID     |
| POST   | /libros       | Agrega un libro              |
| PUT    | /libros/:id   | Modifica un libro existente  |
| DELETE | /libros/:id   | Elimina un libro             |

Los datos que se envían en POST y PUT son: [campos del libro, por ejemplo título y autor].
