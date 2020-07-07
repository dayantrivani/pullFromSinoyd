<template>
  <div class="fill-h">
    <div class="gas-unit fn-right">单位：{{ unit }}</div>
    <el-row class="fn-flex flex-x-around fill-w top5" style="height:calc(100% - 20px)" :gutter="10">
      <div
        v-for="item in filterData" :key="item.psName"
        :class="`icon-${sortItem.indexOf(item.totalQty) + 1}`"
        :style="{ flex: 10 - sortItem.indexOf(item.totalQty) }"
      >
        <p class="text-primary" style="font-size: 18px;font-weight: bold;">{{item.totalQty}}</p>
        <p :title="item.psName">{{item.psName}}</p>
        <p class="text-primary">{{sortItem.indexOf(item.totalQty) + 1}}</p>
      </div>
    </el-row>
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'SteamRanks',
  mixins: [],
  data() {
    return {
      itemList: {},
      unitNum: false,
      colorList: ['#ffe300', '#b156f7', '#04abfa', '#23e680', '#fecc60'],
    };
  },
  computed: {
    unit() {
      return this.unitNum ? '万吨' : '吨';
    },
    filterData() {
      if (this.itemList.total && this.itemList.total.length > 5) {
        return this.itemList.total.slice(0, 5);
      }
      return this.itemList.total;
    },
    sortItem() {
      const arr = [...this.itemList.total];
      return arr.sort((m, n) => n.totalQty - m.totalQty).map(n => n.totalQty);
    },
  },
  created() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.$http.get('enterprise/energyConsumptionSteam/yearReportCount', {
        params: { belongYear: new Date().getFullYear().toString() },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data || {};
          // this.itemList = {
          //   total: [
          //     { totalQty: 10, psName: '刘冬测试企业' },
          //     { totalQty: 11, psName: '负载测试污染源废水总量企业1001' },
          //     { totalQty: 9, psName: '仲铭波测试' },
          //     { totalQty: 12, psName: 'zc总量测试用二号' },
          //     { totalQty: 8, psName: '保税区测试企业' },
          //   ],
          // };
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.gas-unit {
  text-align: right;
}
.top5 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  >div {
    @for $i from 1 through 5 {
      &.icon-#{$i} {
        background: {
          image: url('../../../../assets/img/steam/#{$i}.png');
          repeat: no-repeat;
          size: contain;
          position: 50% 50%;
        }
      }
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    >p {
      padding: 5px 10px;;
      text-align: center;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
