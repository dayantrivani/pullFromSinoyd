<template>
  <div class="mod-model-title">
    <div class="header">
      <div class="title" :class="{ titleHover: path !== '' }" @click="onClickTitle">{{title}}</div>
      <template>
        <div v-if="rightStr === 'unit'" class="unit right">单位：{{rightValue}}</div>
        <div v-if="rightStr === 'clocks'" class="clocks right">
          <img src="/img/home/clocks.png" alt="">
          <span>数据时间：{{rightValue}}</span>
        </div>
        <div v-if="rightStr === 'select'" class="select right">
          <div class="select-month active">月</div>
          <div class="select-year">年</div>
        </div>
      </template>
    </div>
    <div class="main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModelTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
    rightStr: {
      type: String,
      default: '',
    },
    rightValue: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
    };
  },
  methods: {
    onClickTitle() {
      if (this.path) {
        this.$router.push({ name: this.path });
      }
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

.mod-model-title{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px 20px 20px;
  .header{
    display: flex;
    height: 32px;
    line-height: 32px;
    .title{
      flex: 1;
      width: 0;
      font-size: 18px;
      font-weight: bold;
      @extend .o-h;
    }
    .titleHover{
      cursor: pointer;
      transition: all 0.2s linear;
      &:hover{
        transform: scale(1.05);
      }
    }
    .select{
      width: 80px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      border: 1px solid rgb(230, 230, 230);
      border-radius: 16px;
      position: relative;
      > div {
        cursor: pointer;
        float: left;
        width: 40%;
        border-radius: 14px;
        height: 100%;
        text-align: center;
        &.active{
          width: 60%;
          color: #FFFFFF;
          background-color: rgb(147, 210, 247);
        }
      }
    }
    .right{
      color: #ABB5C0;
      &.unit{
        font-size: 13px;
      }
      &.clocks{
        > img {
          vertical-align: middle;
          margin-right: 5px;
          margin-bottom: 3px;
          height: 14px;
          width: auto;
        }
        font-size: 14px;
      }
    }
  }
  .main{
    height: calc(100% - 32px);
  }
}
</style>
