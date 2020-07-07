<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isEdit ? '编辑' : '新增'}开阀计划`"
    @close="closeDialog">
    <el-form ref="form" :rules="rules" label-width="100px" :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="企业名称：" prop="psId" hint-down>
        <select-table
          v-model="itemModel.psId"
          :label="itemModel.psName"
          @change="getPSDate"
        ></select-table>
      </el-form-item>

      <el-form-item label="站点名称：" prop="portId">
        <el-select
          v-loading="fploading"
          v-model="itemModel.portId"
          filterable
          @change="getPortDate"
        >
          <el-option
            v-for="(item, key) in select.portList"
            :key="key"
            :label="item.portName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="执行周期：" prop="execCycle">
        <el-select v-model="itemModel.execCycle" style="width: 100%" clearable>
          <el-option v-for="(item, index) in $enum.get('TIME_EXECCYCLE')" :key="index"
            :label="item.label" :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="type" label="开启时间：" prop="beginTime">
        <el-time-picker
          v-if="type === 'minute'"
          v-model="itemModel.beginTime"
          value-format="HH:mm"
          format="HH:mm"
          :clearable="false"
          style="width: 100%"
        ></el-time-picker>

        <el-select v-if="type === 'day'" v-model="itemModel.beginTime" style="width: 100%" clearable>
          <el-option v-for="(item, key) in 31" :key="key"
            :value="item < 10 ? `0${item}` : item"
            :label="`${item < 10 ? `0${item}` : item}日`">
          </el-option>
        </el-select>
        <!-- <el-date-picker
          v-if="type === 'day'"
          v-model="itemModel.beginTime"
          type="date"
          value-format="MM-dd"
          format="MM月dd日"
          :clearable="false"
          style="width: 100%"
          :picker-options="pickerOptionsDay"
        ></el-date-picker> -->

        <el-date-picker
          v-if="type === 'month'"
          v-model="itemModel.beginTime"
          type="month"
          value-format="MM"
          format="MM月"
          :clearable="false"
          style="width: 100%"
          :picker-options="pickerOptionsMonth"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="type" label="结束时间：" prop="endTime">
        <el-time-picker
          v-if="type === 'minute'"
          v-model="itemModel.endTime"
          value-format="HH:mm"
          format="HH:mm"
          :clearable="false"
          style="width: 100%"
        ></el-time-picker>


        <el-select v-if="type === 'day'" v-model="itemModel.endTime" style="width: 100%" clearable>
          <el-option v-for="(item, key) in 31" :key="key"
            :value="item < 10 ? `0${item}` : item"
            :label="`${item < 10 ? `0${item}` : item}日`">
          </el-option>
        </el-select>
        <!-- <el-date-picker
          v-if="type === 'day'"
          v-model="itemModel.endTime"
          type="date"
          value-format="MM-dd"
          format="MM月dd日"
          :clearable="false"
          style="width: 100%"
          :picker-options="pickerOptionsDay"
        ></el-date-picker> -->

        <el-date-picker
          v-if="type === 'month'"
          v-model="itemModel.endTime"
          type="month"
          value-format="MM"
          format="MM月"
          :clearable="false"
          style="width: 100%"
          :picker-options="pickerOptionsMonth"
        ></el-date-picker>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button
        icon="fas fa-times"
        @click="$refs.dialog.closeDialog()">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
// import _ from 'lodash';
import { saveItem } from '@/global/libs/mixins';
import SelectTable from '@/components/select-table';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [saveItem],               // 使用混合
  components: {
    SelectTable,
  },
  data() {
    return {
      saveLoading: false,                   // 保存按钮
      url: 'tpeci/valveOpenPlan',           // 必须, 接口地址
      type: '',                             // 日期控件类型
      loading: false,
      fploading: false,
      isAuto: false,
      // pickerOptionsDay: {                   // 月 -- 禁用其他月份、年份的选择
      //   disabledDate(time) {
      //     return (time.getFullYear() !== new Date().getFullYear())
      //       || (time.getMonth() !== new Date().getMonth());
      //   },
      // },
      pickerOptionsMonth: {                 // 年 - 禁用其他年份的选择
        disabledDate(time) {
          return time.getFullYear() !== new Date().getFullYear();
        },
      },
      itemModel: {                          // 表单对象
        regionCodeId: '',                   // 行政区域id
        regionName: '',                     // 行政区域名称
        psId: '',                           // 企业id
        psName: '',                         // 企业名称
        portId: '',                         // 站点id
        portName: '',                       // 站点名称
        execCycle: '',                      // 执行周期
        beginTime: '',                      // 开始时间
        endTime: '',                        // 结束时间
      },
      select: {                             // 查询条件选择框
        portList: [],                       // 站点列表
      },
      rules: {                              // 表单验证
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        portId: [
          { required: true, message: '请选择站点', trigger: ['blur', 'change'] },
        ],
        execCycle: [
          { required: true, message: '请选择执行周期', trigger: ['blur', 'change'] },
        ],
        beginTime: [
          { required: true, message: '请选择开始时间', trigger: ['blur', 'change'] },
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    isEdit() {                      // 是否为编辑对话框
      return this.itemModel.id;
    },
  },
  watch: {
    'itemModel.execCycle': {
      handler(val) {
        if (!val) {  return; }
        this.itemModel.beginTime = '';
        this.itemModel.endTime = '';
        let type = '';
        if (+val === 1) {
          type = 'minute';
        } else if (+val === 2) {
          type = 'day';
        } else if (+val === 3) {
          type = 'month';
        }
        this.type = type;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    openDialog() {                  // 打开对话框
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    /** 表单下拉框方法 */
    getPSDate(val) {                 // 企业选择框
      this.itemModel.psName = val;
      this.getPortList();
    },
    getPortDate(val) {               // 站点选择框
      let obj = {};
      obj = this.select.portList.find(item => item.id === val);
      this.itemModel.portName = obj.portName || '';
      this.itemModel.regionCodeId = obj.regionCodeId || '';
      this.itemModel.regionName = obj.regionName || '';
    },

    /** 接口层 */
    getPortList() {              // 获取排口点位列表
      this.select.portList = [];
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          psName: this.itemModel.psName,
          page: 1,
          rows: 100000,
          portType: 1,
          childPortType: 5,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.portList = response.data.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },

    /** 特殊方法 */
    onSaveCheck(callback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const { type } = this;                       // 日期控件类型
        const { beginTime } = this.itemModel;        // 开始时间
        const { endTime } = this.itemModel;          // 结束时间
        let st = 0;                                  // 开始时间时间戳
        let et = 0;                                  // 结束时间时间戳
        if (type === 'minute') {
          st = new Date(`${y}/${m}/${d} ${beginTime}`).getTime();
          et = new Date(`${y}/${m}/${d} ${endTime}`).getTime();
        } else if (type === 'day') {
          // st = new Date((`${y}/${beginTime}`).replace(/-/g, '/')).getTime();
          // et = new Date((`${y}/${endTime}`).replace(/-/g, '/')).getTime();
          st = new Date(`${y}/${m}/${beginTime}`).getTime();
          et = new Date(`${y}/${m}/${endTime}`).getTime();
        } else if (type === 'month') {
          st = new Date(`${y}/${beginTime}`).getTime();
          et = new Date(`${y}/${endTime}`).getTime();
        }
        if (st > et) {
          this.$message({
            type: 'warning',
            message: '开始时间大于结束时间',
            showClose: true,
            duration: 3000,
          });
          return;
        }
        this.onSaveItem(callback);
      });
    },
    saveCallback() {                // 保存请求回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    closeDialog() {                 // 关闭弹框
      this.type = '';
      this.select.portList = [];
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {                // 重置表单数据
      return {
        regionCodeId: '',                   // 行政区域id
        regionName: '',                     // 行政区域名称
        psId: '',                           // 企业id
        psName: '',                         // 企业名称
        portId: '',                         // 站点id
        portName: '',                       // 站点名称
        execCycle: '',                      // 执行周期
        beginTime: '',                      // 开始时间
        endTime: '',                        // 结束时间
      };
    },
  },
};
</script>
