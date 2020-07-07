<template>
  <div class="btn item-theme">
    <button
      title="个性化设置"
      :class="{ 'btn': 1, 'is-opened': visibleDrawer }"
      @click="open()">
      <icon name="icon-theme-skin" size="1.4em" />
    </button>
    <a-drawer
      placement="right"
      wrapClassName="pupop-theme"
      destroyOnClose
      :closable="false"
      :visible="visibleDrawer"
      @close="close()">
      <a-divider>主题风格设置</a-divider>
      <div class="label-block">侧栏配色</div>
      <div class="item-theme-type">
        <span :class="{ 'item-preview': 1, 'is-active': customModel.themeSide === 'dark' }" @click="customModel.themeSide = 'dark'">
          <span class="block"></span>
          <span class="mask"></span>
        </span>
        <span :class="{ 'item-preview': 1, 'is-active': customModel.themeSide === 'light' }" @click="customModel.themeSide = 'light'">
          <icon v-show="customModel.theme === 'light'" name="check" />
          <span class="block"></span>
          <span class="mask"></span>
        </span>
      </div>
      <div class="label-block">主题色</div>
      <div class="item-theme-color">
        <span v-for="i in 9" :key="i" :theme="i" class="item-color" @click="customModel.theme = i">
          <icon v-show="customModel.theme === i" name="check" />
        </span>
      </div>
      <a-divider>导航设置</a-divider>
      <div class="item-option">
        <label class="label">固定顶栏</label>
        <a-switch v-model="customModel.headFixed" size="small"></a-switch>
      </div>
      <div :class="{ 'item-option': 1, 'is-disabled': !customModel.headFixed }">
        <label class="label">置顶顶栏</label>
        <hint title="需开启固定顶栏" />
        <a-switch v-model="customModel.headStick" :disabled="!customModel.headFixed" size="small"></a-switch>
      </div>
      <div :class="{ 'item-option': 1, 'is-disabled': !customModel.headFixed }">
        <label class="label">下滑时隐藏顶栏</label>
        <hint title="需开启固定顶栏" />
        <a-switch v-model="customModel.headGlideHide" :disabled="!customModel.headFixed" size="small"></a-switch>
      </div>
      <div class="item-option">
        <label class="label">固定侧边栏</label>
        <a-switch v-model="customModel.sideFixed" size="small"></a-switch>
      </div>
      <div class="item-option">
        <label class="label">显示折叠侧边栏按钮</label>
        <a-switch v-model="customModel.sideBtnShow" size="small"></a-switch>
      </div>
      <div class="item-option">
        <label class="label">侧边栏默认折叠状态</label>
        <a-switch v-model="customModel.sideCollapse" size="small"></a-switch>
      </div>
      <div class="item-option">
        <label class="label">侧边栏开启手风琴模式</label>
        <a-switch v-model="customModel.sideAccordion" size="small"></a-switch>
      </div>
      <div class="item-option">
        <label class="label">显示全局面包屑导航</label>
        <a-switch v-model="customModel.crumbsShow" size="small"></a-switch>
      </div>
      <div :class="{ 'item-option': 1, 'is-disabled': !customModel.crumbsShow }">
        <label class="label">全局面包屑显示图标</label>
        <hint title="需开启全局面包屑导航" />
        <a-switch v-model="customModel.crumbsIconShow" :disabled="!customModel.crumbsShow" size="small"></a-switch>
      </div>
      <a-divider>其它设置</a-divider>
      <div class="item-option">
        <label class="label">开启多页签</label>
        <a-switch v-model="customModel.tagsUse" size="small"></a-switch>
      </div>
      <div :class="{ 'item-option': 1, 'is-disabled': !customModel.tagsUse }">
        <label class="label">多页签显示图标</label>
        <hint title="需开启多页签" />
        <a-switch v-model="customModel.tagsIconShow" :disabled="!customModel.tagsUse" size="small"></a-switch>
      </div>
      <div :class="{ 'item-option': 1, 'is-disabled': !customModel.tagsUse }">
        <label class="label">多页签允许锁定</label>
        <hint title="需开启多页签" />
        <a-switch v-model="customModel.tagsLockShow" :disabled="!customModel.tagsUse" size="small"></a-switch>
      </div>
      <div :class="{ 'item-option': 1, 'is-disabled': !customModel.tagsUse }">
        <label class="label">固定多页签</label>
        <hint title="需开启多页签" />
        <a-switch v-model="customModel.tagsFixed" :disabled="!customModel.tagsUse" size="small"></a-switch>
      </div>
    </a-drawer>
  </div>
</template>

<script>
export default {
  name: 'ItemTheme',
  inject: ['app'],
  data() {
    return {
      visibleDrawer: false,
      customModel: this.app.custom,
    };
  },
  watch: {
    customModel: {
      handler(val) {
        this.app.setCustomConfig(val);
      },
      deep: true,
    },
  },
  methods: {
    open() {
      this.visibleDrawer = true;
    },
    close() {
      this.visibleDrawer = false;
    },
  },
};
</script>
