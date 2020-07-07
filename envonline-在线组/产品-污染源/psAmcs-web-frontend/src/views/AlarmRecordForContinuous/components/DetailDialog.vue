<template>
  <dialog-modal ref="dialog" size="mini" maxScrollbar title="详细超标清单" @close="closeDialog">
    <el-form class="mar-t-xs pad-x-sm item-space" style="height:25rem;" v-loading="loading">
      <div style="margin-top:1rem;" v-for="(item,index) in fileList" :key="index">
        <div>
          <span style="color:#409EFF;">编码：</span>
          <span>{{item.factorCode}}</span>
        </div>
        <div>
          <span style="color:#409EFF;">名称：</span>
          <span>{{item.factorName}}</span>
        </div>
        <div>
          <span style="color:#409EFF;">上限：</span>
          <span>{{item.upperValue}}</span>
        </div>
        <div>
          <span style="color:#409EFF;">下限：</span>
          <span>{{item.lowValue}}</span>
        </div>
        <div>
          <span style="color:#409EFF;">单位：</span>
          <span>{{item.unit}}</span>
        </div>
        <div>
          <span style="color:#409EFF;">超标范围：</span>
          <span>{{item.exceedRange}}</span>
        </div>
        <div>
          <span style="color:#409EFF;">超标时段：</span>
          <span>{{item.exceedTime}}</span>
        </div>
        <div>
          <span style="color:#409EFF;">超标次数：</span>
          <span>{{item.exceedCount}}</span>
        </div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>

export default {
  data() {
    return {
      fileList: [], // 附件列表
    };
  },
  methods: {
    // 打开对话框
    openDialog(details) {
      // 合并参数对象
      this.fileList = details;
      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.fileList = [];
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
