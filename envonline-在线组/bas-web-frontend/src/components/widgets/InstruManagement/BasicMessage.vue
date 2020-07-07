<template>
  <div class="basicMessage">
    <!-- <div slot="header" class="clearfix mar-b-sm"> -->
      <!-- <el-button  type="primary"  size="small"  @click="onSaveItem()">
        <i  class="fa  fa-floppy-o"  aria-hidden="true"></i>  保  存
      </el-button>
      <el-button  size="small"  @click="onCloseDialog('basicMessageForm', false)">
        <i  class="fa  fa-times"  aria-hidden="true"></i>  关  闭
      </el-button> -->
    <!-- </div> -->
    <div class="mar-b-xs mar-t-xs mar-l-xs clearfix">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveItem">保 存</el-button>
      <el-button icon="fas fa-times" @click="onCloseDialog('basicMessageForm', false)">关 闭</el-button>
    </div>
    <hr>
    <!-- 内容区 -->
    <div class="basicForm">
      <el-form ref="basicMessageForm" label-position="right" label-width="120px"
        :model="itemModel" :rules="rules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="仪器名称：" prop="instrumentName">
              <el-input v-model.trim="itemModel.instrumentName" disabled>
                <el-button slot="append" @click="onClickBasin()">
                  <i :class="'fa fa-th-list'"></i>
                </el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仪器类型：" prop="instrumentType">
              <el-select v-model.trim="itemModel.instrumentType" placeholder="请选择仪器类型"
                clearable style="width: 100%" disabled>
                <el-option v-for="(item,index) in formData.instrumentType" :key="index"
                  :label="item.dictName" :value="item.rowGuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仪器编号：" prop="instrumentCode">
              <el-input v-model.trim="itemModel.instrumentCode" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="仪器型号：" prop="instrumentModel">
              <el-input v-model.trim="itemModel.instrumentModel" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本站编号：">
              <el-input v-model.trim="basicFormData.innerCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="污染源名称：" prop="psId">
              <el-input v-model.trim="basicFormData.psName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="站点名称：" prop="portId">
              <el-select v-model.trim="itemModel.portId" placeholder="请选择站点名称"
                clearable  style="width: 100%">
                <el-option v-for="(item,index) in formData.portName" :key="index"
                  :label="item.portName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂日期：" prop="leaveTime">
              <el-date-picker v-model.trim="itemModel.leaveTime" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记日期：" prop="registerDate">
              <el-date-picker v-model.trim="itemModel.registerDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所在位置：">
              <el-input v-model.trim="itemModel.location"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：" prop="status">
              <el-select v-model.trim="itemModel.status" placeholder="请选择状态"
                clearable  style="width: 100%">
                <el-option v-for="(value,key,index) in formData.status" :key="key"
                  :label="value" :value="index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安装时间：" prop="setupDate">
              <el-date-picker v-model.trim="itemModel.setupDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="仪器校准日期：" prop="calibrationDate">
              <el-date-picker v-model.trim="itemModel.calibrationDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效期：" prop="effectiveDate">
              <el-date-picker v-model.trim="itemModel.effectiveDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="basicAccessory">
      <div class="accessoryTitle" @click="openAttachment">
        <span>附件</span>
        <!-- v-show="!isClassName"  -->
        <span style="float: right; transition: all .5s linear;" :class="{ iconright: !isClassName }">
          <i class="el-icon-caret-left"></i>
        </span>
        <!-- <span style="float: right;" v-if="isClassName"><i class="el-icon-caret-left"></i></span> -->
      </div>
       <transition name="el-fade-in-linear">
        <div class="transition-box" v-show="!isClassName">
          <upload class="upload" :id="basicFormData.id" height="calc(100% - 69px)"/>
          <!-- slot="header" -->
          <!-- <div class="clearfix mar-b-sm">
            <el-button type="primary" size="small" @click="onClickUpload()">
              <i class="fa fa-cloud-upload" aria-hidden="true"></i> 上传文档
            </el-button>
            <el-button type="danger" size="small" @click="onDeleteItem()">
              <i class="fa fa-trash-o" aria-hidden="true"></i> 删除文档
            </el-button>
          </div>
          <div class="accessoryTable">
            <el-table ref="basicTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
              @selection-change="handleSelectionChange" border max-height="398" stripe>
              <el-table-column align="center" type="selection" width="50"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="下载" width="100">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="onClickEdit(scope.row)">
                    <i class="fa fa-download" aria-hidden="true"></i> 下 载
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="文件名"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="上传日期"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="上传人"></el-table-column>
            </el-table>
          </div>
          <div class="accessoryPagin mar-t-sm" style="text-align: right;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 15, 20, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.length">
            </el-pagination>
          </div> -->
        </div>
       </transition>
    </div>
    <instru-name-form-dialog ref="instrNameFormDialog" @getintruNameData="getintruNameData"/>
  </div>
