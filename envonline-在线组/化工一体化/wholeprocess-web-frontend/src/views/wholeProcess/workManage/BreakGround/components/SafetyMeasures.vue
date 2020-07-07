<template>
  <dialog-modal ref="dialog"
                title="安全措施"
                maxScrollbar
                size="middle"
                @close="closeDialog">
    <el-card type="title">
       <el-form ref="form"
                label-width="100px"
                label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="安全交底：">
              <upload-file :id="objectId"
                          docTypeId="annex"
                          :is-update="isUpdate[0]"
                          :isRequest="isRequest[0]"
                          :size-limilt="0"
                          :btn="readOnly? 'down remove' : 'add down remove'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="施工方案：">
              <upload-file :id="objectId"
                          docTypeId="plann"
                          :is-update="isUpdate[1]"
                          :isRequest="isRequest[1]"
                          :size-limilt="0"
                          :btn="readOnly? 'down remove' : 'add down remove'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="其他附件：">
              <upload-file :id="objectId"
                          docTypeId="other"
                          :is-update="isUpdate[2]"
                          :isRequest="isRequest[2]"
                          :size-limilt="0"
                          :btn="readOnly? 'down remove' : 'add down remove'" />
            </el-form-item>
          </el-col>
        </el-row>
       </el-form>
    </el-card>
    <div class="mar-l-sm mar-t-xs mar-b-xs">
      <el-button type="primary"
                 icon="fa fa-plus"
                 @click="onClickAdd()">新 增</el-button>
      <el-button type="primary"
                 icon="fas fa-file-invoice"
                 @click="onClickTemp()">选择模板</el-button>
      <el-button type="danger"
                  icon='fas fa-trash-alt'
                  :disabled="!selectedIds.length"
                  @click="onDeleteItem()">删 除</el-button>
    </div>
    <el-table border
              highlight-current-row
              height="200px"
              v-loading="loading"
              :data="itemList"
              class="mar-b-sm"
              :row-class-name="rowClassName"
              @select="onChangeCheck"
              @select-all="onChangeCheckAll"
              @selection-change="onChangeSelected">
      <el-table-column align="center"
                        type="selection"
                        width="40"></el-table-column>
      <el-table-column align="center"
                       type="index"
                       width="50"
                       label="No."></el-table-column>
      <el-table-column align="center"
                        label="操作"
                        width="100"
                        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary"
                    icon="fas fa-pencil-alt"
                    @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="measuresContent"
                       header-align="center"
                       label="安全措施"
                       show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 @click="onSaveAnnex">保 存</el-button>
      <el-button icon="fa fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
    <dialog-measure ref="measure" @query="getItemList" />
    <measure-temp ref="temp" @query="getItemList" />
  </dialog-modal>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogMeasure from './components/DialogMeasure';
import MeasureTemp from './components/MeasureTemp';

export default {
  name: 'SafetyMeasures',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogMeasure,
    MeasureTemp,
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/workMeasures',
      loading: false,
      queryForm: {      // 查询表单绑定变量
        workId: '',     // 作业主键
        sort: 'orderNum-',
      },
      pager: {
        page: 1,
        rows: 999,
      },
      itemList: [],
      workId: '',
      // 附件相关
      objectId: '',
      isUpdate: [false, false, false],  // 是否调用上传附件的接口
      isRequest: [false, false, false], // 是否调用获取附件列表的接口
      readOnly: false,
    };
  },
  methods: {
    // 新增
    onClickAdd() {
      const item = { workId: this.queryForm.workId };
      this.$refs.measure.openDialog(item);
    },
    onClickEdit(row) {
      this.$refs.measure.openDialog(row);
    },
    // 模板
    onClickTemp() {
      this.$refs.temp.openDialog(this.queryForm.workId);
    },
    // 打开对话框
    openDialog(row) {
      this.isUpdate = [false, false, false];
      if (row) {
        this.workId = row.id;
        this.queryForm.workId = row.id;
        this.objectId = row.id;
        this.isRequest = [true, true, true];
        this.getItemList();
      }
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.isUpdate = [false, false, false];
      this.isRequest = [false, false, false];
      this.$refs.dialog.closeDialog();
    },
    // 获取安全措施
    getItemList() {
      const { page, rows } = this.pager;
      this.loading = true;
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
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
    // 保存附件
    onSaveAnnex() {
      this.objectId = this.queryForm.workId;
      this.isUpdate = [true, true, true];
      this.$nextTick(() => {
        this.$refs.dialog.closeDialog();
      });
    },
  },
};
</script>
