import Emitter from './Emitter';
import Point from './Point';
import Person from './Person';
import Town from './Town';
import utils from './utils';

class World extends Emitter {
  constructor(opts = {}) {
    super();
    this.width = opts.width || 800;
    this.height = opts.height || 600;
    this.populationSize = opts.populationSize || 100;
    this.infectionRadius = opts.settings.infectionRadius || 10;
    this.radius = opts.settings.radius || 3;
    this.maxDistance = opts.settings.maxDistance || 100;
    this.maxSpeed = opts.settings.maxSpeed || 150;
    this.infectionLength = opts.settings.infectionLength * 1000 || 10000;
    this.deathRate = opts.settings.deathRate || 0;
    this.superSpreaders = [];

    this.epochTarget = 10;
    this.epochActual = 0;

    this.running = false;
    this.population = [];
    this.towns = [];
    this.uninfected = 0;
    this.infected = 0;
    this.immune = 0;
    this.dead = 0;

    const dtg = new Date();
    this.epochActual = dtg.getTime();
  }

  addTown(townOptions) {
    const town = new Town(townOptions);
    this.towns.push(town);
    return town;
  }

  infectSomeone() {
    const patientZeroIndex = utils.randBetween(0, this.population.length);
    const patientZero = this.population[patientZeroIndex];
    patientZero.infect();
    console.log('patient zero', patientZero.key);
  }

  createPopulation() {
    this.towns.forEach(town => {
      for (let p = 0; p < town.population; p++) {
        const person = new Person(this.population.length, 'normal', this);
        const pt = new Point(
          utils.randBetween(town.left, town.right),
          utils.randBetween(town.top, town.bottom)
        );
        person.setOrigin(pt);
        person.setRadius(6);
        person.setRandomDestination();
        person.town = town;
        this.population.push(person);
      }
    });
  }

  createSuperSpreaders() {
    this.towns.forEach(town => {
      for (let p = 0; p < town.superSpreaderCount; p++) {
        const person = new Person(this.population.length, 'super-spreader', this);
        const pt = new Point(
          utils.randBetween(town.left, town.right),
          utils.randBetween(town.top, town.bottom)
        );
        person.setOrigin(pt);
        person.setRadius(6);
        person.town = town;
        this.population.push(person);
        this.superSpreaders.push(person);
      }
    });
  }

  displayStats() {
    console.log(this.uninfected, this.infected, this.immune);
  }

  calcStats() {
    this.uninfected = this.population.filter(p => p.status === 'uninfected').length;
    this.infected = this.population.filter(p => p.status === 'infected').length;
    this.immune = this.population.filter(p => p.status === 'immune').length;
    this.displayStats();
    setTimeout(() => {
      this.calcStats();
    }, 5000);
  }

  update() {
    if (this.running) {
      // how much time has elapsed since the last update
      const elapsed = utils.getTime() - this.epochActual;

      // update the population
      this.updatePopulation(elapsed);
      this.calcContacts(this.infectionRadius);

      // set the last update time for the next cycle
      this.epochActual = utils.getTime();

      // cycle the loop
      setTimeout(() => {
        this.update();
      }, this.epochTarget);
    }
  }

  calcContacts(radius) {
    this.population.forEach(person1 => {
      this.population.forEach(person2 => {
        if (person1.key !== person2.key) {
          const distance = person1.distanceFrom(person2);
          if (distance < radius) {
            person1.contactWith(person2);
          }
        }
      });
    });
  }

  updatePopulation(elapsed) {
    this.population.forEach(person => {
      if (person.type === 'normal') {
        person.update(elapsed);
      }
    });
  }

  killMe(person) {
    const removeIndex = this.population
      .map(p => p.id)
      .indexOf(person.key);
    console.log(removeIndex);
    if (removeIndex > -1) {
      this.population.splice(removeIndex, 1);
    }
  }

  start() {
    this.epochActual = utils.getTime();
    this.running = true;
    this.update();
  }

  stop() {
    this.running = false;
  }

  // onInfected() {
  //   console.log(this.person.key);
  // }
}

export default World;
