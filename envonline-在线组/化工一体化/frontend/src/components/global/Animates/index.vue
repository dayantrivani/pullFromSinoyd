
<template>
  <transition
    :name="name"
    :enter-active-class="`animated ${effect} ${speed}`">
    <div v-show="show" :class="{ Transition: true, position }"><slot></slot></div>
  </transition>
</template>

<script>
export default {
  name: 'Animates',
  props: {
    name: { // 需要透明度的时候将这里设置 bounce
      type: String,
      default: 'custom-classes-transition',
    },
    speed: { //
      type: String,
      default: '',
    },
    time: {  // 延时时长
      type: Number,
      require: true,
    },
    effect: {
      type: String,
      require: true,
    },
    position: {  // 是否为定位元素
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  watch: {
    effect() {
      this.switch();
    },
  },
  created() {
    // 启用动画
    this._ANIMATION();
  },
  methods: {
    _ANIMATION() {
      // 延时 time 秒启动动画
      setTimeout(() => { this.show = true; }, this.time);
    },
    switch() {
      this.show = false;
      setTimeout(() => {
        this.show = true;
      }, 0);
    },
  },
};
</script>

<style scoped>
.Transition{
  width: 100%;
  height: 100%;
}
.position{
  position: absolute;
  left: 0;
  top: 0;
}
.bounce-enter{
  opacity:0;
}
.bounce-enter-active,.bounce-leave-active{
  transition: all .5s linear;
}
</style>
