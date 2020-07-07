<template>
  <div class="mod-picture-info"
    :class="{ isSelect: item.isSelect }"
    @mouseover="onMouseover"
    @mouseout="onMouseout"
  >
    <div class="picture">
      <img :src="item.src" alt="">
    </div>
    <div class="info">
      <div class="info-top flex-box">
        <span :title="num">{{ num }}</span>
        <span></span>
      </div>
      <div class="info-bottom flex-box">
        <span>{{ item.text }}</span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PictureInfo',
  props: {
    num: {
      type: [String, Number],
      default: '暂无数据',
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  created() {
    const { items } = this;
    this.item = {
      text: items[this.index].text,
      src: `${items[this.index].src}.png`,
      isSelect: false,
    };
  },
  data() {
    return {
      item: {
        text: '',
        src: '',
        isSelect: '',
      },
      items: [
        {
          text: '企业数',
          src: './img/home/building',
        },
        {
          text: '开阀申报待审核',
          src: './img/home/seal',
        },
        {
          text: '站点数',
          src: './img/home/facility',
        },
        {
          text: '排污许可证',
          src: './img/home/prove',
        },
      ],
    };
  },
  methods: {
    onMouseover() {
      this.item.src = `${this.items[this.index].src}Select.png`;
      this.item.isSelect = true;
    },
    onMouseout() {
      this.item.src = `${this.items[this.index].src}.png`;
      this.item.isSelect = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.o-h{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.flex-box{
  display: flex;
  padding: 0 5px;
  > span:nth-child(1){
    flex: 1;
    display: inline-block;
    width: 0;
    @extend .o-h;
  }
}
.isSelect{
  color: #fff !important;
  background-color: #67A9FF !important;
}
.mod-picture-info{
  width: 100%;
  height: 100%;
  display: flex;
  .picture {
    flex: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    // display: table-cell; /* 主要是这个属性,与盒子属性冲突,必须指明高度,盒子默认具有高度 */
    // vertical-align: middle;
    // text-align: center;
    img {
      // width: 55px;
      // height: 48px;
      width: 70%;
      height: auto;
    }
  }
  .info {
    flex: 5;
    display: flex;
    flex-direction: column;
    > .info-top{
      flex: 3;
      align-items: flex-end;
      font-size: 35px;
      font-family: "黑体", "-webkit-pictograph", "微软雅黑";
    }
    > .info-bottom{
      flex: 2;
      align-items: flex-start;
      font-size: 14px;
      font-family: "微软雅黑";
      letter-spacing: 1px;
    }
  }
}
</style>
