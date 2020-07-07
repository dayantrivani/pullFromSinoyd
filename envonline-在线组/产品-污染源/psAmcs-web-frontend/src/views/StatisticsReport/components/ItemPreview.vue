<template>
  <dialog-modal ref="dialog" v-loading="loading" size="full" contentClass="fill-h" title="预览" @close="closeDialog">
    <el-scrollbar style="height: 100%">
      <div class="pad-x-sm pad-y-sm">
        <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导出</el-button>
        <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
      </div>
      <div class="pad-x-sm htmltable" v-html="vHtmlTable"></div>
    </el-scrollbar>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [],
  props: {
    // 废水(1),烟气(2)
    portType: {
      type: Number,
      default: 1,
    },
    query: {
      type: Object,
      default: () => ({
        ye: -1,                  // 值固定
        isAll: true,             // 是否选中所有站点
        portIds: [],             // 下拉框站点
        reportType: 'dayReport', // 数据类型
        fromDate: '',            // 开始时间
        toDate: '',              // 结束时间
      }),
    },
  },
  data() {
    return {
      loading: false,
      downloading: false,
      row: {},
      vHtmlTable: '',
      queryForm: {
        portId: '',
        reportType: '',
        fromDate: '',
        toDate: '',
      },
    };
  },
  computed: {
    url() {
      return `amcs/report/${this.$enum.getLabel('LABEL_CODE', this.portType).toLowerCase()}/html`;
    },
  },
  watch: {
  },
  created() {
  },
  methods: {
    openDialog(row) {       // 打开弹框
      this.row = _.cloneDeep(row);
      this.$refs.dialog.openDialog();
      this.getItemHTML();
    },
    getItemHTML() {         // 预览
      this.loading = true;
      const {
        reportType,
        fromDate,
        toDate,
      } = _.cloneDeep(this.query);
      this.$http.post(this.url, {
        fromDate,
        toDate,
        portId: this.row.portId,
        reportType,
      }).then((response) => {
        if (response.status === 200) {
          this.vHtmlTable = response.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    onDownload() {          // 下载请求
      const {
        reportType,
        fromDate,
        toDate,
      } = _.cloneDeep(this.query);
      const queryForm = {
        portId: this.row.portId,
        reportType,
        fromDate,
        toDate,
      };
      this.downloading = true;
      this.$http.post(`amcs/report/${this.$enum.getLabel('LABEL_CODE', this.portType).toLowerCase()}/excelReport`, queryForm, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.portType)}报表管理${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    closeDialog() {         // 关闭弹框
      this.row = {};
      this.vHtmlTable = '';
      this.queryForm = {
        portIds: '',
        reportType: '',
        fromDate: '',
        toDate: '',
      };
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
.htmltable{
  height: calc(100% - 48px);
  overflow: auto;
}
</style>
