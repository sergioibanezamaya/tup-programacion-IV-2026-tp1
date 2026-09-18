Ejercicio 3-API de Tareas

API para administrar tareas y su estado de avance. Permite crear tareas, marcarlas como completadas o pendientes, y filtrarlas por estado.

Decisiones de diseño
Datos guardados
Solo guardo id, nombre y un booleano que indica si la tarea esta completada. El campo estado que muestro en las respuestas (completada/pendiente) se calcula a partir del booleano, no se guarda aparte.

Nombre unico
Comparo nombres sin distinguir mayusculas ni espacios. Si intento crear o modificar con un nombre que ya existe, devuelvo error 409.

Estado de avance
El estado real es el booleano completada. Para ver solo tareas completadas o solo pendientes, uso un filtro por query (?estado=completada o ?estado=pendiente). Si el valor no es valido, devuelvo error 400.

Modificar tareas
Uso dos metodos distintos:
PUT: reemplaza toda la tarea (nombre y estado obligatorios)
PATCH: cambia solo lo que envio (puedo marcar como completada sin reenviar el nombre)
Esto es util porque la operacion mas comun es cambiar el estado, no el nombre.

Codigos de respuesta
201: tarea creada
400: datos invalidos
404: tarea no encontrada
409: nombre repetido