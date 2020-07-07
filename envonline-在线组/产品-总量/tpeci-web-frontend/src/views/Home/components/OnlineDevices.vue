<template>
  <!-- 在线离线设备 -->
  <section data-mod-margin data-mod-radius>
    <model-title title="在线离线设备" path="BlowdownProgress">
      <div class="graph">
        <div class="graph-ports">
          <div class="ports-left">
            <div>{{onlineAmount}}</div>
            <div>在线</div>
          </div>
          <div class="ports-space"></div>
          <div class="ports-right">
            <div>{{offlineAmount}}</div>
            <div>离线</div>
          </div>
        </div>
        <div class="graph-progress">
          <div class="online" :style="{ width: ratio }"></div>
        </div>
      </div>
    </model-title>
  </section>
</template>

<script>
export default {
  data() {
    return {
      onlineAmount: 0,      // 在线
      offlineAmount: 0,     // 离线
      ratio: 0,             // 占比
    };
  },
  methods: {
    dealBefore(row) {
      this.onlineAmount = row.onlineAmount || 0;
      this.offlineAmount = row.offlineAmount || 0;
      const total = this.onlineAmount + this.offlineAmount;
      if (total) {
        this.ratio = `${(this.onlineAmount / total * 100).toString().slice(0, 5)}%`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.graph {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .graph-ports {
    height: calc(100% - 20px);
    display: flex;
    padding: 5% 10% 10% 10%;
    .ports-left {
      display: flex;
      flex-direction: column;
      > div {
        &:nth-child(1) {
          flex: 3;
          display: flex;
          align-items: center;
          color: #51D0B1;
          font-size: 26px;
        }
        &:nth-child(2) {
          flex: 1;
          font-size: 14px;
          padding-left: 5px;
        }
      }
    }
    .ports-space{
      flex: 1;
    }
    .ports-right {
      display: flex;
      flex-direction: column;
      > div {
        &:nth-child(1) {
          flex: 3;
          display: flex;
          align-items: center;
          font-size: 26px;
          color: #B9DBD3;
        }
        &:nth-child(2) {
          flex: 1;
          font-size: 14px;
          padding-left: 5px;
        }
      }
    }
  }
  .graph-progress {
    width: 90%;
    height: 20px;
    display: flex;
    transform: skewX(-15deg);
    background-color: #B9DBD3;
    margin: 0 5%;
    > .online {
      width: 55%;
      background-color: #48CFAE;
    }
  }
}
</style>
