class Town {
  constructor(name, size, x, y, population) {
    this.name = name;
    this.size = size;
    this.population = population;
    this.x = x;
    this.y = y;
    this.left = this.x - this.size / 2;
    this.top = this.y - this.size / 2;
    this.right = this.x + this.size / 2;
    this.bottom = this.y + this.size / 2;
  }
}

export default Town;