</template>

<script>
import Upload from '@/views/bas/CommonDialog/Upload';
import InstruNameFormDialog from '@/components/widgets/InstruManagement/InstruNameFormDialog';

export default {
  name: 'basicMessage',
  data() {
    return {
      /*
      itemModel: { // 表单数据
        id: '', // ''主键id',
        instrumentName: '', // '仪器名称',
        instrumentCode: '', // '仪器编号',
        instrumentType: '', // 仪器类型（常量）',
        instrumentModel: '', // '仪器型号',
        portId: '', // '站点id',
        psId: '', // '企业id',
        leaveTime: '', // '出厂日期',
        registerDate: '', // '登记日期',
        setupDate: '', // '安装日期',
        effectiveDate: '', // '有效日期',
        calibrationDate: '', // '仪器校准日期',
        location: '', // '所在位置',
        status: '', // '状态（0：启用：1：停用：2： 过期)',
        // isDeleted: '假删字段',
        // creator: '新增人员Id',
        // createDate: '新增日期',
        // domainId: '科室id',
        // modifier: '修改人员Id',
        // modifyDate: '修改日期',
      },
      */
      itemModel: {},
      rules: { // 表单验证
        instrumentName: [
          { required: true, message: '请输入仪器名称', trigger: 'blur' },
        ],
        instrumentType: [
          { required: true, message: '请选择仪器类型', trigger: 'change' },
        ],
        psId: [
          { required: true, message: '请输入污染源企业名称', trigger: 'blur' },
        ],
        portId: [
          { required: true, message: '请选择站点', trigger: 'change' },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
        leaveTime: [
          { required: true, message: '请选择出厂日期', trigger: 'change' },
        ],
        registerDate: [
          { required: true, message: '请选择登记日期', trigger: 'change' },
        ],
        setupDate: [
          { required: true, message: '请选择安装日期', trigger: 'change' },
        ],
        effectiveDate: [
          { required: true, message: '请选择有效日期', trigger: 'change' },
        ],
        calibrationDate: [
          { required: true, message: '请选择仪器校准日期', trigger: 'change' },
        ],
      },
      formData: { // 下拉列表数据集合
        instrumentType: [ // 仪器类型
        ],
        portName: [ // 站点名称
        ],
        status: this.$hp.StatusListAdd, // 状态
      },
      saveLoading: false,
      isClassName: false, // 样式决定附件是否显示
      // tableData: [ // 附件表格
      // ],
      // selection: [], // 记录表格选中数据
      // currentPage: 1, // 页码数
      // pageSize: 10, // 每页条数
    };
  },
  props: ['basicFormData'],
  components: {
    Upload,
    InstruNameFormDialog,
  },
  watch: {
    basicFormData: {
      handler() {
        const data = this.basicFormData;
        this.itemModel = {
          id: data.id,
          instrumentName: data.instrumentName,
          instrumentCode: data.instrumentCode,
          instrumentType: data.instrumentType,
          instrumentModel: data.instrumentModel,
          innerCode: data.innerCode,
          portId: data.portId,
          psId: data.psId,
          leaveTime: data.leaveTime,
          registerDate: data.registerDate,
          setupDate: data.setupDate,
          effectiveDate: data.effectiveDate,
          calibrationDate: data.calibrationDate,
          location: data.location,
          status: data.status,
        };
        this.getPortId();
        this.getInstrumentType();
      },
      deep: true,
    },
  },
  methods: {
    onSaveItem() { // 保存按钮
      // 1. 先验证表单数据是否完整
      this.$refs.basicMessageForm.validate((valid) => {
        if (valid) {
          // 2. 调用接口
          const temp = this.itemModel.id;
          const url = 'bas/instrument/';
          this.saveLoading = true;
          this.$http[temp ? 'put' : 'post'](url, this.itemModel)
            .then((response) => {
              if (response.data.success) {
                this.$message.success({
                  message: '操作成功',
                  duration: 1500,
                  showClose: true,
                });
                // 3. 将父组件dialog框关闭
                this.$emit('onCloseDialog');
              } else {
                this.$message.warning({
                  message: response.data.msg,
                  duration: 1500,
                });
              }
            }).finally(() => {
              this.saveLoading = false;
            });
        }
        return false;
      });
    },
    onClickBasin() { // 仪器名称按钮
      this.$refs.instrNameFormDialog.openDialog();
    },
    getintruNameData(val) {
      this.$set(this.itemModel, 'instrumentName', val.instrumentName);
      this.$set(this.itemModel, 'instrumentCode', val.instrumentCode);
      this.$set(this.itemModel, 'instrumentType', val.instrumentType);
      this.$set(this.itemModel, 'instrumentModel', val.instrumentModel);
      this.$refs.basicMessageForm.clearValidate();
    },
    onCloseDialog(val, onoff) { // 关闭按钮
      // 1. 重置表单的验证机制
      this.$refs[val].clearValidate();
      // this.selection = [];
      // this.currentPage = 1;
      // this.pageSize = 10;
      this.isClassName = false;
      // this.selection = [];
      // 3. 清空选中项数据
      // this.clearSelection();
      if (!onoff) {
        // 4. 关闭父组件的dialog框
        this.$emit('onCloseDialog');
      }
    },
    openAttachment() { // 打开附件
      // 1. 修改样式对应状态的布尔值
      this.isClassName = !this.isClassName;
    },
    getPortId() { // 获取站点下拉框数据
      this.$http.get('bas/portInfo/', {
        params: {
          page: 1,
          rows: 100000,
          psId: this.basicFormData.psId,
        },
      }).then((response) => {
        if (response.status === 200) {
          this.formData.portName = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    getInstrumentType() { // 获取仪器类型下拉框数据
      this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'InstrumentCategory' }).then((val) => {
        this.formData.instrumentType = val;
      });
    },
  },
  created() {
    const data = this.basicFormData;
    this.itemModel = {
      id: data.id,
      instrumentName: data.instrumentName,
      instrumentCode: data.instrumentCode,
      instrumentType: data.instrumentType,
      instrumentModel: data.instrumentModel,
      portId: data.portId,
      psId: data.psId,
      leaveTime: data.leaveTime,
      registerDate: data.registerDate,
      setupDate: data.setupDate,
      effectiveDate: data.effectiveDate,
      calibrationDate: data.calibrationDate,
      location: data.location,
      status: data.status,
    };
    this.getPortId();
    this.getInstrumentType();
  },
};
</script>

<style lang="scss" scoped>
.basicMessage{
  height: 100%;
  overflow: hidden;
  padding: 0px 10px;
  .basicAccessory{
    height: calc(100% - 210px);
    .accessoryTitle{
      height: 40px;
      width: 100%;
      padding: 10px;
      color: #303133;
      font-size: 18px;
      font-weight: bold;
      background-color: #E5EFFF;
      line-height: 20px;
    }
    .transition-box{
      height: calc(100% - 40px);
      .upload{
        height: 100%;
      }
    }
  }
}
.iconright {
  transform: rotateZ(-90deg);
}
</style>
