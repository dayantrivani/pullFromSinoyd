<template>
  <!-- 选择器 -->
  <el-select
    v-if="element === 'select'"
    :value="value"
    :style="styles"
    :loading="loading"
    clearable
    v-bind="$attrs"
    v-on="$listeners"
    @change="onChange"
    @visible-change="show => show && getData()">
    <slot></slot>
    <el-option
      v-for="item in options"
      :key="item[field.value]"
      :value="item[field.value]"
      :label="item[field.label]"
    >
      <status v-if="dot && !online" :type="item[field.dot]">
        {{ item[field.label] }}
      </status>
    </el-option>
  </el-select>

  <!-- 单选框 -->
  <el-radio-group
    v-else-if="element === 'radio'"
    :value="value"
    :style="styles"
    v-bind="$attrs"
    v-on="$listeners"
    @change="onChange">
  >
    <slot></slot>
    <el-radio
      v-for="item in options"
      :key="item[field.value]"
      :label="item[field.value]"
    >
      <status v-if="dot && !online" :type="item[field.dot]">
        {{ item[field.label] }}
      </status>
      <template v-else>
        {{ item[field.label] }}
      </template>
    </el-radio>
  </el-radio-group>

  <!-- 多选框 -->
  <el-checkbox-group
    v-else-if="element === 'checkbox'"
    :value="value"
    :style="styles"
    v-bind="$attrs"
    v-on="$listeners"
    @change="onChange">
  >
    <slot></slot>
    <el-checkbox
      v-for="item in options"
      :key="item[field.value]"
      :label="item[field.value]"
    >
      <status v-if="dot && !online" :type="item[field.dot]">
        {{ item[field.label] }}
      </status>
      <template v-else>
        {{ item[field.label] }}
      </template>
    </el-checkbox>
  </el-checkbox-group>

  <!-- 纯显示 -->
  <span v-else>{{ labelSpan }}</span>
</template>

<script>
import { getEnumList } from '@/api/sys';

export default {
  name: 'Enum',
  inheritAttrs: false,
  model: {
    value: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: [String, Number, Boolean, Array],
      default: '',
    },
    // 枚举类型
    type: {
      type: String,
      default: '',
    },
    // 根节点ID
    rootKey: {
      type: String,
      default: '',
    },
    // 状态标识
    dot: {
      type: Boolean,
      default: false,
    },
    // 线上维护枚举
    online: {
      type: Boolean,
      default: false,
    },
    // 过滤方法
    filterMethod: {
      type: [Function, Boolean],
      default: false,
    },
    // 控件元素
    element: {
      type: String,
      default: 'select',
      validator: val => ['select', 'radio', 'checkbox', 'span'].indexOf(val) > -1,
    },
    width: {
      type: String,
      default: 'auto',
    },
    minWidth: {
      type: String,
      default: '100px',
    },
    // 字段配置
    props: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      data: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val || this.element !== 'select') this.init();
      },
      immediate: true,
    },
  },
  computed: {
    styles() {
      return { 'width': this.width, 'min-width': this.minWidth };
    },
    field() {
      const props = this.online
        ? { label: 'dictName', value: 'rowGuid' }
        : { label: 'label', value: 'value', dot: 'tag' };
      return Object.assign(props, this.props || {});
    },
    options() {
      if (this.filterMethod) {
        return this.data.filter(v => this.filterMethod(v));
      }
      return this.data;
    },
    labelSpan() {
      if (this.data.length) {
        const multiple = typeof this.$attrs.multiple === 'string';
        const values = multiple ? this.value : [this.value];
        const items = this.data.filter(v => values.indexOf(v[this.field.value]) > -1);
        return items.map(v => v[this.field.label]).join('、');
      }
      return this.value;
    },
  },
  methods: {
    init() {
      this.getData(this.data.length || (this.element === 'select' && this.value === ''));
    },
    onChange(val) {
      const multiple = typeof this.$attrs.multiple === 'string';
      this.$emit('input', val);
      this.$emit('change', val);
      if (multiple) {
        const items = this.data.filter(v => (val || []).includes(v[this.field.value]));
        this.$emit('update:label', items.map(v => v[this.field.label]));
      } else {
        const item = this.data.find(v => (val || '') === v[this.field.value]) || {};
        this.$emit('update:label', item[this.field.label] || '');
      }
    },
    getData(cancel = this.data.length) {
      if (cancel) return;
      if (!this.online) {
        this.data = this.$enum.get(this.type) || [];
      } else {
        this.loading = true;
        getEnumList(this.type, this.rootKey)
          .then((response) => {
            const { status, data } = response;
            if (status === 200) {
              this.data = data || [];
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
