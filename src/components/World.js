import Emitter from './Emitter';
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

    this.epochTarget = 10;
    this.epochActual = 0;

    this.running = false;
    this.population = [];
    this.towns = [];
    this.uninfected = 0;
    this.infected = 0;
    this.immune = 0;
    const dtg = new Date();
    this.epochActual = dtg.getTime();
    // this.createPopulation();
    // this.calcStats();
  }

  addTown(name, size, x, y, population) {
    const town = new Town(name, size, x, y, population);
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
        const person = new Person(this.population.length, this);
        const x = utils.randBetween(town.left, town.right);
        const y = utils.randBetween(town.top, town.bottom);
        person.setLocation(x, y);
        person.setSpeed();
        person.setRadius(6);
        this.population.push(person);
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
          const dx = person1.x - person2.x;
          const dy = person1.y - person2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < radius) {
            // console.log(`collision between ${person1.key} and ${person2.key}`);
            person1.contactWith(person2);
          }
        }
      });
    });
  }

  updatePopulation(elapsed) {
    this.population.forEach(person => {
      person.update(elapsed);
    });
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
