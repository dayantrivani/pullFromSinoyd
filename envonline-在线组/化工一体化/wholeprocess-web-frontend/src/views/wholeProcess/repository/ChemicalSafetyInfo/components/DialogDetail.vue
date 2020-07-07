<template>
  <dialog-modal ref="dialog"
                size="mini"
                maxScrollbar
                title="危化品安全信息"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="100px"
             disabled
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="品名："
                        prop="commodityName">
            <el-input v-model="itemModel.commodityName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="别名："
                        prop="anotherName">
            <el-input v-model="itemModel.anotherName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="英文名：" prop="enName">
            <el-input v-model="itemModel.enName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="CAS号：" prop="casNumber">
            <el-input v-model="itemModel.casNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="危险性类别：" prop="riskCategory">
            <el-input type="textarea" v-model="itemModel.riskCategory"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="重点监管：" prop="isKeySupervision">
            <el-select v-model="itemModel.isKeySupervision" clearable>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="剧毒：" prop="isHypertoxic">
            <el-select v-model="itemModel.isHypertoxic" clearable>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="易制毒：" prop="isPrecursorChemicals">
            <el-select v-model="itemModel.isPrecursorChemicals" clearable>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注："
                        prop="remark">
            <el-input type="textarea"
                      v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isAuto: false,
      itemModel: this.getEmptyItem(),
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        psId: this.userType === 'ent' ? this.orgGuid : '',
        commodityName: '',
        anotherName: '',
        enName: '',
        casNumber: '',
        riskCategory: '',
        isKeySupervision: false,
        isHypertoxic: false,
        isPrecursorChemicals: false,
        remark: '',
      };
    },
    // 打开对话框
    openDialog(row) {
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
