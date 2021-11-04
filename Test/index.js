import axios from "axios";

const registry = axios.create({
  baseURL: "http://localhost:3000",
});

const productNames = [
  "naranja",
  "mosto",
  "helado",
  "tomate",
  "macarrones",
  "pollo",
  "judia",
];

/**
 * Llama al Service Registry para encontrar el componente que gestiona el carrito
 * @returns el componente que gestiona el carrito
 */
async function findShoppingCartComponent() {
  try {
    const response = await registry.get("/find/shopping-cart/1.0.0");

    if (response.data instanceof Object) {
      return axios.create({
        baseURL: `http://${response.data.ip}:${response.data.port}`,
      });
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Hace un test de los diferentes componentes del proyecto.
 * Añade y quita varios productos del carrito.
 */
async function run() {
  const SCComponent = await findShoppingCartComponent();

  if (!SCComponent) {
    console.log("Shopping Cart Component could not be found.");
    return;
  }

  //Añade diferentes productos al carrito
  for (let i = 0; i < productNames.length; i++) {
    const resp = await SCComponent.post(`/${productNames[i]}`);
    console.log(`Adding ${productNames[i]}: ${resp.data.content}`);
  }

  let strShoppingCart = (await SCComponent.get("/")).data.content;
  console.log(strShoppingCart);

  //Quita todos los componentes del carrito
  for (let i = 0; i < productNames.length; i++) {
    const resp = await SCComponent.delete(`/${productNames[i]}`);
    console.log(`Removing ${productNames[i]}: ${resp.data.content}`);
  }

  strShoppingCart = (await SCComponent.get("/")).data.content;
  console.log(strShoppingCart);
}

function main() {
  run();
}

main();
