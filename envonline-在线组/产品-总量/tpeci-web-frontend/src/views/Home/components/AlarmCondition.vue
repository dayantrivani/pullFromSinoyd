<template>
  <!-- 报警情况 -->
  <section data-mod-margin data-mod-radius>
    <model-title title="报警情况" path="AlarmRecord">
      <div class="progress">
        <div class="progress-item" v-for="(item, index) in progress" :key="index">
          <span class="progress-item_title">{{item.title}}</span>
          <div class="progress-item_chart" :style="{ width: item.width, backgroundColor: item.color }"></div>
          <span class="progress-item_text" :title="item.num">{{item.num}}</span>
          <div class="clear: both;"></div>
        </div>
      </div>
    </model-title>
  </section>
</template>

<script>
export default {
  data() {
    return {
      progress: [
        {
          str: 'totalAlarmAmount',
          title: '报警',
          width: '',
          color: '#ED5564',
          num: 0,
        },
        {
          str: 'overAlarmAmount',
          title: '超标',
          width: '',
          color: '#FB6E52',
          num: 0,
        },
        {
          str: 'otherAlarmAmount',
          title: '其它',
          width: '',
          color: '#967BDC',
          num: 0,
        },
      ],
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    dealBefore(row) {
      const ratioSize = [];
      this.progress.forEach((item) => {
        this.$set(item, 'num', row[item.str]);
        ratioSize.push(+item.num);
      });
      const max = Math.max(...ratioSize);
      if (max) {
        this.progress.forEach((item) => {
          this.$set(item, 'width', `calc(${(item.num / max * 100).toFixed(3)}%
            - ${(item.num / max * 96).toFixed(2)}px)`);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.progress{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .progress-item{
    flex: 1;
    display: flex;
    // width: 0;
    align-items: center;
    // text-align: center;
    font-size: 14px;
    font-family: '微软雅黑';
    .progress-item_title {
      width: 40px;
      font-size: 15px;
      // float: left;
      letter-spacing: 4px;
      margin-right: 8px;
    }
    .progress-item_chart {
      // max-width: calc(100% - 96px);
      float: left;
      height: 16px;
      border-radius: 8px;
    }
    .progress-item_text {
      float: left;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 16px;
      font-weight: bold;
      margin-left: 8px;
    }
  }
}
</style>
