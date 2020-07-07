<template>
  <el-row :gutter="$config.space" v-resize>
    <el-col :span="5">
      <el-card type="title">
        <div slot="header" class="z-default">
          <!-- <i class="el-icon-back"></i> -->
          <!-- <i class="fas fa-arrow-left"></i> -->
          <span> 报警类型列表</span>
        </div>
        <menu-tree
          current-route
          title="报警类型"
          url="alarm/alarmType"
          :props="{
            label: 'alarmTypeName',
            value: 'alarmTypeCode',
          }"
          @node-click="onClickNode" />
      </el-card>
    </el-col>
    <el-col :span="19">
      <router-view :key="key" />
    </el-col>
  </el-row>
</template>

<script>
import menuTree from '@/components/menu-tree.vue';

export default {
  name: 'ListNav',
  components: {
    menuTree,
  },
  data() {
    return {
      menu: {},
    };
  },
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date();
    },
  },
  methods: {
    onClickBack() {
      this.$router.push({ name: 'CompaniesList' });
    },
    onClickNode(data, node) {
      // if (node.flag) {
      //   this.$store.commit('sample/setAlarmType', data);
      // }
      if (node.level !== 1) {
        this.$router.replace({ name: data.alarmTypeCode });
      }
    },
  },
};
</script>
