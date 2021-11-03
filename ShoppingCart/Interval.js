class Interval {
    constructor(funct, seconds) {
        this._funct = funct;
        this._seconds = seconds;
        this._interval = null;
    }

    start() {
        this._interval = setInterval(this._funct, this._interval * 1000);
    }

    stop() {
        clearInterval(this._interval);
    }
}