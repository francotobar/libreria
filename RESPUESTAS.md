1- Análisis del código 

Decisiones tomadas: 

Separación de la conexión a la base de datos (routes/bd.js) 
La conexión a MySQL se colocó separado y se exporta como módulo. Esto permite reutilizarla desde cualquier archivo sin repetir el código de configuración, además facilita si es necesario cambiar el código desde un solo lugar. 

Se utilizó mysql.createConnection() para establecer la conexión. 

El uso de Express como framework 

El uso de Express en lugar de utilizar el módulo http nativo de node, nos simplifica la definición de rutas y el manejo de métodos HTTP. Sin Express, estas tareas hubiesen requerido código manual mucho más extenso.  

Dentro de Express se usó express.Router() para definir las rutas en un archivo separado. Esto nos mantiene el código organizado y nos permite escalar el proyecto agregando nuevos routes sin modificar el archivo principal.  

También se utilizaron middlewares express.json() y express.urlencoded() para que Express pueda leer automáticamente el body de las requests en formato JSON 

 

ejecutarConsulta() con Promesas 

La función fue creada para envolver cada query en una promesa, ya que nos permite de esta forma usar async/await en todas las rutas, haciendo el código más limpio y fácil de mantener. 

Función de validación validarlibro() 

En lugar de repetir lógica de validación en el POST y el PUT, se creó una única función validarLibro() que recibe los datos y devuelve un array con los errores encontrados. Si el array esta vacío, los datos son válidos.  

Se validan todas las entradas de datos. Todos los campos son obligatorios. En el caso de título y autor deben ser strings no vacíos. Precio debe ser un número mayor que 0. Stock nunca puede ser un número negativo. 

Función validarId() 

Y en el caso de id, para las rutas que reciben por parámetro, se agregó la función validarId() que verifica que el valor recibido sea un número entero positivo. Sin esta validación, enviar un ID como ‘abc’ causaría un error no controlado en la base de datos 
Si existen errores, se devuelve el código 400 con el detalle de cada error para saber que corregir. 

Uso de parámetros preparados en las queries (?) 

Todas las consultas que reciben datos externos usan el símbolo ? Como placeholder, lo que delega el escapado de los valores al driver de MySQL. Esto previene ataques de inyección SQL, donde un usuario malintencionado podría enviar valores diseñados para alterar la consulta. 

Manejo de errores con try/catch y códigos HTTP semánticos 

Cada ruta está envuelta en un bloque try/catch. Si ocurre un error inesperado (como un problema con la base de datos), se responde con un código 500 y un mensaje genérico, sin exponer detalles internos del servidor. Además, se usaron códigos HTTP apropiados para cada situación. 

Respuesta con insertId al crear un libro 

Cuando se agrega un libro exitosamente, la respuesta incluye el id generado por MySQL para el nuevo registro. Esto es útil para que el cliente pueda utilizar ese ID inmediatamente para consultar o modificar el libro recién creado. 

 

Verificación de affectedRow en PUT y DELETE 

Después de ejecutar un UPDATE o DELETE se verifica si affectedRows es igual a 0. Si lo es significa que no existia ningún libro con ese ID, y se responde con 404. De esta forma, el cliente entiende que la operación no tuvo éxito.  

Los endpoints están detallados en el siguiente punto. 

a) Proponer al menos 5 rutas para la API. 

Por cada ruta indicar: 

método HTTP, 

URL, 

qué acción realiza. 

Método Ruta Acción 

GET /libros Obtener todos los libros 

GET /libros/:id Obtener un libro específico por su ID 

Post /libros Agregar un nuevo libro 

PUT /libros/:id Modificar los datos de un libro existente 

DELETE /libros/:id Eliminar un libro por su ID 

b) Explicar: 

cuál sería la diferencia entre: 

/libros 

/libros/5 

La diferencia es que /libros apunta al recurso colectivo, es decir, la lista completa de libros. Cuando se hace un GET ahí, la respuesta es todos los libros disponibles. En cambio la ruta /libros/5 apunta a un recurso específico. En este caso sería el libro con ID 5.  

c) Indicar: 

qué datos debería tener un libro en la base de datos. 
(Ejemplo: título, autor, precio, etc.) 

Campo Tipo Mysql Por qué 

Id int pk Identificador único 

Titulo VARCHAR(255) Nombre del libro 

Autor VARCHAR (255) Quién lo escribió 

Precio DECIMAL Valor del libro 

Stock INT Cantidad disponible en la librería 

 

 

a)¿Para qué sirve Express en una aplicación backend? 

En el backend, podemos decir que Express simplifica el manejo de rutas, permitiendo a quien desarrolla definir rutas de manera clara y sencilla. Al poder manejar el enrutamiento mediante URL, facilita la creación de rutas para manejar las distintas solicitudes. También nos facilita en la construcción de APIs, debido a que proporciona funciones para manejar solicitudes y respuestas JSON. Express proporciona flexibilidad en la elección de bases de datos ya que no impone una base de datos específica. Por último, no sólo nos ofrece una amplia gama de middleware que estan disponibles dentro del paquete de Node, si no que, nos ayuda a proteger las aplicaciones de amenazas comunes gracias a su compatilidad con Middlewares de seguridad. 

b)¿Qué ventaja aporta Nodemon durante el desarrollo? 

Nodemon nos aporta el reinicio automático del servidor. Sin tener que estar parando con Ctrl+C y volver a ejecutar con node ejemplo.js cada vez que se cambia algo en el código. Esto evita tareas manuales repetitivas. También nos permite configurar archivos ignorados para cuando no queremos que monitoree ciertos archivos como las pruebas o monitorear múltiples directorios. 
En palabras básicas utilizar Nodemon durante un proyecto nos permite enfocarnos en escribir código sin interrupciones.  

