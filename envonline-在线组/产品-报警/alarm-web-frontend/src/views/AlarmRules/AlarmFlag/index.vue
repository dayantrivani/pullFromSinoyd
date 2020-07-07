<template>
  <!-- 选项卡内容 -->
  <el-tabs type="border-card" style="height:calc(100% + 0px)" @tab-click="handleChange">
    <el-tab-pane label="标记位异常" laze>
      <!-- 按钮 -->
      <div class="mar-y-xs mar-l-sm">
        <el-button type="primary" icon="fas fa-save" v-loading="saveLoading" @click="onSaveCheck()">保 存
        </el-button>
      </div>
      <hr class="mar-x-sm">
      <!-- 表单项内容 -->
      <el-form
        ref="form"
        label-width="100px"
        label-position="right"
        class="item-space mar-t-sm"
        v-loading="formLoading"
        :model="itemModel"
        :rules="rules"
      >
      <!-- 测试 -->
      <el-row>
        <el-col :span="16">
          <el-form-item label="报警名称：" prop="alarmTypeName">
            <el-input v-model="itemModel.alarmTypeName" autofocus></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="报警编号：" prop="alarmTypeCode">
            <el-input v-model="itemModel.alarmTypeCode" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="是否启用：" prop="isEnabled">
            <el-tooltip :content="itemModel.isEnabled ? '是' : '否'" placement="top">
              <el-switch
                v-model="itemModel.isEnabled"
                :active-value="true"
                :inactive-value="false">
              </el-switch>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="排序号：" prop="orderNum">
            <!-- 正整数 -->
            <el-input-number
              v-model="itemModel.orderNum"
              controls-position="right"
              :min="0"
              :max="2147483647"
              :precision="0"
              style="width: 100%;"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              v-model="itemModel.remark"
              :autosize="{ minRows: 2, maxRows: 2}"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="标记位规则" lazy>
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for = "item in tabList" :key="item.rowGuid" :label="item.dictName" :name="item.dictCode"
        class="mar-x-0">
          <waste-water ref="child1" :ids="keyId" :code="dictCode" :names="dictName"/>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import WasteWater from './components/WasteWater';
// import WasteGas from './components/WasteGas';

export default {
  name: 'MarkerAnomaly',
  components: {
    WasteWater,
    // WasteGas,
  },
  data() {
    return {
      saveLoading: false,                               // 保存按钮加载状态
      formLoading: false,                               // 表单加载状态
      itemModel: {                                      // 表单数据
        alarmTypeName: '',
        alarmTypeCode: '',
        isEnabled: false,
        orderNum: '',
        remark: '',
      },
      activeTab: 'Water',                               // 次级选项卡默认值
      tabList: [],                                      // 标签页数据源
      keyId: '',                                        // 需要传递的systemTypeId
      dictCode: '',                                     // 需要传递的systemTypeCode
      dictName: '',
      rules: {                                          // 验证信息内容
        alarmTypeName: [
          { required: true, message: '请输入报警名称', trigger: ['blur', 'change'] },
        ],
        alarmTypeCode: [
          { required: true, message: '请输入报警编号', trigger: ['blur', 'change'] },
        ],
        isEnabled: [
          { required: true, message: '请选择是否启用', trigger: ['blur', 'change'] },
        ],
        orderNum: [
          { required: true, message: '请输入排序号', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  created() {
    this.getBaseInfo();
    this.getPortTypeList();
  },
  computed: {
    // ...mapState({
    //   alarmType: state => state.sample.alarmType,
    // }),
    alarmType() {
      const [alarmType] = this.$store.state.sample.alarmType.filter(n => n.alarmTypeCode === this.$route.name);
      return alarmType;
    },
  },
  methods: {
    // 点击选项卡事件
    handleChange() {
      this.activeTab = this.tabList[0].dictCode;
      this.keyId = this.tabList[0].rowGuid;
      this.dictCode = this.tabList[0].dictCode;
      this.dictName = this.tabList[0].dictName;
    },
    handleClick(tab) {
      this.keyId = this.tabList[tab.index].rowGuid;
      this.dictCode = this.tabList[tab.index].dictCode;
      this.dictName = this.tabList[tab.index].dictName;
      tab.$children[0].getItemList(this.keyId);
      // if (tab.label === this.dictName) {
      //   tab.$children[0].getItemList(this.keyId);
      // }
    },

    // 新增排口弹窗
    getPortTypeList() {
      this.$http.get('sys/enumCode/PortType/0').then((response) => {
        this.tabList = response.data;
      }, (response) => {
        analyzeResp(response);
      });
    },
    // 获取基本信息__获取第一个选项卡中的数据信息
    getBaseInfo() {
      this.formLoading = true;
      this.$http.get(`alarm/alarmType/${this.alarmType.id}`)
        .then((response) => {
          if (response.data.success) {
            this.itemModel = response.data.data;
            this.$nextTick(() => {
              this.$refs.form.clearValidate();
            });
          } else {
            this.$message({
              type: 'warning',
              showClose: true,
              message: response.data.msg,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.formLoading = false;
        });
    },

    // 保存按钮方法
    onSaveCheck() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.formLoading = true;
        this.saveLoading = true;
        this.itemModel.parentId = this.alarmType.id;
        this.$http.put('alarm/alarmType', this.itemModel)
          .then((response) => {
            this.itemModel = response.data.data;
            this.$message({
              type: response.data.success ? 'success' : 'warning',
              showClose: true,
              message: response.data.msg,
            });
          }, ({ response }) => {
            analyzeResp(response);
          }).finally(() => {
            this.formLoading = false;
            this.saveLoading = false;
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
