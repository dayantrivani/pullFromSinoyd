<template>
  <el-date-picker
    v-model="dateRange"
    unlink-panelsb
    :type="type"
    :align="align"
    :start-placeholder="placeholder[0] || '开始日期'"
    :end-placeholder="placeholder[1] || '结束日期'"
    :range-separator="placeholder[2] || '至'"
    :format="format"
    :value-format="valueFormat"
    :clearable="clearable"
    :picker-options="noLink || pickerOptions">
  </el-date-picker>
</template>

<script>
export default {
  name: 'DateRange',
  model: {
    prop: 'value',
    event: 'setValue',
  },
  props: {
    // 绑定对象，该对象包含日期属性
    value: {
      type: Object,
    },
    // 日期时间范围控件传 datetimerange
    type: {
      type: String,
      default: 'daterange',
    },
    // 开始日期字段
    from: {
      type: String,
      default: 'fromDate',
    },
    // 结束日期字段
    to: {
      type: String,
      default: 'toDate',
    },
    noLink: {
      type: Boolean,
    },
    // 标签属性
    placeholder: {
      type: Array,
      default() {
        return ['开始日期', '结束日期', '至'];
      },
    },
    align: {
      type: String,
      default: 'left',
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd',
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    dateRange: {
      get() {
        return (!this.value[this.from] && !this.value[this.to])
          ? ''
          : [this.value[this.from], this.value[this.to]];
      },
      set(val) {
        [this.value[this.from], this.value[this.to]] = val || ['', ''];
        this.$emit('setValue', this.value);
      },
    },
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近半年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
    };
  },
};
</script>
