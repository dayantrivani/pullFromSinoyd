<template>
  <div class="form-container sign-up-container">
    <h2>请选择</h2>
    <scrollbar class="ps-group" height="calc(100% - 120px)">
      <div
        v-for="item in userOrgs"
        :key="item.id"
        :class="{ 'ps-item': 1, 'is-active': item.id === selectedOrg.id }"
        @click="nodeClick(item)">
        <span>{{ item.orgName }}</span>
      </div>
    </scrollbar>
    <el-button
      class="mar-t-sm"
      round
      type="success"
      size="large"
      style="width: 80%"
      :loading="loading"
      :disabled="!userOrgs.length || !selectedOrg.id"
      @click="$emit('load')"
    >{{ loading ? progress : '进入平台' }}</el-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { resetRouter } from '@/routes';

export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('auth', ['progress', 'selectedOrg']),
    ...mapGetters('auth', ['userOrgs']),
  },
  methods: {
    ...mapActions('auth', ['RefreshToken']),
    // 选择企业
    nodeClick(org) {
      if (this.loading) return;
      this.loading = true;
      this.RefreshToken(org)
        .then(() => {
          resetRouter();
        })
        .finally(() => {
          this.loading = false;
          this.$nextTick(() => {
            this.$emit('load');
          });
        });
    },
  },
};
</script>
