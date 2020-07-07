<template>
  <div v-once class="app-brand" :title="$config.app.title">
    <div class="brand">
      <icon :name="$config.app.icon" size="0.9em" />
    </div>
    <span class="text-bright">{{ $config.app.title }} </span>
  </div>
</template>

<style lang="scss">
.app-brand {
  display: inline-block;
  height: $-head-height;

  font-size: 1.2em;
  letter-spacing: 1px;

  transition: inherit;
  overflow: hidden;
  box-shadow: $-layout-shadow;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  > .brand {
    float: left;
    position: relative;
    width: $-side-width;
    height: $-head-height;
    line-height: $-head-height;

    font-size: 2em;
    text-align: center;
  }

  > .text-bright {
    font-style: italic;
  }
}
</style>
