<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    append-to-body
    :title="`${isEdit ? '编辑' : '新增'}总量阈值`"
    @close="closeDialog">
    <el-form ref="form" :rules="rules" label-width="130px" :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box" v-loading="loading">
      <el-form-item label="阈值模式：" prop="thresholdMode" hint-down>
        <el-select style="width:100%;" v-model="itemModel.thresholdMode" clearable>
          <el-option
            v-for="(item, index) in $enum.get('THRESHOLD_MODE')"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="阈值年份：" prop="thresholdYear">
        <el-date-picker
          v-model="year"
          type="year"
          value-format="yyyy"
          format="yyyy"
          :clearable="false"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="type === 'date'" label="开始时间：" prop="beginDate">
        <el-date-picker
          v-model="itemModel.beginDate"
          :type="type"
          value-format="yyyy-MM-dd 00:00:00"
          format="yyyy-MM-dd"
          :clearable="false"
          style="width: 100%;"
          :picker-options="PickerOptions"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="type === 'date'" label="结束时间：" prop="endDate">
        <el-date-picker
          v-model="itemModel.endDate"
          :type="type"
          value-format="yyyy-MM-dd 23:59:59"
          format="yyyy-MM-dd"
          :clearable="false"
          style="width: 100%;"
          :picker-options="PickerOptions"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="type === 'month'" label="选择开始月份：" prop="beginDate">
        <el-date-picker
          v-model="itemModel.beginDate"
          :type="type"
          value-format="yyyy-MM-dd 00:00:00"
          format="yyyy-MM"
          :clearable="false"
          style="width: 100%;"
          :picker-options="PickerOptions"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="type === 'month'" label="选择结束月份：" prop="endDate">
        <el-date-picker
          v-model="itemModel.endDate"
          :type="type"
          value-format="yyyy-MM-dd 23:59:59"
          format="yyyy-MM"
          :clearable="false"
          style="width: 100%;"
          :picker-options="PickerOptions"
        ></el-date-picker>
      </el-form-item> -->

      <el-form-item label="因子名称：" prop="factorCode">
        <el-select style="width:100%;" v-model="itemModel.factorCode" filterable clearable @change="getFactorData">
          <el-option
            v-for="(item, index) in select.factorsList"
            :key="index"
            :label="item.factorName"
            :value="item.factorCode">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="排放量阈报警值：" prop="alertUpper">
        <el-input v-model="itemModel.alertUpper" clearable></el-input>
      </el-form-item>

      <el-form-item label="排放量阈预警值：" prop="warnAlertUpper">
        <el-input v-model="itemModel.warnAlertUpper" clearable></el-input>
      </el-form-item>

      <el-form-item label="单位：" prop="unit">
        <el-input v-model="itemModel.unit" disabled></el-input>
      </el-form-item>

      <!-- <el-form-item label="是否启用：" prop="status">
        <el-tooltip :content="itemModel.status ? '是' : '否'" placement="top">
          <el-switch
            v-model="itemModel.status"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-tooltip>
      </el-form-item> -->
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
import _ from 'lodash';
import { analyzeResp } from '@/global/libs/util';
import { saveItem } from '@/global/libs/mixins';

