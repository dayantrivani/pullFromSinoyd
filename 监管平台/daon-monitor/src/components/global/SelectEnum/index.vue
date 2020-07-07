<template>
  <a-select
    :allowClear="allowClear"
    :placeholder="placeholder"
    :defaultValue="defaultValue"
    :style="{ 'width': width, 'min-width': minWidth }"
    @change="val => $emit('change', val)">
    <a-select-option
      v-for="(label, value) in options"
      :key="value"
      :value="value - 0"
    >{{ label }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'SelectEnum',
  model: {
    value: 'value',
    event: 'change',
  },
  props: {
    // 是否可清除
    allowClear: {
      type: Boolean,
      default: true,
    },
    // 设置默认值
    defaultValue: {
      type: [Number, String],
    },
    value: {
      type: [Number, String],
    },
    type: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: 'auto',
    },
    minWidth: {
      type: String,
      default: 'auto',
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
  },
  computed: {
    options() {
      return this.$enum[this.type] || [];
    },
  },
};
</script>
