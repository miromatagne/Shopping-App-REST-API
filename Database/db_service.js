import { MongoClient } from "mongodb";

const DATABASE = "stock";

const uri =
  "mongodb+srv://user:pssw0rd7@database-cl0.ns16z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

export default {
  /**
   * Devuelve un producto de la base de datos a partir de su nombre
   * @param {string} name - el nombre del producto
   * @returns
   */
  getProductByName: async (name) => {
    try {
      await client.connect();

      const db = client.db("stock");
      const products = db.collection("products");

      const result = await products.findOne({ name });
      return result;
    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
  },
};
