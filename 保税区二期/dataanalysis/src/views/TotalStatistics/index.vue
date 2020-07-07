<template>
  <!-- 总量统计 -->
  <div class="mod-totalstatistics">
    <div class="left">
      <total-sewage-discharge />
    </div>

    <div class="right">
      <section>
        <factor-emission />
      </section>
      <section>
        <sewage-discharge />
      </section>
      <section>
        <total-rain-discharge />
      </section>
    </div>

    <div class="center">
      <article class="number">
        <section>
          <div class="list-text">
            <ul class="list">
              <li v-for="(item,index) in 10" :key="index">
                {{ dealValue(totalNum, index) }}
              </li>
            </ul>
            <div class="text">
              <span>总量企业数</span>
              <span>家</span>
            </div>
          </div>
          <div class="list-text">
            <ul class="list">
              <li v-for="(item,index) in 10" :key="index">
                {{ dealValue(discharge, index) }}
              </li>
            </ul>
            <div class="text">
              <span>{{year}}年度污水排放总量</span>
              <span>t</span>
            </div>
          </div>
        </section>
      </article>
      <article class="draw">
        <div class="title">
          <div class="center-left">
            <img src="@/assets/img/common/iconAnalysis.png" alt="">
          </div>
          <div class="center-middle">
            {{year}}年度企业排放总量<span>TP20</span>
          </div>
          <div class="center-right">单位：万吨</div>
        </div>
        <ul class="draw-list">
          <li v-for="(item, index) in 20" :key="index">
            <div class="progress" :style="{ height: '100%' }">
              <div class="num">12</div>
              <div class="item-style"></div>
            </div>
          </li>
        </ul>
      </article>
    </div>
  </div>
</template>

<script>
import TotalSewageDischarge from './components/TotalSewageDischarge';
import FactorEmission from './components/FactorEmission';
import SewageDischarge from './components/SewageDischarge';
import TotalRainDischarge from './components/TotalRainDischarge';

export default {
  name: 'TotalStatistics',
  components: {
    TotalSewageDischarge,
    FactorEmission,
    SewageDischarge,
    TotalRainDischarge,
  },
  data() {
    return {
      year: '2019',                 // 年份
      totalNum: '59259258',     // 总量企业数
      discharge: '123456789',    // 污水排放总量
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
    // 宽度计算公式: calc(x - 0.2(1-x)rem)
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
