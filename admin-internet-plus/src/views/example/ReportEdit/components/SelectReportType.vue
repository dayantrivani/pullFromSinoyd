<template>
  <el-select
    v-model="valueModel"
    v-bind="$attrs"
    :loading="loading"
    :style="{ 'width': width, 'min-width': minWidth }"
    v-on="$listeners"
    @change="val => onChange(val)"
    @visible-change="show => (show && !itemList.length) && getItemList()"
  >
    <el-option
      v-for="item in itemList"
      :key="item[props.value]"
      :label="item[props.label]"
      :value="item[props.value]"
    ></el-option>
  </el-select>
</template>

<script>
import { getSerialList } from '../request';

export default {
  name: 'SelectSerialType',
  inheritAttrs: false,
  model: {
    value: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: [String, Number],
    },
    // 枚举类型
    type: {
      type: Number,
    },
    // 宽度
    width: {
      type: String,
      default: 'auto',
    },
    // 最小宽度
    minWidth: {
      type: String,
      default: '120px',
    },
    props: {
      type: Object,
      default: () => ({
        label: 'configName',
        value: 'id',
      }),
    },
  },
  data() {
    return {
      loading: false,
      valueModel: '',
      itemList: [], // 枚举数据
    };
  },
  watch: {
    value: {
      handler(val) {
        if (!val) {
          this.valueModel = val;
        }
        // 未加载数据时是先不赋值，避免无数据时直接显示ID
        this.getItemList().then(() => {
          this.valueModel = val;
          this.onChange(val);
        });
      },
      immediate: true,
    },
  },
  methods: {
    onChange(val) {
      const item = this.itemList.find(v => v[this.props.value] === val);
      this.$emit('label', (item || {})[this.props.label]);
    },
    getItemList() {
      return new Promise((resolve) => {
        this.loading = true;
        getSerialList({
          configType: this.type,
          page: 1,
          rows: 100000,
        })
          .then((response) => {
            this.itemList = response.data.data || [];
            resolve();
          })
          .finally(() => {
            this.loading = false;
            resolve();
          });
      });
    },
  },
};
</script>
