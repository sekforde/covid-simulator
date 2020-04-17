<template>
  <div class="layout">
    <span class="options">
      <h1>Covid Simulation</h1>
      <br />
      <CRow>
        <CCol sm="12">
          <CButton class="m-2" color="primary" size="sm" @click="populate">Populate</CButton>
          <CButton class="m-2" color="success" size="sm" @click="start">Start</CButton>
          <CButton class="m-2" color="info" size="sm" @click="stop">Stop</CButton>
          <CButton class="m-2" color="danger" size="sm" @click="infect">Infect</CButton>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="12">
          <CButton class="m-2" color="info" size="sm" @click="preset('high')">High Movement</CButton>
          <CButton class="m-2" color="info" size="sm" @click="preset('lockdown')">Lockdown</CButton>
        </CCol>
      </CRow>
      <br />
      <br />
      <CRow>
        <CCol sm="6">Infected Time</CCol>
        <CCol sm="6">
          <CInput v-model="settings.infectionLength" />
        </CCol>
      </CRow>
      <!-- <CRow>
        <CCol sm="6">Population Size</CCol>
        <CCol sm="6">
          <CInput v-model="populationSize" />
        </CCol>
      </CRow>-->
      <CRow>
        <CCol sm="6">Max Distance</CCol>
        <CCol sm="6">
          <CInput v-model="settings.maxDistance" />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">Max Speed</CCol>
        <CCol sm="6">
          <CInput v-model="settings.maxSpeed" />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">Radius</CCol>
        <CCol sm="6">
          <CInput v-model="settings.radius" />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">Contagion Radius</CCol>
        <CCol sm="6">
          <div class="p10">
            <CInput v-model="settings.infectionRadius" />
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="9">Show Destination</CCol>
        <CCol sm="3">
          <div class="p10">
            <input type="checkbox" v-model="settings.showDestination" />
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="9">Show Direction Line</CCol>
        <CCol sm="3">
          <div class="p10">
            <input type="checkbox" v-model="settings.showDirectionLine" />
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="9">Show Home Base</CCol>
        <CCol sm="3">
          <div class="p10">
            <input type="checkbox" v-model="settings.showOrigin" />
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="9">Show Infection Radius</CCol>
        <CCol sm="3">
          <div class="p10">
            <input type="checkbox" v-model="settings.showInfectionRadius" />
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="12">
          <br />
          <br />
          <table class="table">
            <tbody>
              <tr>
                <td>Uninfected</td>
                <td>{{uninfected}}</td>
              </tr>
              <tr>
                <td>Infected</td>
                <td>{{infected}}</td>
              </tr>
              <tr>
                <td>Immune</td>
                <td>{{immune}}</td>
              </tr>
              <tr>
                <td>Dead</td>
                <td>{{dead}}</td>
              </tr>
            </tbody>
          </table>
        </CCol>
      </CRow>

      <span class="chart-container">
        <!-- <InfectionChart :chart-data="chartData"></InfectionChart> -->
      </span>
    </span>
    <span class="container">
      <svg id="world" :width="width" :height="height">
        <g>
          <rect
            class="town"
            v-for="t in towns"
            :key="`${t.name}-town`"
            :x="t.left"
            :y="t.top"
            :width="t.size"
            :height="t.size"
          />
          <circle
            :id="`person-${p.key}`"
            class="particle"
            v-for="p in population"
            :key="`${p.key}-person`"
            :cx="p.location.x"
            :cy="p.location.y"
            :r="settings.radius"
            :class="`${p.status} ${p.type}`"
          />
          <g v-if="settings.showInfectionRadius">
            <circle
              :id="`infection-${p.key}`"
              class="infection"
              v-for="p in population"
              :key="`${p.key}-infection`"
              :cx="p.location.x"
              :cy="p.location.y"
              :r="settings.infectionRadius"
            />
          </g>
          <g v-if="settings.showDirectionLine">
            <line
              v-for="p in normalPopulation"
              :key="`${p.key}-direction`"
              :x1="p.location.x"
              :y1="p.location.y"
              :x2="p.pointer.x"
              :y2="p.pointer.y"
              class="origin-line"
            />
          </g>
          <g v-if="settings.showOrigin">
            <circle
              :id="`person-${p.key}-origin`"
              class="origin"
              v-for="p in normalPopulation"
              :key="`${p.key}-origin`"
              :cx="p.origin.x"
              :cy="p.origin.y"
              :r="2"
            />
          </g>
          <g v-if="settings.showDestination">
            <circle
              class="destination"
              v-for="p in normalPopulation"
              :key="`${p.key}-destination`"
              :cx="p.destination.x"
              :cy="p.destination.y"
              :r="5"
            />
          </g>
        </g>
      </svg>
    </span>
  </div>
