/**
 * Clase que representa un carrito de la compra
 */
class ShoppingCart {
  /**
   * Un carrito contiene un id y un objeto que contiene todos los productos del carrito
   * @param {int} id
   */
  constructor(id = 0) {
    this._id = id;
    this.products = {};
  }

  /**
   * Añade un producto al carrito
   * @param {object} product
   */
  addProduct(product) {
    if (this.products[product.name]) {
      this.products[product.name].stock++;
    } else {
      this.products[product.name] = {};
      Object.assign(this.products[product.name], product);
      this.products[product.name].stock = 1;
    }
  }

  /**
   * Retira un producto del carrito
   * @param {string} name
   * @returns {boolean} indica si se ha realizado la eliminación del producto o no
   */
  removeProduct(name) {
    if (this.products[name]) {
      this.products[name].stock--;

      if (this.products[name].stock == 0) {
        delete this.products[name];
        return true;
      }
    }
    return false;
  }

  /**
   * Devuelve el número de productos 'name' que tiene el carrito
   * @param {string} name
   * @returns número de productos 'name'
   */
  getProductAmount(name) {
    return this.products[name]?.stock || 0;
  }

  /**
   * Crea un string que describe el contenido del carrito
   * @returns un string que decribe el contenido del carrito
   */
  toString() {
    let str = "Shopping Cart: [";

    if (Object.keys(this.products).length == 0) {
      str += "]";
      return str;
    }

    Object.keys(this.products).forEach((key) => {
      str += `${this.products[key].name} x${this.products[key].stock}, `;
    });

    str = str.substr(0, str.length - 2);
    str += "]";

    return str;
  }
}

export default ShoppingCart;
