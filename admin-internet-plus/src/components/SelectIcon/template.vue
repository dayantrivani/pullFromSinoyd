<!-- 图标选择器
<select-icon v-model=[绑定变量] :data=[选项数据] />
-->

<template>
  <el-popover
    v-model="popoverVisible"
    placement="bottom-start"
    popper-class="pupop-select-icon"
    transition="el-zoom-in-top"
    trigger="click"
    :disabled="disabledSelected"
  >
    <!-- 页面显示内容区 -->
    <el-tooltip slot="reference" effect="light" placement="right" :content="value" :disabled="!value">
      <div
        :class="{
          'mod-select-icon': 1,
          'is-opened': popoverVisible,
          'is-active': value,
          'is-disabled': disabledSelected
        }"
      >
        <!-- 显示图标 -->
        <div :class="{ 'icon-item': 1, 'btn-add': !value }">
          <icon :name="value || 'plus'" :y="value ? '' : '3px'" />
        </div>
        <!-- 清空按钮 -->
        <div v-show="value" class="btn-clear" @click.stop="onClickClear()">
          <icon name="close" color="white" />
        </div>
      </div>
    </el-tooltip>
    <!-- 弹出框内容区 -->
    <div class="search">
      <el-input
        ref="input"
        v-model="iconKey"
        clearable
        class="flex-1 mar-r-sm"
        prefix-icon="el-icon-search"
        placeholder="请输入图标类名"
      ></el-input>
    </div>
    <scrollbar v-if="popoverVisible" height="calc(100% - 48px)" :show-scroll="false">
      <!-- 图标项 -->
      <div
        v-for="item in filterData"
        :key="item"
        :title="item"
        :class="{ 'icon-item': 1, 'is-active': isActive(item) }"
        @click="onClickSelected(item)"
      >
        <icon :name="item" />
      </div>
    </scrollbar>
  </el-popover>
</template>

<script>
const getIconName = () => {
  const common = require.context('@/assets/icons/common', false, /\.svg$/);
  const fileType = require.context('@/assets/icons/file-type', false, /\.svg$/);
  const project = require.context('@/assets/icons/project', false, /\.svg$/);
  const commonKeys = common.keys().map(common);
  const fileTypeKeys = fileType.keys().map(fileType);
  const projectKeys = project.keys().map(project);
  return [...commonKeys, ...fileTypeKeys, ...projectKeys].map(v => v.default.id) || [];
};

export default {
  name: 'SelectIcon',
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    disabled: Boolean,
    // 接收绑定参数 - 图标类名
    value: {
      type: String,
      required: true,
    },
    // 选项数据
    data: {
      type: Array,
      default: () => getIconName(),
    },
  },
  data() {
    return {
      // 弹出框显示状态
      popoverVisible: false,
      // 图标类名检索
      iconKey: '',
    };
  },
  computed: {
    disabledSelected() {
      if (this.disabled) return true;
      return this.$parent.form ? this.$parent.form.disabled : false;
    },
    filterData() {
      if (this.iconKey) {
        const items = this.data.filter(v => v.includes(this.iconKey));
        return items.length ? this.data : [this.iconKey];
      }
      return this.data;
    },
  },
  watch: {
    popoverVisible(val) {
      if (val) {
        this.iconKey = '';
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
    },
  },
  methods: {
    // 是否为当前已选项
    isActive(item) {
      return this.value === item;
    },
    // 选中图标
    onClickSelected(item) {
      this.$emit('selected', item);
      this.popoverVisible = false;
    },
    // 清空选项
    onClickClear() {
      this.$emit('selected', '');
    },
  },
};
</script>
