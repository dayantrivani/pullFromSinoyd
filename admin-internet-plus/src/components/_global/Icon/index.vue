<template functional>
  <i
    aria-hidden="true"
    :class="`icon-svg ${(props.name || '').includes('el-') ? props.name : ''}`"
    :style="{
      'left': props.x || 'auto',
      'top': props.y || 'auto',
      'font-size': props.size || '',
      'color': props.color || 'inherit',
      'transform': `scale(${props.scale || 1})`,
    }"
  >
    <svg v-if="!((props.name || '').includes('el-'))">
      <use :xlink:href="`#${props.name}`"></use>
    </svg>
  </i>
</template>

<script>
export default {
  name: 'Icon',
};
</script>

<style lang="scss">
i.icon-svg {
  position: relative;
  display: inline-block;
  font-size: inherit;
  vertical-align: middle;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  > svg {
    position: relative;
    width: 1em;
    height: 1em;
    min-width: 14px;
    fill: currentColor;
    vertical-align: baseline;
    overflow: hidden;
  }
  + i.icon-svg {
    padding-left: 5px;
  }
}
</style>
