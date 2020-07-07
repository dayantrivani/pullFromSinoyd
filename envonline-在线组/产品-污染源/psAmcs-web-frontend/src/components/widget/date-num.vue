<template>
  <!--
    监管级别为重点时，出现年份下拉框,封装为小部件
   -->
  <el-form-item label="监管级别：">
    <el-select :style="{ width: `${isDialog && keyPollutant !== 1 ? '100%' : '90px' }!important` }"
      :value="keyPollutant" @change="changeHandler">
      <el-option :value="-1" label="全部"></el-option>
      <el-option
        v-for="item in this.$enum.get('KEY_POLLUTANT')"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-date-picker
      v-if="keyPollutant === 1"
      :style="{ width: `${isDialog ? 'calc(100% - 100px)' : '95px'}!important` }"
      class="mar-l-sm"
      v-model="year"
      value-format="yyyy"
      type="year"
      placeholder="选择年份"
      :clearable="false">
    </el-date-picker>
  </el-form-item>
</template>

<script>
export default {
  name: 'DateNum',
  model: {                  // v-model进行拆分 value 是值
    prop: 'value',
    event: 'selected',
  },
  inject: ['app'],
  props: {
    keyPollutant: {         // 监管级别
      type: Number,
      required: true,
    },
    isDialog: {             // 该组件是否用在弹框内
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      year: '',
    };
  },
  watch: {
    keyPollutant: {
      handler(val) {
        if (val === 1) {
          this.year = `${new Date().getFullYear()}`;
        } else {
          this.year = '-1';
        }
        this.$emit('selected', +(this.year));
      },
      immediate: true,
    },
    year: {
      handler(val) {
        this.$emit('selected', +val);
      },
    },
  },
  methods: {
    changeHandler(val) {
      this.app.queryForm.keyPollutant = val;
    },
  },
};
</script>
