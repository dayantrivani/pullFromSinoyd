<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline
               :model="queryForm">
        <el-form-item label="会议主题："
                      prop="subject">
          <el-input v-model="queryForm.subject"></el-input>
        </el-form-item>
        <el-form-item label="会议开始时间：">
          <el-date-picker v-model="queryForm.fromTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="会议结束时间：">
          <el-date-picker v-model="queryForm.toTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="会议类型："
                      prop="type">
          <el-select v-model="queryForm.type"
                     autofocus
                     clearable>
            <el-option v-for="item in $enum.CONFERENCETYPE"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议状态："
                      prop="status">
          <el-select v-model="queryForm.status"
                     autofocus
                     clearable>
            <el-option v-for="item in $enum.CONFERENCESTATUS"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary"
                 icon="fas fa-plus"
                 @click="onOpenDialog()">新 增</el-button>
      <el-button type="danger"
                 icon="fas fa-trash-alt"
                 :disabled="!selectedIds.length"
                 @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table border
              highlight-current-row
              height="calc(100% - 71px)"
              v-loading="loading"
              :data="itemList"
              :row-class-name="rowClassName"
              @select="onChangeCheck"
              @select-all="onChangeCheckAll"
              @selection-change="onChangeSelected">
      <el-table-column align="center"
                       type="selection"
                       width="40"></el-table-column>
      <el-table-column align="center"
                       label="No."
                       width="50"
                       type="index"
                       :index="index"></el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="120"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="fas fa-pencil-alt"
                     @click="onOpenDialog(scope.row)">详细</el-button>
          <el-button type="primary"
                     icon="fas fa-cloud-download-alt"
                     @click="onQueryDocId(scope.row)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column property="subject"
                       label="会议主题"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="conferenceDate"
                       label="会议时间"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="status"
                       label="状态"
                       min-width="100"
                       show-overflow-tooltip>
        <template slot-scope="scope">{{$enum.getLabel('CONFERENCESTATUS',scope.row.status)}}</template>
      </el-table-column>
      <el-table-column property="type"
                       label="会议类型"
                       min-width="150"
                       show-overflow-tooltip>
        <template slot-scope="scope">{{$enum.getLabel('CONFERENCETYPE',scope.row.type)}}</template>
      </el-table-column>
      <el-table-column property="address"
                       label="地址"
                       min-width="150"
                       show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager"
                  @query="getItemList()" />
    <form-dialog @query="getItemList"
                 ref="formDialog"></form-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import formDialog from './components/formDialog';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [queryList, deleteItem],
  components: { formDialog },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  data() {
    return {
      url: 'wholeprocess/safetyConference',
      isAuto: false,
      queryForm: {
        psId: '',
        subject: '',
        fromTime: '',
        toTime: '',
        type: '',
        status: '',
        sort: 'conferenceDate-',
      },
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.onQueryList();
  },
  methods: {
    // 新增编辑窗口
    onOpenDialog(row) {
      this.$refs.formDialog.openDialog(row);
    },
    // 调取文件id接口
    onQueryDocId(row) {
      this.$http.get('res/document', {
        params: {
          objectId: row.id,
        },
      }).then((response) => {
        if (response.status === 200) {
          const [first] = response.data.data;
          if (first) {
            this.onDownloadClick(first);
          } else {
            this.$message.warning({
              message: '文件为空',
              duration: 1500,
              showClose: true,
            });
          }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 下载文件
    onDownloadClick(row) {
      this.$http.get(`res/document/download?id=${row.id}`, {
        responseType: 'blob',
      }).then((response) => {
        const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
        if (isFaild) {
          const reader = new FileReader();
          reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
          reader.readAsText(response.data);
        } else {
          const fileName = row.docName;
          const blob = new Blob([response.data], { type: 'application/x-xls' });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        }
      }, (response) => {
        analyzeResp(response);
      });
    },
  },
};
</script>
