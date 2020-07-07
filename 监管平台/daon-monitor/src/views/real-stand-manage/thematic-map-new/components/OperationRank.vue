<template>
  <el-container id="outer-wrapper4">
    <el-header>
      <h5>运维排名</h5>
    </el-header>
    <el-main>
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="page in Math.ceil(rankArr.length/10)" :key="page">
          <div
            class="rank-item"
            v-for="(item,index) in rankArr.slice((page-1)*10, page*10)"
            :key="index"
          >
            <div class="rank-left">{{index + (page-1)*10 + 1}}</div>
            <div class="rank-right">
              <div class="opt-name">{{item.name}}</div>
              <div class="opt-task-bar">
                <span :style="{width: item.num/numRefer*100 + '%'}"></span>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-main>
  </el-container>
</template>

<script>
import { getRank } from '@/api/modules/thematic-map.js';

export default {
  name: 'OperationRank',
  data() {
    return {
      numRefer: 100,
      rankArr: [
        { name: '运维企业名称1', num: 90 },
        { name: '运维企业名称1', num: 85 },
        { name: '运维企业名称1', num: 70 },
        { name: '运维企业名称1', num: 70 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
      ],
    };
  },
  mounted() {
    getRank().then((res) => {
      if (res.status === 200 && res.data && res.data.code === 200) {
        this.numRefer = 100;
        this.rankArr = res.data.data.map((_) => {
          if (this.numRefer < _.point) {
            this.numRefer = Math.ceil(_.point / 50) * 50;
          }
          return { 'name': _.corpName, 'num': _.point };
        });
      } else {
        this.$message.warning(res.data.msg);
      }
    });
  },
};
</script>

<style lang="scss">
$blue: rgba(106, 186, 238, 1);
#outer-wrapper4 {
  height: 100%;
  header {
    margin-top: -2%;
    margin-left: 10%;
    height: 1.5rem !important;
    color: $blue;
    >h5 {
      color: $blue;
      font-size: 0.83rem;
      font-weight: bold;
    }
  }
  main {
    margin-top: 0;
    color: white;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .el-carousel {
      height: 100%;
      width: 100%;
      padding: 0 0.8rem;
      .el-carousel__indicators--horizontal {
        bottom: -0.5rem;
      }
      .el-carousel--horizontal {
        overflow-y: hidden;
      }
      .el-carousel__container {
        height: 100%;
        width: 100%;
        .el-carousel__arrow--left {
          left: -1rem;
        }
        .el-carousel__arrow--right {
          right: -1rem;
        }
        .rank-item {
          width: 100%;
          height: 7.5%;
          margin-bottom: 0.5rem;
          padding-left: 2rem;
          position: relative;
          .rank-right {
            width: 100%;
            height: 100%;
            .opt-name {
              font-size: .6rem;
              margin-bottom: 0.2rem;
            }
            .opt-task-bar {
              height: 35%;
              width: 100%;
              background: #23272f;
              > span {
                background: #00a3f4;
                display: block;
                height: 100%;
              }
            }
          }
          .rank-left {
            position: absolute;
            font-size: 1rem;
            left: 0;
            top: 0.2rem;
          }
        }
      }
    }
  }
}
</style>
