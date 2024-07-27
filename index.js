const express = require(`express`);
const bodyParser = require("body-parser");
const db = require("./db");
const app = express();
const port = 3000;

// API sempre deve ter o formato de json para que o frontend consiga ler.

app.use(bodyParser.json());

// Rota 1 do back (rota principal)
app.get("/", (request, response) => {
  response.send("Produtos");
});

// Todos os produtos do banco
function getAllProducts() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM products", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
app.get("/products", async (request, response) => {
  const allProducts = await getAllProducts();

  response.send(allProducts);
});

// Para criar um novo produto
function createProducts(nome, preco, quantidade) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO products (nome, preco, quantidade) VALUES (?, ?, ?)",
      nome,
      preco,
      quantidade,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

app.post("/products", async (request, response) => {
  const { nome, preco, quantidade } = request.body;
  await createProducts(nome, preco, quantidade);
  response.send({
    message: "Success Product",
  });
});

// Para ver apenas o produto que contenha aquele ID
function getProductById(id) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM products where id=(?)", id, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
app.get("/products/:id", async (request, response) => {
  const { id } = request.params;
  const product = await getProductById(id);

  response.send(product);
});

// Para deletar o produto pelo ID
function deleteProduct(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM products WHERE id = (?)", id, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
app.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  await deleteProduct(id);

  response.send({
    message: "Delete product success",
  });
});

// Para editar o produto, seja ele pelo nome ou outros parametros.
function editProduct(id, nome, preco, quantidade) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE products SET nome = (?), preco = (?), quantidade = (?) where id = (?)",
      [nome, preco, quantidade, id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}
app.put("/products/:id", async (request, response) => {
  const { id } = request.params;
  const { nome, preco, quantidade } = request.body;
  await editProduct(id, nome, preco, quantidade);

  response.send({
    message: `Product ${id} updated`,
  });
});

// ouvir porta do computador
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
