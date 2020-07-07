<!-- TODO: 弹性卡片 Components -->
<template>
  <el-row :gutter="$config.space" v-resize ref="box">
    <!-- 水平 -->
    <template v-if="type === 'horizontal'">
      <el-col :span="12" ref="left" :style="{'width' : `${boxWidth}%`}">
        <el-card type="title" class="card-flex">
          <template slot="header">
            <span v-if="!foldOne" class="el-card__title">{{ title[0] }}</span>
            <button type="button" class="el-card__headerbtn" @click="foldOne = !foldOne">
              <i :class="`icon icon-horizontal-${foldOne ? 'open' : 'close'}`"></i>
            </button>
          </template>
          <slot name="left"></slot>
        </el-card>
      </el-col>
      <el-col :span="12" ref="right" :style="{'width' : `${100 - boxWidth}%`}">
        <el-card type="title" class="card-flex">
          <template slot="header">
            <span v-if="!foldTwo" class="el-card__title">{{ title[1] }}</span>
            <button type="button" class="el-card__headerbtn" @click="foldTwo = !foldTwo">
              <i :class="`icon icon-horizontal-${foldTwo ? 'open' : 'close'}`"></i>
            </button>
          </template>
          <slot name="right"></slot>
        </el-card>
      </el-col>
    </template>
    <!-- 垂直 -->
    <template v-if="type === 'vertical'">
      <el-col :span="24" :h="6">
        <el-card type="title" class="card-flex">
          <template slot="header">
            <span class="el-card__title">{{ title }}</span>
            <button type="button" class="el-card__headerbtn" @click="isCollapse = !isCollapse">
              <i :class="`icon icon-vertical-${isFold ? 'open' : 'close'}`"></i>
            </button>
            <slot name="header"></slot>
          </template>
          <slot name="top" ref="top"></slot>
        </el-card>
      </el-col>
      <el-col :span="24" :h="6">
        <el-card type="title" class="card-flex">
          <template slot="header">
            <span class="el-card__title">{{ title }}</span>
            <button type="button" class="el-card__headerbtn" @click="isCollapse = !isCollapse">
              <i :class="`icon icon-vertical-${isFold ? 'open' : 'close'}`"></i>
            </button>
            <slot name="header"></slot>
          </template>
          <slot name="button" ref="button"></slot>
        </el-card>
      </el-col>
    </template>
  </el-row>
</template>

<script>
export default {
  name: 'CardFlex',
  props: {
    // 是否折叠收起菜单
    title: {
      type: Array,
      default: () => (['', '']),
    },
    // 是否折叠收起菜单
    collapse: {
      type: Boolean,
      default: false,
    },
    // 类型 horizontal(水平)、vertical(垂直)
    type: {
      validator: val => (['horizontal', 'vertical'].includes(val)),
    },
  },
  data() {
    return {
      // 是否折叠
      foldOne: false,
      foldTwo: false,
      boxWidth: 0,
      leftlWidth: 0,
      rightWidth: 0,
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.boxWidth = 50 / this.getElemAttrVal(this.$refs.box.$el) * 100;
    },
    getElemAttrVal(elem, AttrName = 'width') {
      const oStyle = elem.currentStyle ? elem.currentStyle : window.getComputedStyle(elem, null);
      const val = oStyle.getPropertyValue ? oStyle.getPropertyValue(AttrName) : oStyle.getAttribute(AttrName);
      return parseFloat(val);
    },
  },
};
</script>
