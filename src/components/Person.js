import Emitter from './Emitter';
import utils from './utils';

class Person extends Emitter {
  constructor(key, world) {
    super();
    this.world = world;
    this.status = 'uninfected';
    this.key = key;
    this.vx = 0;
    this.vy = 0;
    this.x = 0;
    this.y = 0;
    this.originX = 0;
    this.originY = 0;
    this.distance = 0;
    this.bearing = 0;
    this.originAngle = 0;

    this.radius = world.radius || 3;
    this.maxDistance = world.maxDistance || 100;
    this.maxSpeed = world.maxSpeed || 100;
    this.infectionLength = world.infectionLength || 10000;
    this.deathRate = world.deathRate || 0;

    this.setDirection();
    this.setSpeed();
    this.setNewDirection();
    setInterval(() => {
      if (this.world.running) {
        this.setNewDirection();
      }
    }, utils.randBetween(1000, 5000));
  }

  setRadius(r) {
    this.radius = r;
  }

  setLocation(x, y) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.setDirection();
  }

  setOriginDirection() {
    this.originBearing = utils.getBearing(this.x, this.y, this.originX, this.originY);
  }

  setDirection() {
    this.bearing = utils.randBetween(0, 360);
    this.drawBearingLine();
  }

  setNewDirection() {
    let distanceIndex = (this.distance / this.maxDistance) ** 2;
    if (distanceIndex > 1) {
      distanceIndex = 1;
    }

    this.setOriginDirection();

    // restrict the range of movement the further away from the origin
    const spread = 360 * (1 - distanceIndex);
    const startAngle = this.originBearing - spread / 2;
    const endAngle = this.originBearing + spread / 2;
    this.bearing = utils.randBetween(startAngle, endAngle);

    this.setSpeed();
  }

  setSpeed() {
    this.speed = utils.randBetween(1, this.maxSpeed);
    this.vx = this.speed * Math.cos(utils.deg2rad(this.bearing));
    this.vy = this.speed * Math.sin(utils.deg2rad(this.bearing));
    this.drawBearingLine();
  }

  drawBearingLine() {
    const dx = this.speed * Math.cos(utils.deg2rad(this.bearing));
    const dy = this.speed * Math.sin(utils.deg2rad(this.bearing));
    this.lineX1 = this.x;
    this.lineY1 = this.y;
    this.lineX2 = this.lineX1 + dx;
    this.lineY2 = this.lineY1 + dy;
  }

  update(elapsed) {
    const dx = (elapsed / 1000) * this.vx;
    const dy = (elapsed / 1000) * this.vy;
    this.move(dx, dy);
    this.setOriginDirection();
    this.drawBearingLine();
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    if (this.x < 0) {
      this.vx = -this.vx;
    }
    if (this.x > this.world.width) {
      this.vx = -this.vx;
    }
    if (this.y < 0) {
      this.vy = -this.vy;
    }
    if (this.y > this.world.height) {
      this.vy = -this.vy;
    }
    const distX = this.x - this.originX;
    const distY = this.y - this.originY;
    this.distance = Math.sqrt(distX * distX + distY * distY);
  }

  infect() {
    this.infectionTime = new Date();
    this.status = 'infected';
    // console.log(this.key, 'infected');
    // this.world.onInfected(this);
    setTimeout(() => {
      this.immune();
    }, this.infectionLength);
  }

  immuneOrDeath() {
    if (Math.random() < this.deathRate) {
      this.death();
    } else {
      this.immune();
    }
  }

  death() {
    console.log('died');
    this.status = 'dead';
  }

  immune() {
    this.immuneTime = new Date();
    this.status = 'immune';
  }

  contactWith(otherPerson) {
    const contactCase = `${this.status}-${otherPerson.status}`;
    switch (contactCase) {
      case 'uninfected-infected':
        this.infect();
        break;
      case 'infected-uninfected':
        otherPerson.infect();
        break;
      default:
    }
  }
}

export default Person;
