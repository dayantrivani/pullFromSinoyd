<template>
  <a-row class="OperaType" :gutter="15">
    <a-col class="types" :span="6" v-for="(item, index) in types" :key="index" >
      <div class="content" :class="item.className">
        <p class="name">{{item.name}}</p>
        <p class="num">{{item.number}}</p>
        <img :src="item.img"/>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import icoCompany from '@/assets/img/icoCompany.png';
import icoInstru from '@/assets/img/icoInstru.png';
import icoStation from '@/assets/img/icoStation.png';
import icoUnit from '@/assets/img/icoUnit.png';
import { getHome } from '@/api/modules/home.js';

export default {
  name: 'OperaType',
  data() {
    return {
      types: [
        {
          name: '运维单位',
          img: icoUnit,
          number: 0,
          className: 'unit',
        },
        {
          name: '污染源企业',
          img: icoCompany,
          number: 0,
          className: 'company',
        },
        {
          name: '污染源站点',
          img: icoStation,
          number: 0,
          className: 'station',
        },
        {
          name: '在线监测仪器',
          img: icoInstru,
          number: 0,
          className: 'instru',
        },
      ],
    };
  },
  created() {
    getHome().then((res) => {
      if (res.data.code === 200 && res.data.success) {
        const { data } = res.data;
        this.types[0].number = data.corpNum;
        this.types[1].number = data.companyNum;
        this.types[2].number = data.stationNum;
        this.types[3].number = data.instrumentNum;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.OperaType{
  height: 120px;
    .types{
      .content{
        padding: 20px 30px;
        height: 100%;
        color: #fff;
        position: relative;
        border-radius: 5px;
        box-shadow: 0 2px 2px #546570;
        >.num{
          font-size: 32px;
          margin-top: 25px;
        }
        >img{
          width: 60px;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 30px;
          margin: auto;
        }
      }
    }
    .unit{
      background: #749F83;
    }
    .company{
      background: #61A0A8;
    }
    .station{
      background: #C23531;
    }
    .instru{
      background: #546570;
    }
}
</style>
