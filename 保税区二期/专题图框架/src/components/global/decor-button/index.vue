<template>
  <div
    class="mod-decor-button"
    :style="{
      'background-image': `url(${backgroundIMG})`,
    }">
    <div class="concent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import backgroundL from '../../../assets/img/common/bgL.png';
import backgroundR from '../../../assets/img/common/bgR.png';

export default {
  name: 'DecorButton',
  props: {
    type: {
      type: String,
      default: 'left',
    },
  },
  data() {
    return {
    };
  },
  computed: {
    backgroundIMG() {
      const backgroundIMGs = {
        L: backgroundL,
        R: backgroundR,
      };
      return backgroundIMGs[this.type.substring(0, 1).toUpperCase()];
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import 'index.scss';
</style>
