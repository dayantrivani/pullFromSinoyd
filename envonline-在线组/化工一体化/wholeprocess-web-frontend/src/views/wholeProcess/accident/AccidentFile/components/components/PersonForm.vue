<template>
  <dialog-modal ref="dialog"
                title="选择伤亡人员"
                maxScrollbar
                size="middle"
                appendToBody
                @close="closeDialog">
    <div class="mar-l-xs mar-y-xs">
      <el-button type="primary"
                 icon="far fa-save"
                 :disabled="!selectedItems.length"
                 @click="onSaveCheck()">保存
      </el-button>
      <el-button icon="fa fa-times"
                 @click="closeDialog()">关 闭</el-button>
    </div>
    <el-table border
              highlight-current-row
              :row-key="getRowKey"
              v-loading="loading"
              height="45vh"
              reserve-selection
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
      <el-table-column prop="name"
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
      <el-table-column prop="jobName" label="岗位" show-overflow-tooltip></el-table-column>
      <el-table-column prop="degree" label="学历" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobilePhone" label="手机号码" show-overflow-tooltip></el-table-column>
      <el-table-column property="injuryDegree" align="center" width="140" label="伤害程度" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-select v-model="row.injuryDegree" placeholder="请选择伤害程度">
            <el-option label="轻伤" :value="1"></el-option>
            <el-option label="重伤" :value="2"></el-option>
            <el-option label="死亡" :value="3"></el-option>
          </el-select>
        </template>
      </el-table-column>
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
      url: 'wholeprocess/accidentCasualties/person',
      loading: false,
      queryForm: {        // 查询表单绑定变量
        accidentId: '',   // 事故id
      },
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
      this.queryForm.accidentId = id || '';
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onChangeSelected(val) {
      this.selectedItems = val;
    },
    // 保存校验需选择伤害程度
    onSaveCheck() {
      if (this.selectedItems.find(e => !e.injuryDegree)) {
        this.$message.warning({
          showClose: true,
          message: '请选择伤害程度',
        });
      } else {
        this.onSaveItem();
      }
    },
    // 保存数据
    onSaveItem() {
      const personArr = [];
      this.selectedItems.forEach((item) => {
        const person = {
          accidentId: this.queryForm.accidentId,
          personInfoId: item.id,
          injuryDegree: item.injuryDegree,
        };
        personArr.push(person);
      });
      this.$http.post('wholeprocess/accidentCasualties', personArr).then((response) => {
        if (response.data.success) {
          this.$emit('query');
          this.closeDialog();
        } else {
          this.$message.warning({
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
