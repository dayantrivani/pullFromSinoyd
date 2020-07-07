<template>
  <div class="mod-progress">
    <span
      v-for="(item, index) in option"
      :key="index"
      :style="{ 'width': item.value, 'background-color': item.color }"
    ></span>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  props: {
    data: {
      type: Array,
      default: () => ([]),
    },
    count: {
      type: Number,
      default: 100,
    },
    color: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    option() {
      const arr = [];
      if (!this.count) return arr;
      this.data.forEach((item, index) => {
        arr[index] = {
          value: `${(item / this.count) * 100}%`,
          color: this.color[index] || 0,
        };
      });
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>
.mod-progress {
  $height: 10px;
  height: $height;
  background-color: $--border-color-base;
  border-radius: 5px;
  overflow: hidden;
  text-align: left;
  > span {
    position: relative;
    top: -($height - 1px);
    display: inline-block;
    height: $height;
    &:nth-child(1) { background-color: $--color-success; }
  }
}
</style>
