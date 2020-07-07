<template>
  <container>
    <!-- 主题风格设置 -->
    <el-card shadow="never">
      <div slot="header" class="el-card__title">
        <icon name="theme" scale="1.3" />
        <span class="pad-l-sm">主题风格设置</span>
      </div>
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="8">
          <div class="pad-b-sm">主题色</div>
          <div class="select-theme">
            <span v-for="i in 7" :key="i" :theme="i" class="item-color" @click="customModel.theme = i">
              <icon v-if="customModel.theme === i" name="check" y="3px" />
            </span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="pad-b-sm">顶栏配色</div>
          <el-radio-group v-model="customModel.themeHead">
            <el-radio label="light" class="mar-r-sm">浅色</el-radio>
            <el-radio label="dark" class="mar-r-sm">深色</el-radio>
            <el-radio label="theme">跟随主题</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="pad-b-sm">侧栏折叠按钮显示</div>
          <el-checkbox v-model="customModel.showSideBtnTop">顶栏左边</el-checkbox>
          <el-checkbox v-model="customModel.showSideBtnMiddle">侧栏贴边</el-checkbox>
          <el-checkbox v-model="customModel.showSideBtnBottom">侧栏底部</el-checkbox>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="pad-y-sm">侧栏配色</div>
          <el-radio-group v-model="customModel.themeSide">
            <el-radio label="light" class="mar-r-sm">浅色</el-radio>
            <el-radio label="dark" class="mar-r-sm">深色</el-radio>
            <el-radio label="theme">跟随主题</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </el-card>

    <!-- 导航设置 -->
    <el-card shadow="never" class="mar-t-scope">
      <div slot="header" class="el-card__title">
        <icon name="nav" scale="2" />
        <span class="pad-l-sm">导航设置</span>
      </div>
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="8">
          <div class="item-option">
            <label class="label">固定顶栏</label>
            <el-switch v-model="customModel.headFixed"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div :class="{ 'item-option': 1, 'is-disabled': !customModel.headFixed }">
            <label class="label">置顶顶栏 </label>
            <el-tooltip content="需开启固定顶栏, 此模式下应用标题可完整显示">
              <span class="text-info"><icon name="query" y="-1px" /></span>
            </el-tooltip>
            <el-switch v-model="customModel.headStick" :disabled="!customModel.headFixed"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div :class="{ 'item-option': 1, 'is-disabled': !customModel.headFixed }">
            <label class="label">下滑时隐藏顶栏 </label>
            <el-tooltip content="需开启固定顶栏">
              <span class="text-info"><icon name="query" y="-1px" /></span>
            </el-tooltip>
            <el-switch v-model="customModel.headGlideHide" :disabled="!customModel.headFixed"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="item-option">
            <label class="label">固定侧边栏</label>
            <el-switch v-model="customModel.sideFixed"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="item-option">
            <label class="label">侧边栏默认展开</label>
            <el-switch v-model="customModel.sideCollapse"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="item-option">
            <label class="label">侧边栏开启手风琴模式</label>
            <el-switch v-model="customModel.sideAccordion"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="item-option">
            <label class="label">隐藏侧栏导航子菜单图标</label>
            <el-switch v-model="customModel.hideChildIcon"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="item-option">
            <label class="label">显示全局面包屑导航</label>
            <el-switch v-model="customModel.crumbsShow"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div :class="{ 'item-option': 1, 'is-disabled': !customModel.crumbsShow }">
            <label class="label">全局面包屑显示图标 </label>
            <el-tooltip content="需开启全局面包屑导航">
              <span class="text-info"><icon name="query" y="-1px" /></span>
            </el-tooltip>
            <el-switch v-model="customModel.crumbsIconShow" :disabled="!customModel.crumbsShow"></el-switch>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 多页签设置 -->
    <el-card shadow="never" class="mar-t-scope">
      <div slot="header" class="el-card__title">
        <icon name="tags" scale="1.2" />
        <span class="pad-l-sm">多页签设置</span>
      </div>
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="8">
          <div class="item-option">
            <label class="label">开启多页签</label>
            <el-switch v-model="customModel.tagsUse"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div :class="{ 'item-option': 1, 'is-disabled': !customModel.tagsUse }">
            <label class="label">多页签显示图标 </label>
            <el-tooltip content="需开启多页签">
              <span class="text-info"><icon name="query" y="-1px" /></span>
            </el-tooltip>
            <el-switch v-model="customModel.tagsIconShow" :disabled="!customModel.tagsUse"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div :class="{ 'item-option': 1, 'is-disabled': !customModel.tagsUse }">
            <label class="label">多页签允许锁定 </label>
            <el-tooltip content="需开启多页签">
              <span class="text-info"><icon name="query" y="-1px" /></span>
            </el-tooltip>
            <el-switch v-model="customModel.tagsLockShow" :disabled="!customModel.tagsUse"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div :class="{ 'item-option': 1, 'is-disabled': !customModel.tagsUse }">
            <label class="label">固定多页签 </label>
            <el-tooltip content="需开启多页签">
              <span class="text-info"><icon name="query" y="-1px" /></span>
            </el-tooltip>
            <el-switch v-model="customModel.tagsFixed" :disabled="!customModel.tagsUse"></el-switch>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div :class="{ 'item-option': 1, 'is-disabled': !customModel.tagsUse }">
            <label class="label">多页签并入顶栏 </label>
            <el-switch v-model="customModel.tagsMoveTop" :disabled="!customModel.tagsUse"></el-switch>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </container>
</template>

<script>
export default {
  name: 'ThemeConfig',
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
};
</script>
