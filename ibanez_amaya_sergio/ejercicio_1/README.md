Fundamentacion-Ejercicio 1

Modelado de datos
Guardo solo id, base y altura. El perimetro y la superficie los calculo en cada respuesta, no los almaceno, para evitar que queden desactualizados si modifico el rectangulo.

Identificacion
Uso un id numerico autoincremental para identificar cada rectangulo, asi puedo tener varios con las mismas medidas y las operaciones por URL son simples.

Cuadrados
Un rectangulo es cuadrado cuando base y altura son iguales. Agrego esCuadrado y tipo en la respuesta en vez de crear un recurso separado, porque un cuadrado es un caso particular de rectangulo.

Filtros
Uso ?tipo=cuadrado o ?tipo=rectangulo para filtrar en el GET de listado. Es mas flexible que tener rutas separadas y valido que el valor sea correcto (400 si mandan otra cosa).

Validaciones
Params (id): numero positivo, sino 400.
Query (tipo): cuadrado o rectangulo, sino 400.
Body (base y altura): numeros positivos, sino 400.
Codigos HTTP: 201 al crear, 404 si no existe, 400 si los datos son invalidos.