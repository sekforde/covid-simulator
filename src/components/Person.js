import Emitter from './Emitter';
import Point from './Point';
// import Line from './Line';
import utils from './utils';

class Person extends Emitter {
  constructor(key, type, world) {
    super();
    this.world = world;
    this.status = 'uninfected';
    this.type = type || 'normal';
    this.key = key;
    this.location = new Point();
    this.destination = new Point();
    this.velocity = new Point();
    this.origin = new Point();
    this.pointer = new Point();
    this.distance = 0;
    this.bearing = 0;
    this.originAngle = 0;
    this.speed = 0;
    this.cycleLength = utils.randBetween(10, 20);
    this.shoppingFrequency = utils.randBetween(3, this.cycleLength / 2);
    this.travelFrequency = utils.randBetween(3, this.cycleLength);
    this.cycle = 0;

    this.radius = world.radius || 3;
    this.maxDistance = world.maxDistance || 100;
    this.maxSpeed = world.maxSpeed || 100;
    this.infectionLength = world.infectionLength || 10000;
    this.deathRate = world.deathRate || 0;
  }

  distanceFrom(person2) {
    return this.location.distanceFrom(person2.location);
  }

  setRadius(r) {
    this.radius = r;
  }

  setRandomDestination() {
    const distance = utils.randBetween(-this.maxDistance / 2, this.maxDistance / 2);
    const bearing = utils.randBetween(0, 360);
    const destination = new Point();
    destination.set(this.origin);
    destination.add(
      distance * Math.cos(utils.deg2rad(bearing)),
      distance * Math.sin(utils.deg2rad(bearing))
    );
    this.travelTo(destination);
  }

  goToAShop() {
    const townName = this.town.name;
    const townShops = this.world.superSpreaders.filter(s => s.town.name === townName);
    const i = utils.randBetween(0, townShops.length - 1);
    const shop = townShops[i];
    this.travelTo(shop.location);
  }

  goToAnotherCity() {
    const towns = this.world.towns;
    const i = utils.randBetween(0, towns.length - 1);
    const townCentre = new Point();
    townCentre.set(towns[i]);
    this.travelTo(townCentre);
  }

  travelTo(destination) {
    this.destination.set(destination);
    this.distanceToDestination = this.location.distanceFrom(this.destination);
    this.originBearing = this.location.angleTo(this.origin);
    this.destinationBearing = this.location.angleTo(this.destination);
    this.drawBearingLine();
    this.setSpeed();
    const time = this.distanceToDestination / this.speed;

    setTimeout(() => {
      if (this.cycle === this.shoppingFrequency) {
        this.goToAShop();
      } else if (this.cycle === this.travelFrequency) {
        this.goToAnotherCity();
      } else {
        this.setRandomDestination();
      }
      this.cycle++;
      if (this.cycle > this.cycleLength) {
        this.cycle = 0;
      }
    }, time * 1200);
  }

  setSpeed() {
    this.speed = utils.randBetween(this.maxSpeed * 0.2, this.maxSpeed);
    this.velocity.x = this.speed * Math.cos(utils.deg2rad(this.destinationBearing));
    this.velocity.y = this.speed * Math.sin(utils.deg2rad(this.destinationBearing));
  }

  setOrigin(p) {
    this.location.set(p);
    this.origin.set(p);
    this.setOriginDirection();
  }

  setOriginDirection() {
    this.originBearing = this.location.angleTo(this.origin);
  }

  drawBearingLine() {
    const dx = this.speed * Math.cos(utils.deg2rad(this.destinationBearing));
    const dy = this.speed * Math.sin(utils.deg2rad(this.destinationBearing));
    this.pointer.set(this.location);
    this.pointer.add(dx, dy);
  }

  update(elapsed) {
    const dx = (elapsed / 1000) * this.velocity.x;
    const dy = (elapsed / 1000) * this.velocity.y;
    this.move(dx, dy);
    this.drawBearingLine();
  }

  move(dx, dy) {
    this.location.add(dx, dy, this.velocity.x);
    if (this.location.x < 0) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.location.x > this.world.width) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.location.y < 0) {
      this.velocity.y = -this.velocity.y;
    }
    if (this.location.y > this.world.height) {
      this.velocity.y = -this.velocity.y;
    }
    const dist = {
      x: this.location.x - this.origin.x,
      y: this.location.y - this.origin.y
    };
    this.distance = Math.sqrt(dist.x * dist.x + dist.y * dist.y);
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
    this.world.killMe(this);
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
