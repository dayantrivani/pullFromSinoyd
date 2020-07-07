<template>
  <dialog-modal ref="dialog"
                title="审核"
                maxScrollbar
                size="small"
                @close="closeDialog">
    <el-form ref="form"
             :rules="rules"
             :model="itemModel"
             v-loading="formLoading"
             label-position="right"
             label-width="100px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="审核意见：" prop="status">
            <el-select v-model="itemModel.status"
                       style="width:50px;">
              <el-option label="同意" :value="10"></el-option>
              <el-option label="拒绝" :value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="审核说明：" prop="auditRemark">
            <el-input type="textarea"
                  :rows="4"
                  v-model="itemModel.auditRemark">
                </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="text-center mar-b-xs">
          <el-button type="primary"
                  icon="fa fa-save"
                  :loading="saveLoading"
                  @click="onSaveCheck(saveCallback)">确认审核</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table border
              highlight-current-row
              height="calc(40vh - 40px)"
              v-loading="loading"
              :data="itemList"
              class="mar-b-sm"
              :row-class-name="rowClassName">
      <el-table-column align="center"
                       type="index"
                       width="50"
                       label="No."></el-table-column>
      <el-table-column header-align="center"
                       prop="auditRemark"
                       label="审核内容"
                       show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
import { queryList, saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'BlindBoardWorkAudit',
  mixins: [
    queryList,
    saveItem,
  ],
  components: {
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/workAuditLog',
      loading: false,
      itemList: [],
      queryForm: {
        workId: '',
        sort: 'createDate-',
      },
      itemModel: this.getEmptyItem(),
      // 表单验证
      rules: {
        status: [
          { required: true, message: '请选择审核意见', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  methods: {
    // 获取初始对象
    getEmptyItem() {
      return {
        workId: '',
        workType: 16, // 16 盲板抽堵作业
        status: 10,   // 审核状态 0未审核 5审核不通过 10审核通过
        auditRemark: '',
      };
    },
    // 保存回调
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    // 打开对话框
    openDialog(id) {
      this.queryForm.workId = id;
      this.itemModel = Object.assign(this.getEmptyItem(), {
        workId: id,
      });
      this.getDealLog();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.closeDialog();
    },
    getDealLog() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
  },
};
</script>
