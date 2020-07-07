<!-- 图标选择器
<select-icon v-model=[绑定变量] :data=[选项数据] />
-->

<template>
  <el-popover
    placement="bottom-start"
    popper-class="pupop-select-icon"
    transition="el-zoom-in-top"
    trigger="click"
    v-model="popoverVisible"
    :disabled="disabledSelected">
    <!-- 弹出框内容区 -->
    <el-scrollbar
      v-if="popoverVisible"
      class="hide-x"
      :native="false"
      :noresize="false">
      <!-- 图标项 -->
      <div
        class="icon-item"
        v-for="item in options"
        :key="item"
        :class="{ 'is-active': isActive(item) }"
        @click="onClickSelected(item)">
        <i :class="item"></i>
      </div>
    </el-scrollbar>
    <!-- 页面显示内容区 -->
    <template slot="reference">
      <div :class="{
        'mod-select-icon': 1,
        'is-opened': popoverVisible,
        'is-active': value,
        'is-disabled': disabledSelected
        }">
        <!-- 显示图标 -->
        <div class="icon-item">
          <i :class="value || 'el-icon-plus'"></i>
        </div>
        <!-- 清空按钮 -->
        <div v-show="value" class="btn-clear">
          <i class="el-icon-close" @click.stop="onClickClear()"></i>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script>
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
    options: {
      type: Array,
      default: () => ([
        'icon icon-zaoshengjiance',            // 噪声检测
        'icon icon-shuizhijiance',             // 水质检测
        'icon icon-qitijiance',                // 气体检测
        'icon icon-turangjiance',              // 土壤检测
        'icon icon-baowenfanghuocailiao',      // 保温防火材料
        'icon icon-dianzidianqijiance',        // 电子电器检测
        'icon icon-dianxiandianlanjiance',     // 电线电缆检测
        'icon icon-huagongzhuji',              // 化工助剂
        'icon icon-guidaojiaotongjiance',      // 轨道交通检测
        'icon icon-huagongchanpin',            // 化工产品
        'icon icon-jinshuzhipinjiance',        // 金属制品检测
        'icon icon-fangzhipinjiance',          // 纺织品检测
        'icon icon-kuangshijiance',            // 矿石检测
        'icon icon-shihuachanpinjiance',       // 石化产品检测
        'icon icon-huanjingkekaoxingjiance',   // 环境可靠性检测
        'icon icon-jiayongdianqijiance',       // 家用电器检测
        'icon icon-pigejiance',                // 皮革检测
        'icon icon-huagongyuanliao',           // 化工原料
        'icon icon-jianzhuyuancaijiance',      // 建筑原材检测
        'icon icon-huazhuangpinjiance',        // 化妆品检测
        'icon icon-rihuachanpinjiance',        // 日化产品检测
        'icon icon-wusunjiance',               // 无损检测
        'icon icon-qichehuaxuejiance',         // 汽车化学检测
        'icon icon-yinpinjiance',              // 饮品检测
        'icon icon-meitanjiance',              // 煤炭检测
        'icon icon-suliaojiance',              // 塑料检测
        'icon icon-shihuaqitijiance',          // 石化气体检测
        'icon icon-youpinjiance',              // 油品检测
        'icon icon-jinshuyuancaijiance',       // 金属原材检测
        'icon icon-baozhuangcailiao',          // 包装材料
        'icon icon-zhuanghuangcailiaojiance',  // 装潢材料检测
        'icon icon-dianqixiangguanjiance',     // 电器相关检测
        'icon icon-qichepeijianjiance',        // 汽车配件检测
        'icon icon-youqituliaojiance',         // 油漆涂料检测
        'icon icon-qichedianzijiance',         // 汽车电子检测
        'icon icon-xiangjiaojiance',           // 橡胶检测
        'icon icon-shipinjiance',              // 食品检测
        'icon icon-yiliaoqixie',               // 医疗器械
        'icon icon-zhaomingchanpinjiance',     // 照明产品检测
        'icon icon-yaopinjiance',              // 药品检测
      ]),
    },
  },
  computed: {
    disabledSelected() {
      if (this.disabled) return true;
      return this.$parent.form ? this.$parent.form.disabled : false;
    },
  },
  data() {
    return {
      // 弹出框显示状态
      popoverVisible: false,
    };
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
