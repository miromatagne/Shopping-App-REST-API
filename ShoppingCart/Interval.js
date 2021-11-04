/**
 * Clase que maneja los intervalos de tiempo cuando hay que registrarse
 * al Service Registry
 */
class Interval {
  constructor(funct, seconds) {
    this._funct = funct;
    this._seconds = seconds;
    this._interval = null;
  }

  //Se registra una vez al Service Registry al inicio, y a cada intervalo de tiempo
  //regular después
  start() {
    this._funct();
    this._interval = setInterval(this._funct, this._seconds * 1000);
  }

  stop() {
    clearInterval(this._interval);
  }
}

export default Interval;
