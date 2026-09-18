import express from "express";

const app = express();
const port = 3003;

// Para interpretar body como JSON
app.use(express.json());

// Arreglo interno con los datos de la tarea
let tareas = [
  { id: 1, nombre: "Instalar Node", completada: true },
  { id: 2, nombre: "Clonar el repositorio", completada: true },
  { id: 3, nombre: "Hacer el ejercicio 1", completada: false },
  { id: 4, nombre: "Hacer el ejercicio 2", completada: false },
];

let nextId = 5;

// Valida que el nombre sea un texto no vacio
function validarNombre(nombre) {
  return typeof nombre === "string" && nombre.trim() !== "";
}

// Valida que completada sea un booleano
function validarCompletada(completada) {
  return typeof completada === "boolean";
}

// Detecta nombre repetido ignorando mayusculas y espacios
function nombreRepetido(nombre, excluirId = null) {
  const nombreProlijo = nombre.trim().toLowerCase();
  return tareas.some(
    (t) => t.id !== excluirId && t.nombre.trim().toLowerCase() === nombreProlijo,
  );
}

// Arma la respuesta con el estado en texto para facilitar la lectura
function representarTarea(tarea) {
  return {
    id: tarea.id,
    nombre: tarea.nombre,
    completada: tarea.completada,
    estado: tarea.completada ? "completada" : "pendiente",
  };
}

// GET para entregar listado de tareas con filtro por estado
app.get("/tareas", (req, res) => {
  // Copio arreglo original
  let tareasFiltradas = [...tareas];

  const estado = req.query.estado;
  if (estado) {
    if (estado !== "completada" && estado !== "pendiente") {
      return res.status(400).send("Estado invalido. Use 'completada' o 'pendiente'");
    }
    tareasFiltradas = tareasFiltradas.filter((t) =>
      estado === "completada" ? t.completada : !t.completada,
    );
  }

  res.send(tareasFiltradas.map(representarTarea));
});

// GET para entregar detalle de una tarea
app.get("/tareas/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id (solo si es un numero positivo)
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID invalido");
  }

  // Verificar que este presente la tarea
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return res.status(404).send("Tarea no encontrada");
  }

  res.send(representarTarea(tarea));
});

// POST para crear una tarea
app.post("/tareas", (req, res) => {
  // Extraigo del body los atributos de la nueva tarea
  const { nombre, completada } = req.body;

  // Validar los atributos de body
  if (!validarNombre(nombre)) {
    return res.status(400).send("Nombre invalido");
  }
  // Si no envian completada, la tarea nace pendiente
  const estadoInicial = completada === undefined ? false : completada;
  if (!validarCompletada(estadoInicial)) {
    return res.status(400).send("Completada debe ser true o false");
  }

  // Verificar que no exista una tarea con el mismo nombre
  if (nombreRepetido(nombre)) {
    return res.status(409).send("Ya existe una tarea con ese nombre");
  }

  // Creo una nueva tarea
  const nuevaTarea = {
    id: nextId++,
    nombre: nombre.trim(),
    completada: estadoInicial,
  };

  // Agrego la tarea al arreglo
  tareas.push(nuevaTarea);

  res.status(201).send(representarTarea(nuevaTarea));
});

// PUT para modificar una tarea a partir de un id (reemplazo completo)
app.put("/tareas/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID invalido");
  }

  // Verificar que este presente la tarea
  const tareaEncontrada = tareas.find((t) => t.id === id);
  if (!tareaEncontrada) {
    return res.status(404).send("Tarea no encontrada");
  }

  // Validar el body
  const { nombre, completada } = req.body;
  if (!validarNombre(nombre)) {
    return res.status(400).send("Nombre invalido");
  }
  if (!validarCompletada(completada)) {
    return res.status(400).send("Completada debe ser true o false");
  }
  if (nombreRepetido(nombre, id)) {
    return res.status(409).send("Ya existe otra tarea con ese nombre");
  }

  // Modificar la tarea
  tareaEncontrada.nombre = nombre.trim();
  tareaEncontrada.completada = completada;

  res.send(representarTarea(tareaEncontrada));
});

// PATCH para modificar parcialmente una tarea, por ejemplo marcarla completada
app.patch("/tareas/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID invalido");
  }

  // Verificar que este presente la tarea
  const tareaEncontrada = tareas.find((t) => t.id === id);
  if (!tareaEncontrada) {
    return res.status(404).send("Tarea no encontrada");
  }

  // Validar el body: al menos un campo para modificar
  const { nombre, completada } = req.body;
  if (nombre === undefined && completada === undefined) {
    return res.status(400).send("Debe enviar nombre o completada para modificar");
  }
  if (nombre !== undefined && !validarNombre(nombre)) {
    return res.status(400).send("Nombre invalido");
  }
  if (completada !== undefined && !validarCompletada(completada)) {
    return res.status(400).send("Completada debe ser true o false");
  }
  if (nombre !== undefined && nombreRepetido(nombre, id)) {
    return res.status(409).send("Ya existe otra tarea con ese nombre");
  }

  // Modificar solo los campos enviados
  if (nombre !== undefined) {
    tareaEncontrada.nombre = nombre.trim();
  }
  if (completada !== undefined) {
    tareaEncontrada.completada = completada;
  }

  res.send(representarTarea(tareaEncontrada));
});

// DELETE para quitar una tarea a partir de un id
app.delete("/tareas/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID invalido");
  }

  // Verificar que este presente la tarea
  const tareaEncontrada = tareas.find((t) => t.id === id);
  if (!tareaEncontrada) {
    return res.status(404).send("Tarea no encontrada");
  }

  // Quitar del arreglo
  tareas = tareas.filter((t) => t.id !== id);

  // Retornar tarea quitada
  res.send(tareaEncontrada);
});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`);
});