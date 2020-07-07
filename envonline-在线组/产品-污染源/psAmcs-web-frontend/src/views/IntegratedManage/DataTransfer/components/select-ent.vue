<template>
    <el-select
      v-model="item"
      style="width: 100%;"
      filterable
      multiple
      collapse-tags
    >
      <el-option
        v-for="item in itemList"
        :key="item.id"
        :label="item.psName"
        :value="item.psId"
      ></el-option>
    </el-select>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    value: [Array],
  },
  data() {
    return {
      itemList: [],
    };
  },
  computed: {
    item: {
      get() { return this.value; },
      set(val) {
        this.$emit('selected', val);
      },
    },
  },
  created() {
    this.getItemList();
  },
  methods: {
    // 获取选项数据
    getItemList() {
      this.loading = true;
      this.$http.get('bas/psBaseInfo', {
        params: {
          page: 1,
          rows: 1000000,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
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
  },
};
</script>

<style lang="scss" scoped>
</style>
