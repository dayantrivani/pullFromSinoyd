<template>
  <!--  设备信息-烟囱设施 -->
  <el-card type="title">
    <template slot="header">烟囱设施</template>
    <div class="mar-y-xs mar-l-sm">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!chimneySelection.length"
        @click="onDelClick">删 除
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      height="calc(100% - 70px)"
      border
      :data="chimneyList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="chimneySelectionChange">
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onEditClick(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="chimneyName" label="烟囱名称" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="chimneyNo" label="烟囱编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="longitude" label="烟囱经度" show-overflow-tooltip></el-table-column>
      <el-table-column prop="latitude" label="烟囱纬度" show-overflow-tooltip></el-table-column>
      <el-table-column prop="runningState" label="运行状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.runningState !== undefined">
            {{scope.row.runningState === 0 ? '启用' : '停用'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <!-- 弹出框内容 -->
    <dialog-modal
      ref="dialog"
      :title="`${isEdit ? '编辑' : '新增'}烟囱设施信息`"
      @close="onDialogClose"
    >
      <el-form ref="chimneyForm" class="mar-x-sm" :model="chimneyModel" label-width="120px" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="企业：" prop="PSName">
              <el-input v-model.trim="psInfo.psName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="烟囱名称：" prop="chimneyName">
              <el-input v-model.trim="chimneyModel.chimneyName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="烟囱编码：" prop="chimneyNo">
              <el-input v-model.trim="chimneyModel.chimneyNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="烟囱代码：" prop="chimneyCode">
              <el-input v-model.trim="chimneyModel.chimneyCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="高度：" prop="chimneyHigh">
              <!-- <el-input v-model.trim="chimneyModel.chimneyHigh"></el-input> -->
              <el-input-number
                v-model.trim="chimneyModel.chimneyHigh"
                controls-position="right"
                :min="0"
                style="width: 100%">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出口内径：" prop="chimneyDiameter">
              <!-- <el-input v-model.trim="chimneyModel.chimneyDiameter"></el-input> -->
              <el-input-number
                v-model.trim="chimneyModel.chimneyDiameter"
                controls-position="right"
                :min="0"
                style="width: 100%">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="烟囱经度：" prop="longitude">
              <el-input v-model.trim="chimneyModel.longitude"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="烟囱纬度：" prop="latitude">
              <el-input v-model.trim="chimneyModel.latitude"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="排口类型：" prop="chimneyTypeId">
              <el-select v-model="chimneyModel.chimneyTypeId" style="width:100%">
                <el-option v-for="(item,index) in $enum.PortTypeList" :key="index"
                  :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运行状态：" prop="runningState">
              <el-select v-model="chimneyModel.runningState" style="width:100%">
                <el-option label="启用" :value="0"></el-option>
                <el-option label="停用" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="关停并转日期：" prop="stopTime">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable="false" placeholder="选择日期"
              v-model="stopTime" type="date" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排放规律：" prop="letRuleId">
              <el-select v-model="chimneyModel.letRuleId" filterable style="width:100%">
                <el-option v-for="(item,index) in dict.OutputRule" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="气域功能区类别：" prop="functionAreaId">
              <el-select v-model="chimneyModel.functionAreaId" filterable style="width:100%">
                <el-option v-for="(item,index) in dict.AirFunctionArea" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标志牌安装形式：" prop="flagInstallFormId">
              <el-select v-model="chimneyModel.flagInstallFormId" filterable style="width:100%">
                <el-option v-for="(item,index) in dict.FlagInstallForm" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="是否两控区：" prop="isTwoArea">
              <el-select v-model="chimneyModel.isTwoArea" style="width:100%">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="两控区类型：" prop="twoAreaTypeId">
              <el-select v-model="chimneyModel.twoAreaTypeId" filterable style="width:100%">
                <el-option v-for="(item,index) in dict.DoubleControlType" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 2 }" v-model.trim="chimneyModel.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fas fa-save" @click="onSaveChimney">保 存</el-button>
        <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
      </span>
    </dialog-modal>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import * as _cloneDeep from 'lodash/cloneDeep'; // 深拷贝
// import * as _pick from 'lodash/pick';
// import * as _find from 'lodash/find';

export default {
  name: 'PSInfoDetailChimney',
  data() {
    return {
      loading: false,
      // 表单dialog
      // chimneyVisible: false,
      // 是否编辑
      isEdit: false,
      // 表单model
      chimneyModel: {
        psId: '',
        chimneyName: '',
        chimneyNo: '',
        chimneyCode: '',
        chimneyHigh: '',
        chimneyDiameter: '',
        longitude: '',
        latitude: '',
        chimneyTypeId: '1',
        runningState: 0,
        stopTime: '',
        letRuleId: 'b6ff40ea13fe4a308dd8d5d3612231e5',
        functionAreaId: '0f7af4ae92e84cea8bb77c86067239f7',
        flagInstallFormId: '63486f37b01c49c5be0dd72b5937add0',
        twoAreaTypeId: '845a5169312748bca0b50dee4e446f7d',
        isTwoArea: true,
        remark: '',
      },
      emptyItem: {},
      pager: {
        count: 0,
        page: 1,
        rows: 15,
      },
      rules: {
        chimneyName: [
          { required: true, message: '烟囱名称不能为空', trigger: 'blur' },
        ],
        chimneyNo: [
          { required: true, message: '烟囱编码不能为空', trigger: 'blur' },
        ],
        chimneyCode: [
          { required: true, message: '烟囱代码不能为空', trigger: 'blur' },
        ],
      },
      // 烟囱数据列表
      chimneyList: [],
      // 多选数组
      chimneySelection: [],
      // 下拉框数据
      dict: {
        OutputRule: [],                             // 排放规律
        AirFunctionArea: [],                        // 气域功能区类型
        FlagInstallForm: [],                        // 标志牌安装形式
        DoubleControlType: [],                      // 两控区类型
      },
    };
  },
  computed: {
    stopTime: {
      get() {
        return this.chimneyModel.stopTime === '1900-01-01 00:00:00'
          ? ''
          : this.chimneyModel.stopTime;
      },
      set(val) {
        this.chimneyModel.stopTime = val || '1900-01-01 00:00:00';
      },
    },
    // ...mapState({
    //   activeInfo: state => state.psInfo.activeInfo,
    // }),
    ...mapState({
      psInfo: state => state.psInfo,
    }),
  },
  watch: {},
  created() {
    this.emptyItem = _cloneDeep(this.chimneyModel);
    this.getItemList();
    this.getDictList();
  },
  methods: {
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.chimneySelection.includes(row) ? className : '';
    },
    // gird多选
    chimneySelectionChange(val) {
      this.chimneySelection = val;
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      this.$http.get('bas/chimney', { params: { ...this.pager, psId: this.psInfo.id } }).then((response) => {
        this.chimneyList = response.data.data;
        this.pager.count = response.data.count;
        this.loading = false;
      }, ({ response }) => {
        this.loading = false;
        this.$hp.resp(response);
      });
    },
    // 删除
    onDelClick() {
      if (this.chimneySelection.length === 0) {
        this.$message('请选择要删除的数据');
        return;
      }
      const ids = this.chimneySelection.map(item => item.id);
      this.$confirm('是否删除选中的数据？', '请确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/chimney', { data: ids })
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
    // 单击新增按钮
    onClickAdd() {
      this.chimneyModel = _cloneDeep(this.emptyItem);
      // this.chimneyVisible = true;
      this.$refs.dialog.openDialog();
    },
    // 编辑
    onEditClick(row) {
      this.chimneyModel = _cloneDeep(row);
      // this.chimneyVisible = true;
      this.$refs.dialog.openDialog();
    },
    // 保存
    onSaveChimney() {
      this.$refs.chimneyForm.validate((valid) => {
        if (!valid) return;
        this.chimneyModel.psId = this.psInfo.id;
        const url = 'bas/chimney';
        this.$http[this.chimneyModel.id ? 'put' : 'post'](url, _cloneDeep(this.chimneyModel)).then((response) => {
          if (response.status === 200) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '操作成功',
              duration: '1500',
            });
            this.getItemList();
            // this.chimneyVisible = false;
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
    // 重置表单
    onDialogClose() {
      this.chimneyModel = _cloneDeep(this.emptyItem);
      this.$refs.chimneyForm.resetFields();
    },
  },
};
</script>

<style></style>
