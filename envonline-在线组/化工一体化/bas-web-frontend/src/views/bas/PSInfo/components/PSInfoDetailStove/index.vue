<template>
  <el-card type="title">
    <template slot="header">炉窑设施</template>
    <div class="mar-y-xs mar-l-sm">
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
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column type="selection" width="36"></el-table-column>
      <el-table-column label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="76">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="stoveName" label="炉窖名称"
        show-overflow-tooltip min-width='200'></el-table-column>
      <el-table-column property="stoveCode" label="炉窖设备编号"
        show-overflow-tooltip min-width='150'></el-table-column>
      <el-table-column property="specification" label="规格型号"
        show-overflow-tooltip min-width='100'></el-table-column>
      <el-table-column property="stoveCapacity" label="锅炉容量"
        show-overflow-tooltip min-width='80'></el-table-column>
    </el-table>
    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <!-- 弹出框信息 -->
    <dialog-modal
      ref="dialog"
      size="middle"
      :title="`${isEidt ? '新增' : '编辑'}锅炉信息`"
      @closed="onDialogClose"
    >
      <div class="mar-b-xs mar-l-sm">
        <el-button type="primary" icon="fas fa-save" @click="onSaveItem">保 存</el-button>
        <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
      </div>
      <hr class="mar-x-sm"/>
      <el-form
        ref="form"
        class="mar-x-sm"
        label-position="right"
        label-width="155px"
        :model="itemModel"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="污染源：">
              <el-input v-model="psInfo.psName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="炉窖名称：" prop="stoveName">
              <el-input v-model="itemModel.stoveName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格型号：">
              <el-input v-model="itemModel.specification"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="锅炉类型：">
              <el-select v-model="itemModel.stoveTypeId" filterable>
                <el-option v-for="item in dict.StoveKind" :key="item.rowGuid"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="锅炉容量：" prop="stoveCapacity">
              <!-- <el-input v-model.number="itemModel.stoveCapacity"></el-input> -->
              <el-input-number
                v-model="itemModel.stoveCapacity"
                controls-position="right"
                :min="0"
                style="width: 100%">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="燃料类型：">
              <el-select v-model="itemModel.fuelTypeId" filterable>
                <el-option v-for="(item,index) in dict.FuelType" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="炉窖种类：">
              <el-select v-model="itemModel.stoveKindId" filterable>
                <el-option v-for="(item,index) in dict.FurnacesType" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所处位置：">
              <el-input v-model="itemModel.position"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设施生产厂家：">
              <el-input v-model="itemModel.manufacturer"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投运日期：">
              <el-date-picker
                v-model="operatedDate"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                :editable="false"
                style="width: 100%"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
              <el-input-number
                controls-position="right"
                v-model="itemModel.outputPercent"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生产能力：">
              <el-input v-model="itemModel.productionCapacity"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过量空气系数：">
              <el-input-number controls-position="right" v-model="itemModel.excessAirCoefficient"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="燃料分类：" prop="fuelClassifyId">
              <el-select v-model="itemModel.fuelClassifyId" filterable>
                <el-option v-for="(item,index) in dict.FuelClassification" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="燃烧方式：" prop="burningModeId">
              <el-select v-model="itemModel.burningModeId" filterable>
                <el-option v-for="(item,index) in dict.BurningMode" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="燃料设备用途：">
              <el-input v-model="itemModel.burntEquipmentUs"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="炉窖设备编号：" prop="stoveCode">
              <el-input v-model="itemModel.stoveCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="材质：">
              <el-input v-model="itemModel.material"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每天工作的小时数：">
              <!-- <el-input v-model="itemModel.workingHoursPerDay"></el-input> -->
              <el-input-number
                v-model="itemModel.workingHoursPerDay"
                controls-position="right"
                :min="0"
                style="width: 100%">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="每年工作的天数：">
              <!-- <el-input v-model="itemModel.workingDaysPerYear"></el-input> -->
              <el-input-number
                v-model="itemModel.workingDaysPerYear"
                controls-position="right"
                :min="0"
                style="width: 100%">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投入运行的天数：">
              <!-- <el-input v-model="itemModel.allDaysOfWorking"></el-input> -->
              <el-input-number
                v-model="itemModel.allDaysOfWorking"
                controls-position="right"
                :min="0"
                style="width: 100%">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
        </el-row>
        <el-row>
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
        </el-row>
        <el-row>
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
        </el-row>
        <el-row>
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
      loading: false,                                     // 表格数据加载状态
      isEidt: false,                                      // 弹出框展示状态
      // 表单model
      itemModel: {
        psId: '',
        stoveName: '',
        specification: '',
        stoveTypeId: 'c7ba06bf7afb45e8ad20df62f14e9e55',
        stoveCapacity: '',
        fuelTypeId: '2d590354e6bb4a9996f3cb35ad0d6aeb',
        material: '',
        workingHoursPerDay: '',
        workingDaysPerYear: '',
        allDaysOfWorking: '',
        isConnExhaust: true,
        exhaustCode: '',
        isConnGoverFacilities: true,
        equipCode: '',
        stoveKindId: 'b8ea60562b17411188af7d7132c979e8',
        fuelClassifyId: '0cdddd9f76854cd8b6b5493ba5b03a45',
        manufacturer: '',
        position: '',
        operatedDate: '',
        runningState: 0,
        outputPercent: '',
        productionCapacity: '',
        excessAirCoefficient: '',
        burningModeId: 'd20d7ec60d9d466fa234097c91ad33cc',
        workshopName: '',
        burntEquipmentUs: '',
        stoveCode: '',
        isDedust: true,
        isDesulfurization: true,
        isDenitration: true,
      },
      itemList: [],                                     // 数据项列表
      selectedIds: [],                                  // 已选择的数据 id 数组
      pager: {
        count: 0,
        page: 1,
        rows: 15,
      },
      emptyItem: {},
      // dropDownList: {}, // 下拉框数据
      // 所有的下拉框数据（李子恒2019-05-24修改）
      dict: {
        StoveKind: [],                                  // 锅炉类型
        FuelType: [],                                   // 燃料类型
        FurnacesType: [],                               // 炉窖种类
        FuelClassification: [],                         // 燃料分类
        BurningMode: [],                                // 燃烧方式
      },
      rules: { // 编辑表单验证规则
        stoveName: [
          { required: true, message: '炉窖名称不能为空', trigger: 'blur' },
        ],
        fuelClassifyId: [
          { required: true, message: '请选择燃料分类', trigger: 'blur' },
        ],
        burningModeId: [
          { required: true, message: '请选择燃烧方式', trigger: 'blur' },
        ],
        stoveCode: [
          { required: true, message: '炉窖设备编号不能为空', trigger: 'blur' },
        ],
        stoveCapacity: [
          { required: true, message: '锅炉容量不能为空', trigger: 'blur' },
          { type: 'number', message: '锅炉容量必须为数字', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    operatedDate: {
      get() {
        return this.itemModel.operatedDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemModel.operatedDate;
      },
      set(val) {
        this.itemModel.operatedDate = val || '1900-01-01 00:00:00';
      },
    },
    ...mapState({
      psInfo: state => state.psInfo,
    }),
  },
  created() {
    // 获取表单数据(空值)
    this.emptyItem = _cloneDeep(this.itemModel);
    this.getItemList();
    this.getDictList();
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
      this.isEidt = true;
      this.itemModel = _cloneDeep(this.emptyItem);
      this.$refs.dialog.openDialog();
    },
    // 单击编辑按钮
    onClickEdit(row) {
      this.isEidt = false;
      this.itemModel = _cloneDeep(row);
      this.$refs.dialog.openDialog();
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      this.PS_GET_ITEM({ ...this.pager, psId: this.psInfo.id }).then((response) => {
        this.itemList = response.data.data;
        this.pager.count = response.data.count;
        this.loading = false;
      }).catch(({ response }) => {
        this.loading = false;
        this.$hp.resp(response);
      });
    },
    // 获取字典表方法（李子恒2019-05-24修改）
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
    // 保存数据项
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.itemModel.psId = this.psInfo.id;
        this[`PS_${this.itemModel.id ? 'PUT' : 'POST'}_ITEM`](_cloneDeep(this.itemModel)).then((response) => {
          if (response.status === 200) {
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
              message: response.body.msg,
              type: 'warning',
              duration: '1500',
            });
          }
        }, ({ response }) => {
          this.$hp.resp(response);
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
        if (response.status === 200) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功',
            duration: '1500',
          });
          this.getItemList();
        } else {
          this.$message({
            message: response.body.msg,
            type: 'warning',
            duration: '1500',
          });
        }
      }, ({ response }) => {
        this.$hp.resp(response);
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