c)Explicar con palabras simples qué es un middleware. 

Un middleware en palabras simples es una función que se ejecuta antes que el servidor responda una petición.  
Un ejemplo práctico podría ser: 
1. Entramos a una tienda (Request) 
2. El seguridad nos revisa si podemos pasar (Middleware) 
3. Llegamos al mostrador (Ruta) 
4. Nos atienden (Response) 

d)Mencionar 2 middlewares que podrían ser útiles en este proyecto y explicar por qué. 

2 middlewares que podrían ser últiles para este proyecto serían:  
A- Express.json() -> Para poder recibir datos de libros. Con este middleware Node.js sabrá como leerlo. 

B- Middleware de validación -> Para validar que un libro tenga datos correctos. Por ejemplo que se ingrese el año de publicación con un valor negativo. 

 

3) Base de Datos y Seguridad (25 puntos) 

La librería detectó algunos problemas: 

algunos usuarios envían datos vacíos, 

otros escriben letras donde deberían ir números, 

y a veces la conexión a la base falla. 

El alumno deberá explicar: 

a)¿Por qué es importante validar datos antes de guardarlos? 

Validar los datos es asegurarnos que tengan el formato correcto antes de ser guardados. Por ejemplo, para evitar títulos vacíos o con un stock en –2. Esto nos evitará perder tiempo en consultas innecesarias. Si guardamos datos vacíos o con errores con letras donde deberían ir números luego no se pueden buscar bien los libros, las consultas fallan y los datos de esta forma pierden sentido. 

b)¿Qué controles básicos implementaría antes de insertar un libro en MySQL? 

Los controles básicos antes de insertar un libro en MYSQL son: 

Campos obligatorios -> Que los campos como título, autor o año no vengan vacíos. 

Tipo de dato -> Asegurarnos que precio o el año de publicación sean números válidos y no texto. También que sean valores coherentes como mayores o iguales a cero. 

c)¿Qué podría pasar si una aplicación no maneja errores de base de datos? 

Si la base de datos falla y no utilizamos bloques para el manejo de errores puede caer el servidor, lo cual detendrá por completo la aplicación. Por ende, ningún usuario podria usar la librería hasta que reiniciemos el servidor. Nuestro sistema quedaría vulnerable al mostrar estructuras internas o nombres de tablas provocando fuga de información, o el cliente podría estar esperando una respuesta de parte del servidor que nunca llegaría. 

d)¿Qué riesgos puede tener construir consultas SQL concatenando texto manualmente? 

Entre los errores más peligroso pueden ser:  

SQL injection: El mismo podría modificarla consulta y acceder a toda la base de datos. 

Borrado de datos: Un atacante podría ejecutar DELETE de tablas. 

Robo de información: Al acceder a la base de datos podrían extraer usuarios, contraseñas o datos privados. 

 

 

4) Análisis de Código Generado por IA (25 puntos) 

Suponga que una IA generó el siguiente código: 

app.post('/libros', (req, res) => { 
 
const titulo = req.body.titulo; 
 
connection.query( 
  "INSERT INTO libros (titulo) VALUES ('" + titulo + "')" 
); 
 
res.send("Libro agregado"); 
 
}); 
 

El alumno deberá: 

a)Identificar al menos 3 problemas o riesgos del código. 

Los problemas detectados son los siguientes:  

Vulnerabilidad a inyección SQL: Al concatenar directamente la variable titulo dentro de la cadena de texto de la consulta el código permite que un usuario manipule la consulta SQL pudiendo inyectar código malicioso. 

Ausencia de validación de datos: No se verifica si req.body.titulo existe o si viene vacío, o si es un tipo de dato de texto en este caso. 

Ausencia de manejo de errores: Si la base de datos falla, la API no responderá correctamente o podría romperse. 

b)Explicar: 

qué podría fallar, 

qué faltaría validar, 

y qué mejoraría. 


1- Podría fallar la conexión a MySQl  

2- El usuario puede enviar datos inválidos 

3- Puede ocurrir un ataque de SQL injection 

4- El INSERT puede fallar pero la API igual responde con éxito 

Podríamos validar:  
1- Que el título exita en el body o no venga vacío.

2- Que no ingrese un dato vacío 

3- Que el título sea un string en vez de un número. 

Personalmente mejoría: 

1- El manejo de errores de MySQL correctamente.  

2- Esperar el resultado de la consulta antes de responder.  

3- Validar entrada de usuario. 

4- Usar código de HTTP adecuado. 

5- Cambiar la concatenación por consultas preparadas. 

c)Proponer una versión mejorada o describir cómo la corregiría. 

A continuación, la descripción como la corregiría. 

En principio, implementar el uso de placeholder en lugar de concatenar la variable directamente en el string del INSERT. Al pasar el título como un parámetro independiente, el driver de la base de datos se encargaría de sanitizarlo, anulando por completo el riesgo de injección sql. 

En segundo lugar, transformar la función en Asíncrona. Teniendo en cuenta que las consultas a la base de datos toman tiempo, configuraría el manejador de la ruta como una función async. Usaría la palabra clave await antes de la consulta a la base de datos para obligar al código a esperar la respuesta de mysql antes de enviar cualquier mensaje al cliente. 
En tercer lugar, agregaría un bloque de manejo de errores. Envolviendo todo el proceso dentro de una estructura try/catch. 

Por último, corregiría la validación de datos de entrada. Ya que antes de enviar cualquier dato a la base de datos añadiría un condicional if para verificar que el título exista, que sea una cadena de texto y que no este vacía (Por supuesto verificando que los espacios en blanco). De esta forma, el código nos arrojaría un error 400 por un mal ingreso de datos. 