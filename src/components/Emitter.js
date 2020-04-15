class Emitter {
  constructor() {
    this.events = [];
  }

  on(eventName, fn) {
    this.events[eventName] = fn;
  }

  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName](data);
    }
  }
}

export default Emitter;
