<!-- 业务组件 / 人员选择 -->

<template>
  <container fill>
    <el-card fill header="人员选择" shadow="never">
      <select-person
        v-model="userModel"
        clearable
        filterable
        multiple
        collapse-tags
        :roles="roles"
      />
    </el-card>
  </container>
</template>

<script>
import SelectPerson from '@/components/SelectPerson';

export default {
  name: 'PersonSelect',
  components: {
    SelectPerson,
  },
  data() {
    return {
      userModel: [],
      roles: [
        // 'pro_leader_all',
        // 'pro_report_show',
        // 'pro_register_show',
        // 'pro_localData_show',
      ],
    };
  },
};
</script>
