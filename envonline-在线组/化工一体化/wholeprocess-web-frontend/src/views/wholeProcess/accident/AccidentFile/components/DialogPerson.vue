<template>
  <dialog-modal ref="dialog"
                title="伤亡人员"
                maxScrollbar
                size="middle"
                @close="closeDialog">
    <div class="mar-b-sm">
      <el-button type="primary"
                 icon="fa fa-plus"
                 @click="onClickAdd()">新 增</el-button>
      <el-button type="danger"
                  icon='fas fa-trash-alt'
                  :disabled="!selectedIds.length"
                  @click="onDeleteItem()">删 除</el-button>
    </div>
    <el-table border
              highlight-current-row
              height="40vh"
              v-loading="loading"
              :data="itemList"
              class="mar-b-sm"
              :row-class-name="rowClassName"
              @select="onChangeCheck"
              @select-all="onChangeCheckAll"
              @selection-change="onChangeSelected">
      <el-table-column align="center"
                        type="selection"
                        width="40">
      </el-table-column>
      <el-table-column align="center"
                       type="index"
                       width="50"
                       label="No.">
      </el-table-column>
      <el-table-column prop="name"
                       label="姓名"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="sex"
                         align="center"
                         width="80"
                         label="性别"
                         show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.sex ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="job"
                       label="岗位"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="degree"
                       label="学历"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="mobilePhone"
                       label="联系方式"
                       show-overflow-tooltip>
      </el-table-column>
    </el-table>
      <person-form ref="dialog" @query="updateUser" />
  </dialog-modal>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import PersonForm from './components/PersonForm';

export default {
  name: 'AccidentPerson',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    PersonForm,
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/accidentCasualties',
      queryForm: {        // 查询表单绑定变量
        accidentId: '',   // 事故id
        keyWord: '',      // 关键字
        sort: 'name',
      },
    };
  },
  methods: {
    onClickAdd() {
      this.$refs.dialog.openDialog(this.queryForm.accidentId);
    },
    onDeleteItem() {
      this.$confirm('此操作将永久删除所选数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('wholeprocess/accidentCasualties', { data: this.selectedIds })
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.$emit('query');
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 更新用户
    updateUser() {
      this.getItemList();
      this.$emit('query');
    },
    // 打开对话框
    openDialog(row) {
      if (!row) return;
      this.queryForm.accidentId = row.id;
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
