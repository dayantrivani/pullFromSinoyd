<template>
  <div>
    <el-page-header fit @back="onBack">
      <template #content>
        <span>{{ row.projectCode }}</span>
        <span class="text-info pad-l-sm" style="font-size: 0.8em">{{ row.projectName }}</span>
      </template>
    </el-page-header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      row: {},
    };
  },
  methods: {
    init(row) {
      this.row = row;
    },
    onBack() {
      this.$emit('back');
      this.row = {};
    },
  },
};
</script>
