<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    :title="`${itemModel.id ? '编辑' : '新增'}重点排污单位`"
    @close="closeDialog">
    <div style="max-height: 400px; overflow: scroll;">
      <el-form
        ref="form"
        :rules="formRules"
        label-width="135px"
        :model="itemModel"
        class="mar-t-xs pad-x-sm item-space">
        <el-form-item v-if="itemModel.id" label="重点污染源名称：" prop="psId" hint-down>
          <!-- <select-table v-model="itemModel.psId" :label="psName"></select-table> -->
          <el-input :value="psName" disabled></el-input>
        </el-form-item>
        <el-form-item v-else label="重点污染源名称：" prop="psIds" hint-down>
          <select-tables v-model="itemModel.psIds" :label="psName" @getPsName="getPsName"></select-tables>
        </el-form-item>
        <el-form-item label="年份：">
            <el-date-picker
              v-model="itemModel.ye"
              format="yyyy"
              value-format="yyyy"
              type="year"
              :clearable="false"
              style="width: 100%;"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="名录类别：">
            <el-select
              v-model="categoryList"
              clearable
              multiple
              collapse-tags
              style="width: 100%;"
            >
              <el-option
                v-for="(item, index) in $enum.keyPollutantCategory"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            v-model="itemModel.remark"
            :autosize="{ minRows: 2 }"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck()">保 存
      </el-button>
      <el-button
        icon="fas fa-times"
        @click="closeDialog">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
// import SelectTable from '@/components/widgets/select-table';
import SelectTables from '../components/select-tables';

export default {
  components: { SelectTables },
  data() {
    return {
      saveLoading: false,
      url: 'bas/psPollutantDischarge',  // 必须, 接口地址
      psName: '',
      categoryList: [],
      itemModel: {
        psId: '',
        psIds: [],
        ye: `${new Date().getFullYear()}`,
        category: 0,
        remark: '',
      },          // 表单对象
      formRules: {
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        psIds: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.rowGuid;
    },
  },
  watch: {
    categoryList: {
      handler(val) {
        let sum = 0;
        val.forEach((n) => {
          sum += (n - 0);
        });
        this.itemModel.category = sum;
      },
      deep: true,
    },
  },
  methods: {
    // 判断对象是否为空
    isEmptyObj(obj) {
      return Object.keys(obj).length === 0;
    },
    getEmptyItem() {
      return {
        psId: '',
        ye: `${new Date().getFullYear()}`,
        category: 0,
        remark: '',
      };
    },
    getPsName(psName) {
      this.itemModel.psName = psName;
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      this.itemModel.ye = `${this.itemModel.ye}`;
      this.categoryList = this.getCategoryList(this.itemModel.category);
      if (row) this.psName = row.psName;
      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 保存记录
    onSaveCheck(callback) {
      // 表单是否需要验证
      if (this.isEmptyObj(this.formRules)) {
        this.onSaveItem(callback);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    // 发送保存记录请求
    onSaveItem(callback) {
      this.saveLoading = true;
      const { id } = this.itemModel;
      if (id) {
        this.itemModel = {
          id: this.itemModel.id,
          psId: this.itemModel.psId,
          ye: this.itemModel.ye,
          category: this.itemModel.category,
          remark: this.itemModel.remark,
        };
      } else {
        this.itemModel = {
          psIds: this.itemModel.psIds,
          ye: this.itemModel.ye,
          category: this.itemModel.category,
          remark: this.itemModel.remark,
          psName: this.itemModel.psName,
        };
      }
      this.$http[id ? 'put' : 'post'](this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
            this.itemModel.ye += '';
            this.closeDialog();
            if (callback) {
              callback(response.data.data);
            } else {
              this.$emit('query');
            }
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }).finally(() => {
          this.saveLoading = false;
        });
    },
    /* 特殊方法 */
    getCategoryList(categoryValue) {
      const categoryList = [];
      if (categoryValue !== null && categoryValue !== -1) {
        // 这边遍历枚举有个循环
        Object.keys(this.$enum.keyPollutantCategory).forEach((i) => {
          // eslint-disable-next-line
          if ((i & categoryValue) !== 0) {
            categoryList.push(i);
          }
        });
      }
      return categoryList;
    },
  },
};
</script>

<style scoped>
 .item-space .el-form-item {
   margin-bottom: 10px !important;
 }
</style>
