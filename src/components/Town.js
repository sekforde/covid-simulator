class Town {
  constructor(town, world) {
    this.world = world;
    this.name = town.name;
    this.size = town.size;
    this.population = town.population;
    this.superSpreaderCount = town.superSpreaderCount;
    this.x = town.x;
    this.y = town.y;
    this.left = this.x - this.size / 2;
    this.top = this.y - this.size / 2;
    this.right = this.x + this.size / 2;
    this.bottom = this.y + this.size / 2;
  }
}

export default Town;
