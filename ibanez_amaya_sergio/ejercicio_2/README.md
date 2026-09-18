Ejercicio 2-API de Alumnos
Datos guardados
Solo guardo nombre y notas en el arreglo. El promedio y la condicion se calculan cada vez que se consultan, asi nunca quedan desactualizados si cambio las notas.

Nombre unico
Comparo nombres sin distinguir mayusculas, asi "Ana Garcia" y "ana garcia" cuentan como iguales. Devuelve error 409 si intento crear o modificar con un nombre que ya existe.

Notas validadas
Exijo exactamente 3 notas, todas entre 0 y 10. Si no, devuelvo error 400.

Promedio y condicion
Calculo el promedio de las 3 notas y segun el valor determino la condicion:
Menor a 6: reprobado
De 6 a menos de 8: aprobado
8 o mas: promocionado

Filtros
Puedo filtrar el listado por condicion (reprobado/aprobado/promocionado) o buscar por nombre parcial.
Codigos de respuesta
201: creado exitosamente
400: datos invalidos
404: alumno no encontrado
409: nombre repetido