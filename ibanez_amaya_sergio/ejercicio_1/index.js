import express from "express";

const app = express();
const port = 3001;

// Para interpretar body como JSON
app.use(express.json());

// Arreglo interno con los datos esenciales del rectangulo
let rectangulos = [
  { id: 1, base: 4, altura: 4 },
  { id: 2, base: 6, altura: 3 },
  { id: 3, base: 5, altura: 2 },
];

let nextId = 4;

// Valida que la medida sea un numero positivo
function validarMedida(valor) {
  return typeof valor === "number" && !isNaN(valor) && valor > 0;
}

// Arma la respuesta con los datos derivados
function representarRectangulo(rectangulo) {
  const esCuadrado = rectangulo.base === rectangulo.altura;
  return {
    id: rectangulo.id,
    base: rectangulo.base,
    altura: rectangulo.altura,
    esCuadrado: esCuadrado,
    tipo: esCuadrado ? "cuadrado" : "rectangulo",
    perimetro: 2 * (rectangulo.base + rectangulo.altura),
    superficie: rectangulo.base * rectangulo.altura,
  };
}

// GET para listar rectangulos con filtro opcional por tipo
app.get("/rectangulos", (req, res) => {
  let rectangulosFiltrados = [...rectangulos];

  const tipo = req.query.tipo;
  if (tipo) {
    if (tipo !== "cuadrado" && tipo !== "rectangulo") {
      return res.status(400).send("Tipo invalido. Use 'cuadrado' o 'rectangulo'");
    }
    rectangulosFiltrados = rectangulosFiltrados.filter((r) =>
      tipo === "cuadrado" ? r.base === r.altura : r.base !== r.altura,
    );
  }

  res.send(rectangulosFiltrados.map(representarRectangulo));
});

// GET para entregar detalle de un rectangulo
app.get("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID invalido");
  }

  const rectangulo = rectangulos.find((r) => r.id === id);
  if (!rectangulo) {
    return res.status(404).send("Rectangulo no encontrado");
  }

  res.send(representarRectangulo(rectangulo));
});

// POST para crear un rectangulo
app.post("/rectangulos", (req, res) => {
  const { base, altura } = req.body;

  if (!validarMedida(base) || !validarMedida(altura)) {
    return res.status(400).send("Base y altura deben ser numeros positivos");
  }

  const nuevoRectangulo = {
    id: nextId++,
    base,
    altura,
  };

  rectangulos.push(nuevoRectangulo);

  res.status(201).send(representarRectangulo(nuevoRectangulo));
});

// PUT para modificar un rectangulo a partir de un id
app.put("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID invalido");
  }

  const rectanguloEncontrado = rectangulos.find((r) => r.id === id);
  if (!rectanguloEncontrado) {
    return res.status(404).send("Rectangulo no encontrado");
  }

  const { base, altura } = req.body;
  if (!validarMedida(base) || !validarMedida(altura)) {
    return res.status(400).send("Base y altura deben ser numeros positivos");
  }

  rectanguloEncontrado.base = base;
  rectanguloEncontrado.altura = altura;

  res.send(representarRectangulo(rectanguloEncontrado));
});

// DELETE para quitar un rectangulo a partir de un id
app.delete("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID invalido");
  }

  const rectanguloEncontrado = rectangulos.find((r) => r.id === id);
  if (!rectanguloEncontrado) {
    return res.status(404).send("Rectangulo no encontrado");
  }

  rectangulos = rectangulos.filter((r) => r.id !== id);

  res.send(rectanguloEncontrado);
});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`);
});