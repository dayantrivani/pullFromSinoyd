<template>
  <dialog-modal ref="psDialog" size="mini" maxScrollbar title="相关产业企业" @close="closeDialog">
    <el-form v-if="psNames.length !== 0" class="mar-t-xs pad-x-sm item-space" style="height:25rem;" v-loading="psList.length === 0">
      <div style="margin-top:1rem;" v-for="(item,index) in psNames" :key="index">
        <span>{{index+1}}：</span>
        <span style="color:#409EFF;">{{item}}</span>
      </div>
    </el-form>
    <div v-else style="min-height: 200px;">
      <p class="pad-y-lg mar-b-sm font-bold text-center" style="position: relartive; z-index: 9;">暂无数据</p>
      <div class="empty" style="top: 50%"></div>
    </div>
    <div slot="footer">
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
export default {
  // 使用混合
  props: {
    psList: {     // 企业列表
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      url: 'bas/parkIndustryPosition',        // 必须, 接口地址
      loading: false,               // 表单加载状态
      psIds: [], // 企业id列表
    };
  },
  computed: {
    psNames() {
      return this.getPsNames(this.psIds);
    },
  },
  methods: {
    openDialog(row) {
      this.$refs.psDialog.openDialog();
      this.psIds = row.psIds;
      // this.getPSIdList(row.psIds);
    },
    closeDialog() {       // 关闭对话框
      this.$refs.psDialog.closeDialog();
    },
    getPsNames(value) {
      const psNames = [];
      if (value.length) {
        value.forEach((element) => {
          const [first] = this.psList.filter(n => n.id === element).map(n => n.psName);
          psNames.push(first);
        });
      }
      return psNames;
    },
  },
};
</script>
