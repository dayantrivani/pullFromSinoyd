<template>
  <!-- 雨水排放 -->
  <div class="mod-rainwater">
    <div class="left">
      <rain-port-statistical />
    </div>

    <div class="right">
      <section>
        <rain-discharge />
      </section>
      <section>
        <rain-about-discharge />
      </section>
      <section>
        <anomaly-discharge />
      </section>
    </div>

    <div class="center">
      <article class="number"></article>
      <article class="draw">
        <div class="title">工况图</div>
        <div class="content">
          <iframe
            frameborder="0"
            height="100%"
            width="100%"
            name="raindraw"
            src="./instance-mjht/storage/index.html"
          ></iframe>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import RainPortStatistical from './components/RainPortStatistical';
import RainDischarge from './components/RainDischarge';
import RainAboutDischarge from './components/RainAboutDischarge';
import AnomalyDischarge from './components/AnomalyDischarge';

export default {
  name: 'RainWater',
  components: {
    RainPortStatistical,
    RainDischarge,
    RainAboutDischarge,
    AnomalyDischarge,
  },
  data() {
    return {};
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
