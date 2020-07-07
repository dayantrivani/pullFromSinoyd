<template>
  <dialog-modal type="title" ref="dialog" size="middle" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}车间管理`"
    @close="closeDialog">
    <el-form class="mar-t-xs pad-x-sm item-space el-box" ref="form" :rules="formRules" label-position="right"
      label-width="140px" :model="itemModel">
      <el-row>
        <el-col :span="12">
          <el-form-item label="企业名称：" prop="psId" hint-down>
            <select-info-table v-model="itemModel.psName" :isPsId="false" type="ps" title="选择企业"
              :label="itemModel.psName" @selectRow='pSselectRow' />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车间名称：" prop="departmentName">
            <el-input v-model="itemModel.departmentName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="车间编码：">
            <el-input v-model="itemModel.code" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="层数：" prop="storey">
            <el-input-number v-model="itemModel.storey" controls-position="right" :max="2147483647" :min="1"
              style="width: 100%;">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item hint-down prop="floorSpace">
            <template slot="label">占地面积（m<sup>2</sup>）：</template>
            <el-input v-model="itemModel.floorSpace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建筑结构：" prop="buildingStructureCodeId">
            <el-select v-model="itemModel.buildingStructureCodeId">
              <el-option v-for="(item, index) in dict.BuildingStructure" :key="index" :label="item.dictName"
                :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="火灾危险性分类：" prop="fireHazardClass">
            <el-select v-model="itemModel.fireHazardClass">
              <el-option v-for="(item, index) in $enum.fireHazardClass" :key="index" :label="item" :value="+index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="耐火等级：" prop="fireResistanceRating">
            <el-select v-model="itemModel.fireResistanceRating">
              <el-option v-for="(item, index) in $enum.fireResistanceRating" :key="index" :label="item" :value="+index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人姓名：" prop="leaderName">
            <el-input v-model="itemModel.leaderName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式：" prop="telephone">
            <el-input v-model="itemModel.telephone" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="车间说明：">
        <el-input v-model="itemModel.explain" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';

export default {
  mixins: [saveItem],                     // 使用混合
  data() {
    return {
      url: 'bas/psDepartment',  // 必须, 接口地址
      psName: '', // 显示企业名称
      itemModel: {
        psId: '',
        departmentName: '',
        code: '',
        explain: '',
        floorSpace: '',
        storey: '',
        buildingStructureCodeId: '',
        fireHazardClass: '',
        fireResistanceRating: '',
        leaderName: '',
        telephone: '',
        remark: '',
      },          // 表单对象
      dict: {
        BuildingStructure: [],
      },
      formRules: {
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        departmentName: [
          { required: true, message: '请输入部门/车间名称', trigger: ['blur', 'change'] },
        ],
        leaderName: [
          { required: true, message: '请输入负责人姓名', trigger: ['blur', 'change'] },
        ],
        floorSpace: [{
          required: true, message: '请输入占地面积', trigger: ['blur', 'change'],
        }],
        storey: [{
          required: true, message: '请输入层数', trigger: ['blur', 'change'],
        }],
        telephone: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确格式的联系方式',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  created() {
    this.getDictList();
  },
  methods: {
    getEmptyItem() {
      return {
        psId: '',
        departmentName: '',
        code: '',
        explain: '',
        floorSpace: '',
        storey: '',
        buildingStructureCodeId: '',
        fireHazardClass: '',
        fireResistanceRating: '',
        leaderName: '',
        telephone: '',
        remark: '',
      };
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) this.psName = row.psName;

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 选择企业
    pSselectRow(row) {
      this.itemModel.psId = row.psId;
    },
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
  },
};
</script>