export default {
  mixins: [saveItem],               // 使用混合
  components: {
  },
  props: {
    mainrow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      saveLoading: false,                   // 保存按钮
      loading: false,                       // 表单
      once: true,                           // 在第一次编辑点击进入时,用来判断不去触发watch
      url: 'tpeci/valveSchemeDetail',
      type: '',                             // 日期类型
      itemModel: {                          // 表单对象
        schemeId: '',                       // 配置方案id
        type: 1,                            // 1 总量阈值 2 浓度阈值
        thresholdMode: '',                  // 阈值模式
        beginDate: '',                      // 开始时间
        endDate: '',                        // 结束时间
        factorId: '',                       // 因子id
        factorCode: '',                     // 因子编号
        factorName: '',                     // 因子名称
        thresholdYear: '',                  // 阈值年份
        alertUpper: '',                     // 排放量阈报警值
        warnAlertUpper: '',                 // 排放量阈预警值
        unit: '',                           // 单位
        status: 1,                          // 是否启用 0停用 1启用
      },
      select: {
        factorsList: [],
      },
      rules: {                              // 表单验证
        thresholdMode: [
          { required: true, message: '请选择阈值模式', trigger: ['blur', 'change'] },
        ],
        // beginDate: [
        //   { required: true, message: '请选择开始时间', trigger: ['blur', 'change'] },
        // ],
        // endDate: [
        //   { required: true, message: '请选择结束时间', trigger: ['blur', 'change'] },
        // ],
        factorCode: [
          { required: true, message: '请选择因子名称', trigger: ['blur', 'change'] },
        ],
        // thresholdYear: [
        //   { required: true, message: '请选择阈值年份', trigger: ['blur', 'change'] },
        // ],
        alertUpper: [
          { required: true, message: '请输入排放量阈报警值', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        warnAlertUpper: [
          { required: true, message: '请输入排放量阈预警值', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        // unit: [
        //   { required: true, message: '请输入单位', trigger: ['blur', 'change'] },
        // ],
      },
    };
  },
  computed: {
    isEdit() {                      // 是否为编辑对话框
      return this.itemModel.id;
    },
    // year: {                         // 选择年
    //   get() {
    //     return this.itemModel.thresholdYear;
    //   },
    //   set(val) {
    //     this.itemModel.beginDate = `${val}-01-01 00:00:00`;
    //     this.itemModel.endDate = `${val}-12-31 23:59:59`;
    //     this.itemModel.thresholdYear = val;
    //   },
    // },
    // PickerOptions() {
    //   const that = this;
    //   return {
    //     disabledDate(val) {
    //       return val.getFullYear() !== +that.itemModel.thresholdYear;
    //     },
    //   };
    // },
  },
  watch: {
    // 'itemModel.thresholdMode': {
    //   handler(val) {
    //     if (!val) return;
    //     const valNum = +val;
    //     const date = new Date(this.itemModel.thresholdYear);
    //     const y = date.getFullYear();   // 年
    //     let m = date.getMonth() + 1;    // 月
    //     if (m < 10) {
    //       m = `0${m}`;
    //     }
    //     const d = date.getDate(); // 日
    //     let ed = new Date(y, m, 0).getDate();  // 当月最后一天
    //     if (ed < 10) {
    //       ed = `0${ed}`;
    //     }
    //     let type = '';
    //     let starttime = '';
    //     let endtime = '';
    //     if (valNum === 1) {  // 日 精确到日
    //       starttime = `${y}-${m}-${d} 00:00:00`;
    //       endtime = `${y}-${m}-${d} 23:59:59`;
    //       type = 'date';
    //     } else if (valNum === 2) {  // 月 该月份开始时间到结束时间
    //       starttime = `${y}-${m}-01 00:00:00`;
    //       endtime = `${y}-${m}-${ed} 23:59:59`;
    //       type = 'month';
    //     } else if (valNum === 3) {  // 年 今年
    //       starttime = `${y}-01-01 00:00:00`;
    //       endtime = `${y}-12-31 23:59:59`;
    //       type = 'year';
    //     }
    //     if (!this.once) {
    //       this.itemModel.beginDate = starttime;
    //       this.itemModel.endDate = endtime;
    //     }
    //     this.type = type;
    //   },
    //   deep: true,
    // },
    // 'itemModel.endDate': {
    //   handler(val) {
    //     if (+this.itemModel.thresholdMode === 2) { // 月
    //       // 1. 获取传入时间的UTS对象
    //       const dateUTS = new Date(val.replace(/-/g, '/'));
    //       // 2. 获取传入时间的 年
    //       const y = dateUTS.getFullYear();
    //       // 3. 获取传入时间的 月
    //       let m = dateUTS.getMonth() + 1;
    //       // 4. 月前加上0
    //       if (m < 10) {
    //         m = `0${m}`;
    //       }
    //       // 5. 获取传入时间月的最后一天
    //       let ed = new Date(y, m, 0).getDate();
    //       if (ed < 10) {
    //         ed = `0${ed}`;
    //       }
    //       // 6. 拼出需要的格式
    //       const varStrArr = `${y}-${m}-${ed} 23:59:59`;
    //       // 7. 将传入时间与格式化时间对比，如果不相同，则将格式好的值传给itemModel.endDate
    //       if (val !== varStrArr) {
    //         this.itemModel.endDate = varStrArr;
    //       }

    //       // const date = new Date(this.itemModel.thresholdYear);
    //       // const y = date.getFullYear();   // 年
    //       // let m = date.getMonth() + 1;    // 月
    //       // if (m < 10) {
    //       //   m = `0${m}`;
    //       // }
    //       // let ed = new Date(y, m, 0).getDate();  // 当月最后一天
    //       // if (ed < 10) {
    //       //   ed = `0${ed}`;
    //       // }
    //       // if (val.toString().slice(8, 10) === '01') {
    //       //   const varStrArr = val.toString().split('');
    //       //   const edStrArr = ed.toString().split('');
    //       //   varStrArr.splice(8, 2, ...edStrArr);
    //       //   this.itemModel.endDate = varStrArr.join('');
    //       // }
    //     }
    //   },
    //   deep: true,
    // },
  },
  methods: {
    openDialog(row) {               // 打开对话框
      this.$refs.dialog.openDialog();
      this.getFactorsList();
      let val = row;
      if (row) {
        val = _.cloneDeep(row);
        this.psName = val.psName || '';
        this.itemModel = this.setEmptyItem(val);
      }
      //  else {
      //   this.itemModel.thresholdYear = new Date().getFullYear().toString();
      // }
      this.itemModel.schemeId = this.mainrow.id || '';
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        this.once = false;
      });
    },

    /** 接口层 */
    getFactorsList() {              // 获取因子数据列表
      this.loading = true;
      this.$http.get('cfg/factors/', {
        params: {
          page: 1,
          rows: 100000,
          factorsType: 1,
          category: 1,
          sort: 'factorName+',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.factorsList = response.data.data || [];
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },

    /** 特殊方法 */
    getFactorData(val) {            // 获取因子数据
      const data = this.select.factorsList.filter(v => v.factorCode === val)[0] || {};
      this.$set(this.itemModel, 'factorId', data.id || '');
      this.$set(this.itemModel, 'factorName', data.factorName || '');
      this.$set(this.itemModel, 'unit', data.unitCou || '');
    },
    onSaveCheck(callback) {         // 保存记录
      // const s = new Date(this.itemModel.beginDate.replace(/-/g, '/'));
      // const e = new Date(this.itemModel.endDate.replace(/-/g, '/'));
      // if (s > e) {
      //   this.$message({
      //     type: 'warning',
      //     message: '开始时间大于结束时间',
      //     showClose: true,
      //     duration: 3000,
      //   });
      //   return;
      // }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    saveCallback() {                // 保存请求回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    closeDialog() {                 // 关闭弹框
      this.once = true;
      this.type = '';
      this.psName = '';
      this.select.factorsList = [];
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {                // 重置表单数据
      return {
        schemeId: '',                       // 配置方案id
        type: 1,                            // 1 总量阈值 2 浓度阈值
        thresholdMode: '',                  // 阈值模式
        beginDate: '',                      // 开始时间
        endDate: '',                        // 结束时间
        factorId: '',                       // 因子id
        factorCode: '',                     // 因子名称
        factorName: '',                     // 因子名称名称
        thresholdYear: '',                  // 阈值年份
        alertUpper: '',                     // 排放量阈报警值
        warnAlertUpper: '',                 // 排放量阈预警值
        unit: '',                           // 单位
        status: 1,                          // 是否启用 0停用 1启用
      };
    },
    setEmptyItem(val) {             // 将列表数据赋值给表单数据
      const yearStr = (val.thresholdYear || '').toString();
      return {
        id: val.id || '',                             // 唯一标识
        type: val.type || 1,                          // 1 总量阈值 2 浓度阈值
        thresholdMode: val.thresholdMode || '',       // 阈值模式
        beginDate: val.beginDate || '',               // 开始时间
        endDate: val.endDate || '',                   // 结束时间
        factorId: val.factorId || '',                 // 因子id
        factorCode: val.factorCode || '',             // 因子名称
        factorName: val.factorName || '',             // 因子名称名称
        thresholdYear: yearStr,                       // 阈值年份
        alertUpper: val.alertUpper || '',             // 排放量阈报警值
        warnAlertUpper: val.warnAlertUpper || '',     // 排放量阈预警值
        unit: val.unit || '',                         // 单位
        status: val.status || 0,                      // 是否启用
        // isDeleted: false,
        // creator: val.creator || '',
        // createDate: val.createDate || '',
        // domainId: val.domainId || '',
        // modifier: val.modifier || '',
        // modifyDate: val.modifyDate || '',
        // statusString: val.statusString || null,
        // thresholdModeString: val.thresholdModeString || null,
        // typeString: val.typeString || null,
      };
    },
  },
};
</script>
