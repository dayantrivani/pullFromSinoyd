<template>
  <dialog-modal ref="dialog" size="small" title="配置规则" @close="closeDialog">
    <!-- 拖拽 -->
    <div style="height: 350px;" class="mar-b-sm">
      <el-transfer
        v-model="rightList"
        v-loading="loading"
        :props="{
          key: 'id',
          label: 'factorName'
        }"
        :titles="['未选因子', '已选因子']"
        :data="leftList">
      </el-transfer>
    </div>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" @click="onSaveItem">保 存</el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
// import { queryList } from '@/global/libs/mixins';

export default {
  props: {
    alarmType: {
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      url: '',
      isAuto: false,
      field: '',
      loading: false,
      queryForm: {
        factorsType: 1,
        category: '',
        notIds: [],
      },
      systemTypeList: [
        { dictCode: 'Water', dictValue: '1' },
        { dictCode: 'Air', dictValue: '2' },
        { dictCode: 'Noise', dictValue: '3' },
        { dictCode: 'Solid', dictValue: '' },
        { dictCode: 'Rain', dictValue: '1' },
      ],
      leftList: [
      ],
      rightList: [
      ],
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    openDialog(item) {
      this.field = Object.assign({}, item);
      const { dictValue } = this.systemTypeList.filter(val => val.dictCode === item.systemTypeCode)[0];
      this.$set(this.queryForm, 'category', +dictValue === 0 ? '' : +dictValue);
      this.getAlarmFactorsList('alarm/alarmRuleForAbnormalFactor', 'rightList');
      this.$refs.dialog.openDialog();
    },
    getFactorsList(url, name) {
      this.loading = true;
      this.$http.post(`${url}?page=1&rows=100000&sort=factorCode`, { ...this.queryForm })
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            if (typeof this.get_success_callback === 'function'
              && this.get_success_callback) this.get_success_callback(response, name);
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.loading = false;
        });
    },
    getAlarmFactorsList(url, name) {
      this.loading = true;
      this.$http.get(url, {
        params: { page: 1, rows: 100000, objectId: this.field.id },
      }).then((response) => {
        if (response.status === 200
        && (response.data.success
        || response.data.msg.includes('未查询到符合条件的数据'))) {
          if (typeof this.get_success_callback === 'function'
          && this.get_success_callback) this.get_success_callback(response, name);
          this.getFactorsList('cfg/factors/notIn/', 'leftList');
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
          this.loading = false;
        }
      }, ({ response }) => {
        analyzeResp(response);
        this.loading = false;
      });
    },
    onSaveItem() {
      const data = this.leftList.filter(item => this.rightList.includes(item.id)).map((item) => {
        const factors = {
          alarmTypeId: this.alarmType.id,
          objectId: this.field.id,
          factorId: item.id,
          factorCode: item.factorCode,
          factorName: item.factorName,
        };
        return factors;
      });
      this.$http.post('alarm/alarmRuleForAbnormalFactor/batch', data)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$emit('query');
            this.$refs.dialog.closeDialog();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        });
    },
    closeDialog() {
      this.loading = false;
      this.leftList = [];
      this.rightList = [];
      this.queryForm = {
        factorsType: 1,
        category: '',
        notIds: [],
      };
    },

    get_success_callback(response, name) {
      if (!response.data) return;
      if (name === 'rightList') {
        this[name] = response.data.data.map(item => item.factorId);
        return;
      }
      this[name] = response.data.data;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
