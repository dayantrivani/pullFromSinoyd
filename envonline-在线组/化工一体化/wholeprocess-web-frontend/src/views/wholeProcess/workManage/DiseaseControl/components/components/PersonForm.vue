<template>
  <dialog-modal ref="dialog"
                title="选择员工"
                maxScrollbar
                size="middle"
                appendToBody
                @close="closeDialog">
    <!-- 查询表单 -->
    <div class="mar-y-xs">
      <el-form inline :model="queryForm">
        <el-form-item label="所属部门：">
          <el-select v-model="queryForm.deptId"
                       clearable>
              <el-option label="所有" value=""></el-option>
              <el-option v-for="(item, index) in deptList"
                      :key="index"
                      :label="item.deptName"
                      :value="item.rowGuid"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="queryForm.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <hr>
    <div class="mar-l-xs mar-y-xs">
      <el-button type="primary"
                 icon="far fa-save"
                 :disabled="!selectedItems.length"
                 @click="onSaveItem()">保存
      </el-button>
      <el-button icon="fa fa-times"
                 @click="closeDialog()">关 闭</el-button>
    </div>
    <el-table border
              highlight-current-row
              :row-key="getRowKey"
              v-loading="loading"
              height="45vh"
              :data="itemList"
              @selection-change="onChangeSelected">
        <el-table-column align="center"
                        type="selection"
                        width="40"
                        :reserve-selection="true"></el-table-column>
        <el-table-column align="center"
                        label="No."
                        width="50"
                        type="index"
                        :index="index"></el-table-column>
        <el-table-column prop="deptmentName"
                        header-align="center"
                        label="所属部门"
                        show-overflow-tooltip></el-table-column>
      <el-table-column prop="name"
                       header-align="center"
                       label="姓名"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="sex"
                         align="center"
                         width="80"
                         label="性别"
                         show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.sex ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="mobilePhone"
                       header-align="center"
                       label="手机号码"
                       show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <paging-query :pager="pager" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'PersonForm',
  mixins: [
    queryList,
  ],
  components: {
  },
  data() {
    return {
      url: 'bas/personInfo',
      loading: false,
      psId: '',       // 企业id
      occupId: '',    // 疾病id
      deptList: [],
      selectedItems: [],
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    // 打开对话框
    openDialog(id) {
      this.occupId = id || '';
      this.psId = this.userType === 'ent' ? this.orgGuid : this.$store.state.auth.user.orgGuid;
      this.getDeptList();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onChangeSelected(val) {
      this.selectedItems = val;
    },
    getDeptList() {
      this.$http.get(`sinoyd-wrybase/sys/department/guid/${this.psId}`)
        .then((response) => {
          if (response.status === 200) {
            this.deptList = response.data;
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
    // 保存数据
    onSaveItem() {
      const personArr = [];
      this.selectedItems.forEach((item) => {
        const person = {
          psId: this.psId,
          occupId: this.occupId,
          personId: item.id,
        };
        personArr.push(person);
      });
      this.$http.post('wholeprocess/occupationalDisease2Person', personArr).then((response) => {
        if (response.data.success) {
          this.$emit('query');
          this.closeDialog();
        } else {
          this.$message({
            showClose: true,
            message: response.data.msg,
          });
          this.closeDialog();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
  },
};
</script>
