<template>
  <div class="mod-list" :style="{ 'width': width, 'height': height, 'min-height': minHeight }">
    <div v-if="header" class="mod-list__title flex-x-between">
      <span>{{ header }}</span>
      <span class="mod-list__more">
        <slot name="more"></slot>
      </span>
    </div>
    <ul :class="{ 'mod-list__body': 1, 'is-title': header }">
      <scrollbar height="100%">
        <li
          v-for="(item, index) in data"
          :key="item.id"
          :title="ellipsis ? item[propsOption.label] : ''"
          :class="{
            'item': 1,
            'i-overflow': ellipsis,
            'is-active': item[propsOption.value] === row[propsOption.value],
          }"
          @click="onNodeClick(item, index)"
        >
          <icon
            v-if="showIcon"
            :name="item[propsOption.icon] || ''"
          />
          <span :class="{ 'pad-l-xs': showIcon }">{{ item[propsOption.label] }}</span>
          <icon v-if="item[propsOption.children].length || ''" name="item-count el-icon-arrow-right" />
        </li>
      </scrollbar>
    </ul>
  </div>
</template>

<script>
const defaultProps = {
  label: 'label',
  value: 'id',
  icon: 'extent1',
  children: 'children',
  isLeaf: 'isLeaf',
};

export default {
  name: 'List',
  props: {
    // 列表标题
    header: {
      type: String,
      default: '',
    },
    // 列表数据
    data: {
      type: Array,
      default: () => ([]),
    },
    // 默认选中值索引
    defaultKey: {
      type: Number,
      default: -1,
    },
    // 配置项
    props: {
      type: Object,
      default: () => ({}),
    },
    // 是否自动省略(默认超出换行)
    ellipsis: {
      type: Boolean,
      default: false,
    },
    // 是否显示图标(会预留图标位置)
    showIcon: {
      type: Boolean,
      default: false,
    },
    // 显示子节点数量
    showChildCount: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    minHeight: {
      type: String,
      default: '100px',
    },
  },
  data() {
    return {
      row: {},
    };
  },
  computed: {
    propsOption() {
      return Object.assign(defaultProps, this.props);
    },
  },
  watch: {
    data(val) {
      if (val.length && this.defaultKey > -1) {
        this.row = val[this.defaultKey];
      }
    },
  },
  methods: {
    onNodeClick(data, index) {
      this.row = data;
      this.$emit('row-click', { data, index });
    },
    // 设定某一行为选中行, 若传空值，则取消当前选中
    setCurrentRow(data) {
      this.row = data || {};
    },
  },
};
</script>
