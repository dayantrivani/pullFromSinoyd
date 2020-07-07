<template>
  <a-row :gutter="10" style="height: 120px;">
    <a-col class="types" :span="8" v-for="item in homeData" :key="item.name">
      <div class="content" :class="item.className">
        <p class="name">{{item.name}}</p>
        <p class="num">{{item.number}}</p>
        <div class="img">
          <img :src="item.img"/>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import { getStatistics } from '@/api/modules/monitoring-center.js';
import icoCompany from '@/assets/img/daiban.png';
// import icoInstru from '@/assets/img/icoInstru.png';
import icoStation from '@/assets/img/chaoqi.png';
import icoUnit from '@/assets/img/renshu.png';

export default {
  name: 'TypesMonitor',
  data() {
    return {
      homeData: [
        {
          name: '监理人数',
          img: icoUnit,
          number: 0,
          className: 'unit',
        },
        {
          name: '待办任务',
          img: icoCompany,
          number: 0,
          className: 'company',
        },
        {
          name: '超期任务',
          img: icoStation,
          number: 0,
          className: 'station',
        },
      ],
    };
  },
  mounted() {
    getStatistics().then((res) => {
      if (res.data.code === 200 && res.data.success) {
        const { data } = res.data;
        this.homeData[0].number = data.userCount;
        this.homeData[1].number = data.replaceTask;
        this.homeData[2].number = data.overTask;
      } else {
        this.$message.error(res.data.msg);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
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
    >.img{
      width: 60px;
      height: 60px;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 30px;
      margin: auto;
      background-color: rgba(255, 218, 206, 0.2);
      border-radius: 50%;
      >img{
        position: absolute;
        height: 50%;
        width: 50%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
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
</style>
