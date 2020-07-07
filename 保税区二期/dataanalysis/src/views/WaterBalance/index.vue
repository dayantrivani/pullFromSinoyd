<template>
  <!-- 水平衡 -->
  <div class="mod-waterbalance">

    <div class="left">
      <!-- 进水排水量统计 -->
      <water-statistics />
    </div>

    <div class="right">
      <section>
        <!-- 水平衡异常次数 -->
        <balance-anomaly />
      </section>
      <section>
        <!-- 水平衡异常数据报警内容 -->
        <balance-anomaly-alarm />
      </section>
    </div>

    <div class="center">
      <article class="number">
        <section>
          <div class="title">实时数据</div>
          <div class="factor">
            <ul class="list">
              <li v-for="(item,index) in 4" :key="index">
                <div class="factorName" :title="item.name">pH：</div>
                <div class="factorNum" :title="item.num">7</div>
                <div class="factorUnit" :title="item.unit">无量纲</div>
              </li>
            </ul>
          </div>
          <div class="water">
            <div class="inwater">
              <div class="text">
                <span>{{year}}年度进水量</span>
                <span>t</span>
              </div>
              <ul class="list">
                <li v-for="(item,index) in 10" :key="index">
                  {{ dealValue(inflow, index) }}
                </li>
              </ul>
            </div>
            <div class="outwater">
              <div class="text">
                <span>{{year}}年度排水量</span>
                <span>t</span>
              </div>
              <ul class="list">
                <li v-for="(item,index) in 10" :key="index">
                  {{ dealValue(outflow, index) }}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<script>
import WaterStatistics from './components/WaterStatistics';
import BalanceAnomalyAlarm from './components/BalanceAnomalyAlarm';
import BalanceAnomaly from './components/BalanceAnomaly';

export default {
  name: 'WaterBalance',
  components: {
    BalanceAnomaly,
    BalanceAnomalyAlarm,
    WaterStatistics,
  },
  data() {
    return {
      year: '2019',
      inflow: '59259258',     // 进水量
      outflow: '123456789',    // 出水量
    };
  },
  methods: {
    dealValue(val, i) {       // 处理值
      if (val.toString().length === 10) {
        return val[i];
      }
      const str = val.padStart(10, '0');
      return str[i];
    },
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
