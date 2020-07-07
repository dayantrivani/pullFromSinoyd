<!-- Page: 总体监控情况 -->
<template>
  <container padding="0">
    <div v-if="showBtn" class="btn-layout pad-x-md pad-t-sm text-right">
      <el-button type="dashed" icon="undo" size="small" @click="onResetLayout()">还原</el-button>
      <el-button type="primary" icon="check" size="small" @click="onSaveLayout()">保存</el-button>
    </div>
    <grid-layout
      ref="gridLayout"
      class="i-no-select"
      :layout.sync="defaultWidgets"
      :row-height="50"
      :cols="{ lg: 12, md: 12, sm: 6, xs: 6, xxs: 6 }"
      :responsive="true"
      :use-css-transforms="true"
      :margin="[$config.layout.scope, $config.layout.scope]"
    >
      <grid-item
        v-for="wd in defaultWidgets"
        :key="wd.i"
        :i="wd.i"
        :x="wd.x"
        :y="wd.y"
        :h="wd.h"
        :w="wd.w"
        :isResizable="wd.isResizable"
        :dragAllowFrom="wd.dragAllowFrom || '.el-card__header'"
        :dragIgnoreFrom="wd.dragIgnoreFrom || 'a, button'"
      >
        <component v-bind:is="wd.i" @to="onToPage" />
      </grid-item>
    </grid-layout>
  </container>
</template>

<script>
import VueGridLayout from 'vue-grid-layout';
import config from '@/config/app.config';
import { setLocalStorage, getLocalStorage } from '@/libs/tools';
import defaultLayout from './components/default-config';

const localKey = config.localKey.homeLayout;
const widgets = () => getLocalStorage(localKey) || defaultLayout();

export default {
  name: 'CustomLayout',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    // 运维统计 - 按需引入方式
    OmStatistics: () => import('./components/OmStatistics'),
    // 重点项目
    MajorProject: () => import('./components/MajorProject'),
    // 通知公告
    Notification: () => import('./components/Notification'),
    // 办公审批
    OfficeApproval: () => import('./components/OfficeApproval'),
    // 办公审批
    ShortcutLink: () => import('./components/ShortcutLink'),
  },
  data() {
    return {
      show: false,
      showBtn: false,
      defaultWidgets: widgets(),
    };
  },
  watch: {
    defaultWidgets: {
      handler(val) {
        this.showBtn = !(JSON.stringify(val) === JSON.stringify(widgets()));
      },
      deep: true,
    },
  },
  mounted() {
    // 修复初始布局计算忽略了滚动条的问题
    this.$nextTick(() => {
      this.$refs.gridLayout.onWindowResize();
    });
  },
  methods: {
    // 页面跳转
    onToPage(name) {
      this.$router.replace({ name });
    },
    // 重置布局
    onResetLayout() {
      this.defaultWidgets = widgets();
    },
    // 保存布局
    onSaveLayout() {
      setLocalStorage(localKey, this.defaultWidgets);
      this.showBtn = false;
      this.$message.success('保存成功');
    },
  },
};
</script>

<style lang="scss">
  .page-dashboard {
    .vue-grid-item {
      > div { height: inherit !important; }
      .ant-card {
        border: none;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
      }
      .ant-card-head { border-bottom: 1px solid #f6f6f6; }
    }
    .btn-layout {
      margin: $-scope $-scope 0;
      padding: 5px $-scope;
      background-color: $-color-white;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
      border-left: 2px solid $--color-primary;
      transition: right $-transition;
    }
  }
</style>
