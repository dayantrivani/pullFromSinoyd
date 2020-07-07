<template>
  <div class="operations">
    <div class="choose_btn">
      <span
        class="checked"
        :class="{ 'toLeft':type === 1, 'toRight':type === 2 }"
      ></span>
      <span
        class="task_btn"
        :style="{ 'color': type === 1 ? '#fff' : '' }"
        @click="onChoose(1)"
      >运维任务</span>
      <span
        class="situa_btn"
        :style="{ 'color': type === 2 ? '#fff' : '' }"
        @click="onChoose(2)"
      >运维情况</span>
    </div>
    <div class="maskBgClass" v-show="type === 1">
      <img src="@/assets/img/mask_bg.png" />
      <p>超期任务数</p>
      <span>{{overrun}}</span>
    </div>
    <opera-tasks v-show="type === 1" ref="OperaTasks" :companyData="operEnterData" @changeOverrun="changeOverrun"/>
    <opera-cond v-show="type === 2" ref="OperaCond" :companyData="operEnterData"/>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import OperaTasks from './components/OperaTasks';
import OperaCond from './components/OperaCond';
import { getOperEnter } from '@/api/modules/home.js';

export default {
  name: 'operations',
  components: {
    OperaTasks,
    OperaCond,
  },
  computed: {
    ...mapState('home', ['type']),
  },
  data() {
    return {
      overrun: 0,
      operEnterData: [],
    };
  },
  created() {
    getOperEnter().then((res) => {
      if (res.data.code === 200 && res.data.success) {
        this.operEnterData = res.data.data;
      }
    });
  },
  methods: {
    ...mapMutations('home', ['changeType']),
    changeOverrun(val) {
      this.overrun = val;
    },
    onQueryList() {},
    onChoose(type) {
      this.changeType(type);
    },
  },
};
</script>

<style lang="scss" scoped>
.operations {
  background: #fff;
  height: 515px;
  margin-top: 15px;
  position: relative;
  padding: 10px;
  .choose_btn {
    height: 30px;
    width: 255px;
    background: #edf2f4;
    border-radius: 15px;
    position: absolute;
    left: 10px;
    top: 20px;
    color: #7d7f80;
    span {
      width: 50%;
      border-radius: 15px;
      line-height: 30px;
      text-align: center;
      height: 100%;
      user-select: none;
    }
    .task_btn {
      cursor: pointer;
      z-index: 2;
      position: absolute;
      left: 0;
    }
    .situa_btn {
      cursor: pointer;
      z-index: 2;
      position: absolute;
      right: 0;
    }
    .checked {
      z-index: 1;
      position: absolute;
      left: 0;
      color: #fff;
      background: #319dcd;
      transition: all 0.35s;
    }
  }
  .maskBgClass {
    position: absolute;
    right: 40px;
    top: -5px;
    width: 100px;
    color: #fff;
    > img {
      width: 100%;
    }
    > p {
      text-align: center;
      position: absolute;
      top: 5px;
      width: 100%;
    }
    > span {
      font-size: 30px;
      width: 100%;
      text-align: center;
      position: absolute;
      left: 0;
      bottom: -2px;
    }
  }
}
.toRight {
  transform: translateX(100%);
}
.toLeft {
  transform: translateX(0);
}
</style>
