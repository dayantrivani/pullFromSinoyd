<template>
  <!-- 任务报告 -->
  <div>
  <table class="debriefing-table">
    <thead>
      <tr>
        <th width="22">No.</th>
        <th>报告标题</th>
        <th>仪器</th>
        <th width="80">报告状态</th>
        <th width="120">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(report, index) in taskData.reports" :key="report.id">
        <td>{{index + 1}}</td>
        <td>{{report.title}}</td>
        <td>{{report.instrument ? report.instrument.name : '-'}}</td>
        <td>
          <!-- <el-tag :class="report.signed_at ? 'bg-success' : ''">
            {{ report.signed_at ? '已确认' : '未确认' }}
          </el-tag> -->
        </td>
        <td>
          <a-button title="点击预览" @click="previewClick(report)">
            <a-icon type="zoom-in" />
          </a-button>
        </td>
      </tr>
    </tbody>
  </table>
  <!--显示上传的附件-->
  <!-- <table class="table mar-top-10">
    <thead>
      <tr>
        <th width="22">#</th>
        <th>附件标题</th>
        <th>上传人</th>
        <th width="120">上传时间</th>
        <th width="100">查看</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in attachmentList" :key="index">
        <td>{{index + (currentAttachmentPage - 1) * attachmentPageSize + 1}}</td>
        <td>{{ item.filename }}</td>
        <td>{{ item.staff ? item.staff.name : '' }}</td>
        <td>{{ item.created_at | dateFilter }}</td>
        <td> -->
          <!-- <el-button :disabled="!judgePictureSuffix(item.store)"
            :title="!judgePictureSuffix(item.store) ? '非图片形式，无法预览' : '图片预览'"
            @click="toBig(item.store)" size="small"
            style="text-align: center;margin-right: 8px;">
          </el-button> -->
          <!-- <a-button icon="search" title="查看" @click="toBig(item.store)"></a-button> -->
          <!-- <div class="box-inline">
            <a-button icon="download"></a-button>
            <el-popover placement="top" width="200" @show="getDownloadSrc(item.store)">
              <p>你确定要下载文件吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="emulateDocumentClick()">取消</el-button>
                <a class="el-button el-button--primary el-button--mini" @click="emulateDocumentClick()"
                  :href="downloadUrl" :download="item.filename" target="_blank"> 确定</a>
              </div>
              <el-button slot="reference" size="small" title="下载">
                <i class="fa fa-download"></i>
              </el-button>
            </el-popover>
          </div> -->
        <!-- </td>
      </tr>
    </tbody>
  </table> -->
  <a-modal
    style="top: 20px;"
    width="1250px"
    class="modal-pdf-class"
    :visible="pdfVisible"
    :maskClosable="false"
    :footer="false"
    :centered="true"
    @cancel="closeDialog">
    <template slot="title">
      <span>预览报告文件</span>
      <a-button type="primary" @click="pdfPrintAll" title="预览文件" style="margin-left: 10px;">
        <a-icon type="inbox" />
      </a-button>
      <a-button type="primary" title="点击下载" @click="downloadPdf">
        <a-icon type="arrow-down" />
      </a-button>
    </template>
    <a-spin :spinning="spinning">
      <pdf :src="pdfUrl" ref="pdf"></pdf>
    </a-spin>
  </a-modal>
  </div>
</template>

<script>
import pdf from 'vue-pdf';
import { getTaskExport } from '@/api/modules/operat-records.js';

export default {
  name: 'debriefing',
  components: {
    pdf,
  },
  data() {
    return {
      pdfVisible: false,
      taskData: {},
      item: {},
      pdfUrl: '',
      spinning: false,
      // 报告列表tab中的附件数据
      attachmentList: [],
      // 报表列表中附件的翻页绑定
      totalAttachmentItem: 0,
      currentAttachmentPage: 1,
      attachmentPageSize: 15,
    };
  },
  methods: {
    // 查看图片
    // toBig(item) {
    //   console.log(item);
    // },
    // 请求附件数据
    getAttachmentList() {
      this.$axios.request({
        url: `/api/monitor/task/${this.taskData.id}/attachment`,
        method: 'get',
        params: { page: this.currentAttachmentPage, size: this.attachmentPageSize, with_staff: 1 },
      }).then((response) => {
        // console.log(response);
        this.attachmentList = response.data.data;
        this.attachmentPageSize = response.data.per_page;
        this.totalAttachmentItem = response.data.total;
      });
    },
    closeDialog() {
      this.pdfVisible = false;
    },
    // 查看点击事件
    previewClick(item) {
      this.item = item;
      this.spinning = true;
      this.pdfVisible = true;
      getTaskExport(item.id).then((res) => {
        this.spinning = false;
        this.pdfUrl = res.data.data.url;
      });
    },
    // pdf打印事件
    pdfPrintAll() {
      this.$refs.pdf.print();
    },
    // 下载点击事件
    downloadPdf() {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.download = `${this.item.title}.pdf`;
      a.href = this.pdfUrl;
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
  .debriefing-table{
    margin-top: 10px;
    width: 100%;
    tr{
      border: 1px solid #E9E9E9;
      height: 35px;
    }
    th{
      color: #404244;
      font-weight: bold;
      min-width: 80px;
    }
    td{
      min-width: 80px;
    }
    td,th{
      padding: 5px 10px 5px 10px;
    }
  }
</style>
