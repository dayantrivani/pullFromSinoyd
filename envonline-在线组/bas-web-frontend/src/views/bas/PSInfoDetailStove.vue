<template>
  <el-card>
    <div slot="header" class="mar-b-sm">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除
      </el-button>
    </div>
    <el-table
      border
      height="calc(100% - 36px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="76">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="stoveName" label="炉窑名称" align="center"
        show-overflow-tooltip width='200'></el-table-column>
      <el-table-column property="stoveCode" label="炉窑设备编号"
        show-overflow-tooltip align="center"></el-table-column>
      <el-table-column property="specification" label="规格型号"
        show-overflow-tooltip align="center"></el-table-column>
      <el-table-column property="stoveCapacity" label="炉窑容量"
        show-overflow-tooltip align="center"></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="dialog" :title="`${this.itemModel.id ? '编辑' : '新增'}炉窑信息`" @closed="onDialogClose">
      <div class="mar-y-sm">
        <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveItem">保 存</el-button>
        <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
      </div>
      <hr class="mar-x-xs"/>
      <el-form ref="form" label-position="right" label-width="160px" :model="itemModel" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="污染源：">
              <el-input v-model="activeInfo.psName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="炉窑名称：" prop="stoveName">
              <el-input v-model="itemModel.stoveName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号：">
              <el-input v-model="itemModel.specification"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="炉窑类型：">
              <el-select v-model="itemModel.stoveTypeId" filterable>
                <el-option v-for="(item,index) in dropDownList.StoveKind" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="炉窑容量：" prop="stoveCapacity">
              <!-- 正整数 -->
              <el-input-number
                v-model="itemModel.stoveCapacity"
                controls-position="right"
                :min="0"
                :max="2147483647"
                :precision="0"
                style="width: 100%;"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="燃料类型：">
              <el-select v-model="itemModel.fuelTypeId" filterable>
                <el-option v-for="(item,index) in dropDownList.FuelType" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="炉窑种类：">
              <el-select v-model="itemModel.stoveKindId" filterable>
                <el-option v-for="(item,index) in dropDownList.FurnacesType" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所处位置：">
              <el-input v-model="itemModel.position"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设施生产厂家：">
              <el-input v-model="itemModel.manufacturer"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投运日期：">
              <el-date-picker
                v-model="itemModel.operatedDate"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                :editable="false"
                style="width: 100%"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设施运行状态：">
              <el-select v-model="itemModel.runningState">
                <el-option v-for="(item,index) in [{ Text: '启用', Value: 0 }, { Text: '停用', Value: 1 }]"
                  :key="index" :label="item.Text" :value="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理百分比：">
              <!-- 小数 -->
              <el-input-number
                v-model="itemModel.outputPercent"
                controls-position="right"
                :min="0"
                :max="2147483647"
                :precision="2"
                style="width: 100%;"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产能力：">
              <el-input v-model="itemModel.productionCapacity"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过量空气系数：">
              <!-- 小数 -->
              <el-input-number
                v-model="itemModel.excessAirCoefficient"
                controls-position="right"
                :min="0"
                :max="2147483647"
                :precision="2"
                style="width: 100%;"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="燃料分类：" prop="fuelClassifyId">
              <el-select v-model="itemModel.fuelClassifyId" filterable>
                <el-option v-for="(item,index) in dropDownList.FuelClassification" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="燃烧方式：" prop="burningModeId">
              <el-select v-model="itemModel.burningModeId" filterable>
                <el-option v-for="(item,index) in dropDownList.BurningMode" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="燃料设备用途：">
              <el-input v-model="itemModel.burntEquipmentUs"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="炉窑设备编号：" prop="stoveCode">
              <el-input v-model="itemModel.stoveCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材质：">
              <el-input v-model="itemModel.material"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每天工作的小时数：">
              <!-- 正整数 -->
              <el-input-number
                v-model="itemModel.workingHoursPerDay"
                controls-position="right"
                :min="0"
                :max="2147483647"
                :precision="0"
                style="width: 100%;"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每年工作的天数：">
              <!-- 正整数 -->
              <el-input-number
                v-model="itemModel.workingDaysPerYear"
                controls-position="right"
                :min="0"
                :max="2147483647"
                :precision="0"
                style="width: 100%;"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投入运行的天数：">
              <!-- 正整数 -->
              <el-input-number
                v-model="itemModel.allDaysOfWorking"
                controls-position="right"
                :min="0"
                :max="2147483647"
                :precision="0"
                style="width: 100%;"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否连接排气筒：">
              <el-select v-model="itemModel.isConnExhaust">
                <el-option v-for="(item,index) in [{ Text: '是', Value: true }, { Text: '否', Value: false }]"
                :key="index" :label="item.Text" :value="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="连接的排气筒编号：">
              <el-input v-model="itemModel.exhaustCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否连接治理设施：">
              <el-select v-model="itemModel.isConnGoverFacilities">
                <el-option v-for="(item,index) in [{ Text: '是', Value: true }, { Text: '否', Value: false }]"
                :key="index" :label="item.Text" :value="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="连接的治理装置编号：">
              <el-input v-model="itemModel.equipCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车间工段名称：">
              <el-input v-model="itemModel.workshopName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否除尘：">
              <el-select v-model="itemModel.isDedust">
                <el-option v-for="(item,index) in [{ Text: '是', Value: true }, { Text: '否', Value: false }]"
                :key="index" :label="item.Text" :value="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否脱硫：">
              <el-select v-model="itemModel.isDesulfurization">
                <el-option v-for="(item,index) in [{ Text: '是', Value: true }, { Text: '否', Value: false }]"
                :key="index" :label="item.Text" :value="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否脱硝：">
              <el-select v-model="itemModel.isDenitration">
                <el-option v-for="(item,index) in [{ Text: '是', Value: true }, { Text: '否', Value: false }]"
                :key="index" :label="item.Text" :value="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </dialog-modal>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'; // 引入vuex辅助函数
