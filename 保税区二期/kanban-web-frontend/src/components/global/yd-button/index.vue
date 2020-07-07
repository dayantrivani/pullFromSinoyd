<template>
  <div ref="button" class="yd-button">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'YdButton',
  props: {
    active: { // 状态，选中后为true
      type: Boolean,
      default: false,
    },
    activeColor: { // 选中后颜色
      type: String,
      default: '#ffb423',
    },
    inactiveColor: { // 选中前颜色
      type: String,
      default: '#129ff7',
    },
  },
  data() {
    return {
    };
  },
  computed: {},
  mounted() {
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor();
    }
  },
  methods: {
    setBackgroundColor() {
      const newColor = this.active ? this.activeColor : this.inactiveColor;
      this.$refs.button.style.boxShadow = `0 0.01rem 0.05rem ${newColor}`;
      this.$refs.button.style.backgroundColor = newColor;
    },
  },
};
</script>

<style lang="scss" scoped>
.yd-button {
  display: inline-block;
  min-width: 0.55rem;
  line-height: normal;
  border: 0 solid transparent;
  border-radius: 25% / 50%;
  padding: 0.05rem 0.1rem;
  color: #fff;
  font-size: 0.1rem;
  text-align: center;
  background-color: #129ff7;
  box-shadow: 0 0.01rem 0.05rem #129ff7;
  cursor: pointer;
  user-select: none;
}
</style>