</template>

<script>
import World from './World';
// import InfectionChart from './InfectionChart.vue';

export default {
  name: 'WorldView',
  props: {
    msg: String
  },
  components: {
    // InfectionChart
  },
  data() {
    return {
      width: 1400,
      height: 800,
      // populationSize: 200,
      radius: 3,
      world: null,
      towns: [],
      population: [],
      chartData: [],
      settings: {
        infectionLength: 10,
        deathRate: 0.2,
        maxDistance: 100,
        maxSpeed: 100,
        radius: 6,
        infectionRadius: 10,
        showDestination: false,
        showDirectionLine: false,
        showOrigin: false,
        showInfectionRadius: false
      }
    };
  },
  computed: {
    normalPopulation() {
      return this.population.filter(p => p.type === 'normal');
    },
    infected() {
      return this.world ? this.world.infected : 0;
    },
    uninfected() {
      return this.world ? this.world.uninfected : 0;
    },
    immune() {
      return this.world ? this.world.immune : 0;
    },
    dead() {
      return this.world ? this.world.dead : 0;
    }
  },
  methods: {
    start() {
      this.world.start();
    },
    stop() {
      this.world.stop();
    },
    infect() {
      this.world.infectSomeone();
    },
    preset(name) {
      if (name === 'high') {
        this.settings.infectionLength = 10;
        this.settings.deathRate = 0.04;
        this.settings.maxDistance = 150;
        this.settings.maxSpeed = 150;
        this.settings.radius = 6;
        this.settings.infectionRadius = 15;
        this.populate();
      }
      if (name === 'lockdown') {
        this.settings.infectionLength = 10;
        this.settings.deathRate = 0.04;
        this.settings.maxDistance = 15;
        this.settings.maxSpeed = 25;
        this.settings.radius = 6;
        this.settings.infectionRadius = 8;
        this.populate();
      }
    },
    populate() {
      const worldSettings = {
        settings: this.settings,
        width: this.width,
        height: this.height
        // populationSize: this.populationSize
      };
      const world = new World(worldSettings);

      world.addTown({
        name: 'London',
        size: 400,
        x: 750,
        y: 250,
        population: 50,
        superSpreaderCount: 4
      });

      world.addTown({
        name: 'Edinburgh',
        size: 300,
        x: 200,
        y: 600,
        population: 25,
        superSpreaderCount: 2
      });

      world.createPopulation();
      world.createSuperSpreaders();

      this.world = world;
      this.towns = world.towns;
      this.population = world.population;
    }
  }
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: auto 1400px;
}
.chart-container {
  padding: 50px;
}
.container {
  float: left;
}
circle.particle {
  fill: white;
  stroke: none;
}
circle.origin {
  fill: green;
}
rect.town {
  stroke: white;
  fill: none;
}
svg {
  background-color: black;
}
circle.super-spreader {
  stroke: greenyellow;
  stroke-width: 4px;
}
circle.infected {
  fill: red;
}
circle.uninfected {
  fill: white;
}
circle.immune {
  fill: green;
}
circle.dead {
  fill: grey;
}
.chart-container {
  float: left;
  width: 400px;
  height: 400px;
}
line.origin-line {
  stroke: white;
  stroke-width: 1px;
}
circle.infection {
  fill: none;
  stroke: red;
  stroke-width: 1px;
}
circle.destination {
  fill: pink;
}
.p10 {
  padding: 10px;
}
</style>