import * as _cloneDeep from 'lodash/cloneDeep'; // 深拷贝

export default {
  name: 'PSInfoDetailStove',
  data() {
    return {
      loading: false, // 表格数据加载状态
      saveLoading: false,
      // 表单model
      itemModel: {
        psId: '',
        stoveName: '',
        specification: '',
        stoveTypeId: '',
        stoveCapacity: '',
        fuelTypeId: '',
        material: '',
        workingHoursPerDay: '',
        workingDaysPerYear: '',
        allDaysOfWorking: '',
        isConnExhaust: true,
        exhaustCode: '',
        isConnGoverFacilities: true,
        equipCode: '',
        stoveKindId: '',
        fuelClassifyId: '',
        manufacturer: '',
        position: '',
        operatedDate: '',
        runningState: 0,
        outputPercent: '',
        productionCapacity: '',
        excessAirCoefficient: '',
        burningModeId: '',
        workshopName: '',
        burntEquipmentUs: '',
        stoveCode: '',
        isDedust: true,
        isDesulfurization: true,
        isDenitration: true,
      },
      itemList: [], // 数据项列表
      selectedIds: [], // 已选择的数据 id 数组
      pager: {
        total: 0,
        page: 1,
        rows: 15,
      },
      emptyItem: {},
      dropDownList: {}, // 下拉框数据
      rules: { // 编辑表单验证规则
        stoveName: [
          { required: true, message: '炉窑名称不能为空', trigger: 'blur' },
        ],
        fuelClassifyId: [
          { required: true, message: '请选择燃料分类', trigger: 'blur' },
        ],
        burningModeId: [
          { required: true, message: '请选择燃烧方式', trigger: 'blur' },
        ],
        stoveCode: [
          { required: true, message: '炉窑设备编号不能为空', trigger: 'blur' },
        ],
        stoveCapacity: [
          { required: true, message: '炉窑容量不能为空', trigger: 'blur' },
          { type: 'number', message: '炉窑容量必须为数字', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      activeInfo: state => state.psInfo.activeInfo,
    }),
  },
  created() {
    // 获取表单数据(空值)
    this.emptyItem = _cloneDeep(this.itemModel);
    this.getItemList();
    [
      'StoveKind',
      'FuelType',
      'FurnacesType',
      'FuelClassification',
      'BurningMode',
    ].forEach((ele) => {
      this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: ele }).then((val) => {
        this.dropDownList[ele] = val;
      });
    });
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    // 保存选中项 id
    changeSelected(selection) {
      this.selectedIds = selection.map(val => val.id);
    },
    // dialog 表单关闭回调
    onDialogClose() {
      this.itemModel = _cloneDeep(this.emptyItem);
      this.$refs.form.resetFields();
    },
    // 单击新增按钮
    onClickAdd() {
      this.itemModel = _cloneDeep(this.emptyItem);
      this.$refs.dialog.openDialog();
    },
    // 单击编辑按钮
    onClickEdit(row) {
      this.itemModel = _cloneDeep(row);
      this.$refs.dialog.openDialog();
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      this.PS_GET_ITEM({ ...this.pager, psId: this.activeInfo.id }).then((response) => {
        this.itemList = response.data.data;
        this.pager.total = response.data.count;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 保存数据项
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.itemModel.psId = this.activeInfo.id;
        this.itemModel.workingHoursPerDay = this.itemModel.workingHoursPerDay || 0;
        this.itemModel.workingDaysPerYear = this.itemModel.workingDaysPerYear || 0;
        this.itemModel.allDaysOfWorking = this.itemModel.allDaysOfWorking || 0;
        this[`PS_${this.itemModel.id ? 'PUT' : 'POST'}_ITEM`](_cloneDeep(this.itemModel)).then((response) => {
          if (response.data.success) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '操作成功',
              duration: '1500',
            });
            this.getItemList();
            this.$refs.dialog.closeDialog();
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning',
              duration: '1500',
            });
          }
        }).finally(() => {
          this.saveLoading = false;
        });
      });
    },
    // 删除数据项
    onDeleteItem() {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.PS_DELETE_ITEM(this.selectedIds)
      )).then((response) => {
        if (response.data.success) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功',
            duration: '1500',
          });
          this.getItemList();
        } else {
          this.$message({
            message: response.data.msg,
            type: 'warning',
            duration: '1500',
          });
        }
      });
    },
    PS_GET_ITEM(_params) {
      return new Promise((resolve, reject) => {
        this.$http.get('bas/stove', {
          params: _params,
        }).then((response) => {
          resolve(response);
        }, (response) => {
          reject(response);
        });
      });
    },
    PS_POST_ITEM(itemData) {
      return new Promise((resolve, reject) => {
        this.$http.post('bas/stove', itemData).then((response) => {
          resolve(response);
        }, (response) => {
          reject(response);
        });
      });
    },
    PS_PUT_ITEM(itemData) {
      return new Promise((resolve, reject) => {
        this.$http.put('bas/stove', itemData).then((response) => {
          resolve(response);
        }, (response) => {
          reject(response);
        });
      });
    },
    PS_DELETE_ITEM(ids) {
      return new Promise((resolve, reject) => {
        this.$http.delete('bas/stove', {
          data: ids,
        }).then((response) => {
          resolve(response);
        }, (response) => {
          reject(response);
        });
      });
    },
  },
};
</script>

<style scoped>

</style>
