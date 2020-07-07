<template>
  <container class="page-icons">
    <div class="search-icon">
      <el-input
        ref="input"
        v-model="iconName"
        style="width: 50%"
        placeholder=" 请输入图标名称">
        <icon slot="prefix" name="el-icon-search" y="5px" />
      </el-input>
    </div>
    <div class="mar-t-sm text-info text-center">
      <span>共计引入 SVG 图标 {{iconCount}} 个，点击图标即可复制代码</span>
      <span>使用 icon 组件，提供属性： size（图标尺寸）、scale（缩放比例，不影响容器大小）、color（图标颜色）</span>
    </div>
    <div class="icon-group" v-for="(group, index) in option" :key="index">
      <h1>
        <span>{{ group.label }}</span>
        <span class="fn-right">{{ group.icon.length }} 个</span>
      </h1>
      <icon-item
        v-for="item in group.icon"
        v-show="item.includes(iconName)"
        :key="item"
        :icon="item" />
    </div>
  </container>
</template>

<script>
import IconItem from './components/IconItem';

const getIconName = (requireContext) => {
  const keys = requireContext.keys().map(requireContext);
  return keys.map(v => v.default.id);
};

export default {
  name: 'icons',
  components: {
    IconItem,
  },
  computed: {
    iconCount() {
      return this.option.map(v => v.icon.length).reduce((val, newVal) => val + newVal, 0);
    },
  },
  data() {
    return {
      iconName: '',
      option: [
        {
          label: '默认图标',
          icon: getIconName(require.context('@/assets/icons/common', false, /\.svg$/)),
        },
        {
          label: '文件类型',
          icon: getIconName(require.context('@/assets/icons/file-type', false, /\.svg$/)),
        },
        {
          label: '项目图标',
          icon: getIconName(require.context('@/assets/icons/project', false, /\.svg$/)),
        },
      ],
    };
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
  },
};
</script>
