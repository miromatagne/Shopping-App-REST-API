import express from "express";
import cors from "cors";
import axios from "axios";
import db from "./db_service.js";

const PORT = 8080;
const app = express();

app.use(cors());

function updateRegistry() {
  axios
    .put("http://localhost:3000/register/database/0.0.1/8080")
    .then((res) => {
      setTimeout(updateRegistry, 5000);
    })
    .catch((err) => console.log(err));
}

updateRegistry();

app.get("/checkStock", async (req, res) => {
  const productName = req.query.productName;
  console.log("Checking stock for product: " + productName);

  try {
    const product = await db.getProductByName(productName);
    res.status(200).send({ product });
  } catch (error) {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
