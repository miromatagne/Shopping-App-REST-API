import axios from "axios";
import Interval from "./Interval.js";
import config from "./config.js";

const PORT = process.env.PORT || config.defaultPort;

const registry = axios.create({
  baseURL: config.defaultRegistryBaseUrl,
});

/**
 * Registra el componente del carrito al Service Registry
 */
async function _register() {
  try {
    await registry.put(
      `/register/${config.serviceName}/${config.serviceVersion}/${PORT}`
    );
  } catch (error) {
    console.error(error);
  }
}

let db_component = null;

/**
 * Llama al Service Registry para obtener la dirección IP y el puerto del
 * componente que gestiona la base de datos.
 * @returns el servidor que corresponde al componente que gestiona la base de datos,
 *          o "null" si hay un error
 */
async function findDBComponent() {
  try {
    const response = await registry.get(
      `/find/${config.dbName}/${config.dbVersion}`
    );
    console.log(response.data);

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
 * Devuelve el componente que gestiona la base de datos.
 * @returns el componente que gestiona la base de datos
 */
async function getDBComponent() {
  if (db_component) {
    return db_component;
  }

  return (db_component = await findDBComponent());
}

let interval = new Interval(_register, config.registryInterval);

export default {
  register: () => {
    interval.start();
  },
  unregister: () => {
    interval.stop();
  },
  getDBComponent,
};
