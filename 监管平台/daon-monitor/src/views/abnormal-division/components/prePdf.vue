<template>
  <a-modal
    style="top: 20px;"
    width="1250px"
    class="modal-pdf-class"
    :visible="pdfVisible"
    :maskClosable="false"
    :footer="false"
    :centered="true"
    @cancel="pdfVisible = false">
    <template slot="title">
      <span>预览报告文件</span>
      <a-button type="primary" @click="pdfPrintAll" title="打印" style="margin-left: 10px;">
        <a-icon type="inbox" />
      </a-button>
      <a-button type="primary" title="下载" @click="downloadPdf">
        <a-icon type="arrow-down" />
      </a-button>
    </template>
    <a-spin :spinning="spinning">
      <pdf :src="pdfUrl" ref="pdf"></pdf>
    </a-spin>
  </a-modal>
</template>

<script>
import pdf from 'vue-pdf';

export default {
  components: {
    pdf,
  },
  data() {
    return {
      pdfVisible: false,
      spinning: false,
      pdfUrl: '',
      item: {},
    };
  },
  methods: {
    openDialog(item) {
      this.pdfVisible = true;
      this.item = item;
      this.pdfUrl = `/api/monitor/static/files/${item.pdfPath}`;
    },
    // pdf打印事件
    pdfPrintAll() {
      this.$refs.pdf.print();
    },
    // 下载点击事件
    downloadPdf() {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.download = this.item.pdfName;
      a.href = `/api/monitor/static/files/${this.item.pdfPath}`;
      document.body.appendChild(a);
      a.click();
    },
  },
};
</script>

<style lang="scss" scoped>
  .modal-pdf-class{
    >.ant-modal-content{
      >.ant-modal-body{
        >.ant-spin-nested-loading{
          >.ant-spin-container{
            >span{
              width: 1200px;
            }
          }
        }
      }
    }
  }
</style>
