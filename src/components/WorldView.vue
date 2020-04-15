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
      <br />
      <br />
      <CRow>
        <CCol sm="6">Infected Time</CCol>
        <CCol sm="6">
          <CInput v-model="settings.infectionLength" />
        </CCol>
      </CRow>
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
        <CCol sm="6">Radius</CCol>
        <CCol sm="6">
          <CInput v-model="settings.infectionRadius" />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="9">Show Infection Radius</CCol>
        <CCol sm="3">
          <CInputCheckbox v-model="settings.showInfectionRadius" />
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
            :cx="p.x"
            :cy="p.y"
            :r="settings.radius"
            :class="p.status"
          />
          <g v-if="settings.showInfectionRadius">
            <circle
              :id="`infection-${p.key}`"
              class="infection"
              v-for="p in population"
              :key="`${p.key}-infection`"
              :cx="p.x"
              :cy="p.y"
              :r="settings.infectionRadius"
            />
          </g>
          <g v-if="settings.showDirectionLine">
            <line
              v-for="p in population"
              :key="`${p.key}-direction`"
              :x1="p.lineX1"
              :y1="p.lineY1"
              :x2="p.lineX2"
              :y2="p.lineY2"
              class="origin-line"
            />
          </g>
          <g v-if="settings.showOrigin">
            <circle
              :id="`person-${p.key}-origin`"
              class="origin"
              v-for="p in population"
              :key="`${p.key}-origin`"
              :cx="p.originX"
              :cy="p.originY"
              :r="2"
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
      width: 1000,
      height: 800,
      populationSize: 200,
      radius: 3,
      world: null,
      towns: [],
      population: [],
      chartData: [],
      settings: {
        infectionLength: 10,
        deathRate: 0.04,
        maxDistance: 100,
        maxSpeed: 100,
        radius: 6,
        infectionRadius: 10,
        showDirectionLine: false,
        showOrigin: false,
        showInfectionRadius: true
      }
    };
  },
  created() {
    // const worldSettings = {
    //   settings: this.settings,
    //   width: this.width,
    //   height: this.height,
    //   populationSize: this.populationSize
    // };
    // const world = new World(worldSettings);
    // // const london =
    // world.addTown('London', 400, 750, 250, 50);
    // // const edinburgh =
    // world.addTown('Edinburgh', 300, 200, 600, 25);
    // world.createPopulation();
    // this.world = world;
    // this.towns = world.towns;
    // this.population = world.population;
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
    populate() {
      const worldSettings = {
        settings: this.settings,
        width: this.width,
        height: this.height,
        populationSize: this.populationSize
      };
      const world = new World(worldSettings);
      // const london =
      world.addTown('London', 400, 750, 250, 50);
      // const edinburgh =
      world.addTown('Edinburgh', 300, 200, 600, 25);
      world.createPopulation();
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
  grid-template-columns: 300px auto;
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
</style>
