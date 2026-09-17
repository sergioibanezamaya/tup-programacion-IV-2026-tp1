import express from "express";

const app = express();
const port = 3002;

// Para interpretar body como JSON
app.use(express.json());

// Arreglo interno con los datos del alumno
let alumnos = [
  { id: 1, nombre: "Juan Perez", notas: [8, 9, 7] },
  { id: 2, nombre: "Maria Gomez", notas: [6, 7, 6] },
  { id: 3, nombre: "Sofia Lopez", notas: [4, 6, 3] },
];

let nextId = 4;

// Calculo el promedio de las tres notas
function calcularPromedio(notas) {
  return (notas[0] + notas[1] + notas[2]) / 3;
}

// Calculo la condicion academica segun el promedio
function calcularCondicion(promedio) {
  if (promedio < 6) {
    return "reprobado";
  }
  if (promedio < 8) {
    return "aprobado";
  }
  return "promocionado";
}

// GET para entregar listado de alumnos con promedio y condicion
app.get("/alumnos", (req, res) => {
  // Copio arreglo original
  let alumnosFiltrados = [...alumnos];

  const condicion = req.query.condicion;
  if (condicion) {
    if (
      condicion !== "reprobado" &&
      condicion !== "aprobado" &&
      condicion !== "promocionado"
    ) {
      return res.status(400).send("Condicion invalida");
    }
    alumnosFiltrados = alumnosFiltrados.filter(
      (a) => calcularCondicion(calcularPromedio(a.notas)) === condicion,
    );
  }

  const alumnoNombre = req.query.alumnoNombre;
  if (alumnoNombre) {
    alumnosFiltrados = alumnosFiltrados.filter((a) =>
      a.nombre.toLowerCase().includes(alumnoNombre.toLowerCase()),
    );
  }

  res.send(
    alumnosFiltrados.map((a) => {
      const promedio = calcularPromedio(a.notas);
      return {
        id: a.id,
        nombre: a.nombre,
        notas: a.notas,
        promedio: Math.round(promedio * 100) / 100,
        condicion: calcularCondicion(promedio),
      };
    }),
  );
});

// GET para entregar las notas de un alumno con promedio y condicion
app.get("/alumnos/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id (solo si es un numero positivo)
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID invalido");
  }

  // Verificar que este presente el alumno
  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) {
    return res.status(404).send("Alumno no encontrado");
  }

  // Calculo promedio y condicion, que son datos derivados
  const promedio = calcularPromedio(alumno.notas);

  res.send({
    id: alumno.id,
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio: Math.round(promedio * 100) / 100,
    condicion: calcularCondicion(promedio),
  });
});

// POST para crear un alumno
app.post("/alumnos", (req, res) => {
  // Extraigo del body los atributos del nuevo alumno
  const { nombre, notas } = req.body;

  // Validar los atributos de body
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).send("Nombre invalido");
  }
  if (!Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).send("El alumno debe tener tres notas");
  }
  for (const nota of notas) {
    if (typeof nota !== "number" || isNaN(nota) || nota < 0 || nota > 10) {
      return res.status(400).send("Las notas deben ser numeros entre 0 y 10");
    }
  }

  // Verificar que no exista un alumno con el mismo nombre
  const repetido = alumnos.find(
    (a) => a.nombre.toLowerCase() === nombre.trim().toLowerCase(),
  );
  if (repetido) {
    return res.status(409).send("Ya existe un alumno con ese nombre");
  }

  // Creo un nuevo alumno
  const nuevoAlumno = {
    id: nextId++,
    nombre: nombre.trim(),
    notas,
  };

  // Agrego el alumno al arreglo
  alumnos.push(nuevoAlumno);

  // Envio respuesta con los datos derivados
  const promedio = calcularPromedio(nuevoAlumno.notas);
  res.status(201).send({
    id: nuevoAlumno.id,
    nombre: nuevoAlumno.nombre,
    notas: nuevoAlumno.notas,
    promedio: Math.round(promedio * 100) / 100,
    condicion: calcularCondicion(promedio),
  });
});

// PUT para modificar un alumno a partir de un id
app.put("/alumnos/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID invalido");
  }

  // Verificar que este presente el alumno
  const alumnoEncontrado = alumnos.find((a) => a.id === id);
  if (!alumnoEncontrado) {
    return res.status(404).send("Alumno no encontrado");
  }

  // Validar el body
  const { nombre, notas } = req.body;
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).send("Nombre invalido");
  }
  if (!Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).send("El alumno debe tener tres notas");
  }
  for (const nota of notas) {
    if (typeof nota !== "number" || isNaN(nota) || nota < 0 || nota > 10) {
      return res.status(400).send("Las notas deben ser numeros entre 0 y 10");
    }
  }

  // Verificar que no exista otro alumno con el mismo nombre
  const repetido = alumnos.find(
    (a) => a.id !== id && a.nombre.toLowerCase() === nombre.trim().toLowerCase(),
  );
  if (repetido) {
    return res.status(409).send("Ya existe otro alumno con ese nombre");
  }

  // Modificar el alumno
  alumnoEncontrado.nombre = nombre.trim();
  alumnoEncontrado.notas = notas;

  // Responder con alumno modificado y sus datos derivados
  const promedio = calcularPromedio(alumnoEncontrado.notas);
  res.send({
    id: alumnoEncontrado.id,
    nombre: alumnoEncontrado.nombre,
    notas: alumnoEncontrado.notas,
    promedio: Math.round(promedio * 100) / 100,
    condicion: calcularCondicion(promedio),
  });
});

// DELETE para quitar un alumno a partir de un id
app.delete("/alumnos/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID invalido");
  }

  // Verificar que este presente el alumno
  const alumnoEncontrado = alumnos.find((a) => a.id === id);
  if (!alumnoEncontrado) {
    return res.status(404).send("Alumno no encontrado");
  }

  // Quitar del arreglo
  alumnos = alumnos.filter((a) => a.id !== id);

  // Retornar alumno quitado
  res.send(alumnoEncontrado);
});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`);
});