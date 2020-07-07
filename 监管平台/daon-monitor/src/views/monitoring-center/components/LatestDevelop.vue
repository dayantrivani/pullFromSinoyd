<template>
  <!-- 最新动态 -->
  <a-card class="LatestDevelop recent_charts" :bordered="false">
    <template #title>
      <img class="title_img" src="@/assets/img/dongtai1.png"/>
      <span class="title">最新动态</span>
    </template>
    <div class="develop" v-for="item in data" :key="item.id">
      <div class="dev_top">
        <img :src="item.pic ? `/api/monitor/static/files/${item.pic}` : defaultImg"/>
        <div class="dersion">
          <p>
            <span class="name">{{item.creatorName}}</span>
            <span class="type">{{item.typeName}}</span>
          </p>
          <span>{{item.createdAt}}</span>
        </div>
      </div>
      <a-carousel arrows autoplay class="rank_carousel" ref="carousel" v-if="item.attaches.length">
        <div class="content" v-for="(each, i) in Math.ceil(item.attaches.length / 3)" :key="i">
          <ul class="rank">
            <li class="item" v-for="(serial, index) in item.attaches.slice(i * 3, (i + 1) * 3)" :key="index">
              <img :src="`/api/monitor/static/files/${serial.filePath}`" @click="onLargeImage(serial)"/>
            </li>
          </ul>
        </div>
      </a-carousel>
      <p class="message">{{item.description}}</p>
      <p class="code">{{item.sn}}</p>
    </div>
    <a-modal
      width="600px"
      title="查看图片"
      :visible="isVisable"
      :maskClosable="false"
      :centered="true"
      :footer="false"
      @cancel="isVisable = false"
    >
      <img style="width: 100%" :src="largeImgUrl"/>
    </a-modal>
  </a-card>
</template>

<script>
import { getMessage } from '@/api/modules/monitoring-center.js';


export default {
  name: 'LatestDevelop',
  data() {
    return {
      // eslint-disable-next-line
      defaultImg: require('@/assets/img/user_avater_man_100x100.jpg'),
      data: [],
      isVisable: false,
      largeImgUrl: '',
    };
  },
  mounted() {
    getMessage().then((res) => {
      if (res.data.code === 200 && res.data.success) {
        this.data = res.data.data;
        // 判断当文件类型为图片时  显示图片
        this.data.forEach((el) => {
          el.attaches.forEach((serial, index) => {
            if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(serial.filePath)) {
              this.$delete(el.attaches, index);
            }
          });
        });
      } else {
        this.$message.error(res.data.msg);
      }
    });
  },
  methods: {
    onLargeImage(item) {
      this.isVisable = true;
      this.largeImgUrl = `/api/monitor/static/files/${item.filePath}`;
    },
  },
};
</script>

<style lang="scss">
.LatestDevelop{
  >.ant-card-body{
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background-color: #DEDEDE;
      -webkit-border-radius: 1em;
      -moz-border-radius: 1em;
      border-radius: 1em;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #BFBFBF;
      -webkit-border-radius: 1em;
      -moz-border-radius: 1em;
      border-radius: 1em;
    }
  }
}
</style>

<style lang="scss" scoped>
.LatestDevelop{
  height: calc(100% - 355px);
  .develop{
    padding: 10px;
    margin-top: 10px;
    border-bottom: 1px solid #F1F2F3;
    >.dev_top{
      height: 55px;
      >img{
        width: 40px;
        height: 40px;
        float: left;
        margin-top: 7px;
        border-radius: 10px;
      }
      >.dersion{
        width: calc(100% - 55px);
        height: 100%;
        display: block;
        float: left;
        padding: 5px 10px;
        >p{
          height: 50%;
          width: 100%;
          >.name{
            float: left;
            color: #585858;
          }
          >.type{
            float: right;
            color: #61A0A8;
          }
        }
        >span{
          color: #000000;
        }
      }
    }
    >.rank_carousel{
      height: 80px;
      img{
        cursor: pointer;
        height: 100%;
        float: left;
        width: calc((100% - 20px) / 3);
        margin-left: 10px;
      }
      img:nth-child(1){
        margin-left: 0;
      }
    }
    >.imgs{
        height: 80px;
        >img{
          height: 100%;
          float: left;
          width: calc((100% - 20px) / 3);
          margin-left: 10px;
        }
        >img:nth-child(1){
          margin-left: 0;
        }
      }
    >p{
      color: #A0A0A0;
      margin-top: 5px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
.title_img{
  width: 20px;
  margin-right: 5px;
}
.title{
  color: #409eff;
  font-weight: 600;
}
</style>
