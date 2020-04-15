<script>
import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  props: ['chartdata', 'options'],
  data() {
    return {
      data: {
        datasets: [
          {
            label: 'Uninfected',
            data: []
          }
        ]
      }
    };
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
  methods: {
    addPoint(point) {
      this.data.datasets[0].data.push(point);
    }
  }
};
</script>
