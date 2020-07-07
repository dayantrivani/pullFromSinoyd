<template>
  <!-- 水平衡异常数据报警内容 -->
  <decor-border>
    <main-case title="水平衡异常数据报警内容">
      <div class="mod-BalanceAnomalyAlarm" @mousewheel.stop="">
        <el-scrollbar style="width:100%;height:93%;margin-top:1%;">
          <ul class="list">
            <li v-for="(item, index) in list" :key="index">
              <div class="title">
                <div class="name">{{item.psName}}</div>
                <div class="date">{{item.date}}</div>
              </div>
              <p>{{item.contentText}}</p>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </main-case>
  </decor-border>
</template>

<script>
export default {
  name: 'BalanceAnomalyAlarm',
  data() {
    return {
      list: [
        {
          psName: 'x企业x排口',
          date: '2019-11-23 21:32',
          contentText: '有效利用水量与报耗水量无法达到平衡，亏损x吨水量',
        },
        {
          psName: 'x企业x排口',
          date: '2019-11-23 21:32',
          contentText: '有效利用水量与报耗水量无法达到平衡，亏损x吨水量',
        },
        {
          psName: 'x企业x排口',
          date: '2019-11-23 21:32',
          contentText: '有效利用水量与报耗水量无法达到平衡，亏损x吨水量',
        },
        {
          psName: 'x企业x排口',
          date: '2019-11-23 21:32',
          contentText: '有效利用水量与报耗水量无法达到平衡，亏损x吨水量',
        },
        {
          psName: 'x企业x排口',
          date: '2019-11-23 21:32',
          contentText: '有效利用水量与报耗水量无法达到平衡，亏损x吨水量',
        },
        {
          psName: 'x企业x排口',
          date: '2019-11-23 21:32',
          contentText: '有效利用水量与报耗水量无法达到平衡，亏损x吨水量',
        },
        {
          psName: 'x企业x排口',
          date: '2019-11-23 21:32',
          contentText: '有效利用水量与报耗水量无法达到平衡，亏损x吨水量',
        },
        {
          psName: 'x企业x排口',
          date: '2019-11-23 21:32',
          contentText: '有效利用水量与报耗水量无法达到平衡，亏损x吨水量',
        },
        {
          psName: 'x企业x排口',
          date: '2019-11-23 21:32',
          contentText: '有效利用水量与报耗水量无法达到平衡，亏损x吨水量',
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
