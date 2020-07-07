<template>
  <el-cascader
    v-bind="$attrs"
    popper-class="cascader-area__popper"
    v-model="valueModel"
    :props="props"
    :class="{
      'cascader-area__span': span,
      'cascader-area__readonly': readonly,
    }"
    v-on="$listeners"
  />
</template>

<script>
import { getAreaList } from './request';

const lazyLoad = (node, resolve) => {
  getAreaList(node)
    .then((response) => {
      const { success, data } = response.data;
      if (success) {
        resolve(data || []);
      }
    });
};

export default {
  name: 'CascaderArea',
  inheritAttrs: false,
  model: {
    value: 'value',
    event: 'setValue',
  },
  props: {
    value: {
      type: [String, Array],
      required: true,
      default: '',
    },
    // 只读状态
    readonly: {
      type: Boolean,
      default: false,
    },
    // 纯文本显示
    span: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad,
      },
    };
  },
  computed: {
    valueModel: {
      get() {
        if (typeof this.value === 'string') return this.value.split('/');
        return [];
      },
      set(value) {
        this.$emit('setValue', value.join('/'));
      },
    },
  },
};
</script>

<style lang="scss">
.cascader-area__readonly {
  pointer-events: none;
}
.cascader-area__span {
  pointer-events: none;
  input {
    color: inherit;
    padding-left: 0;
    border-width: 0 !important;
    + .el-input__suffix {
      display: none;
    }
  }
}
.cascader-area__popper {
  .el-scrollbar.el-cascader-menu {
    height: 320px;
    .el-cascader-menu__wrap.el-scrollbar__wrap {
      overflow-x: hidden;
      margin-bottom: 0 !important;
    }
  }
}
</style>
