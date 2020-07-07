<template>
  <!-- 安全风险四色分布图 -->
  <upload-table ref="upload"/>
</template>

<script>
import { mapState } from 'vuex';
import UploadTable from '@/components/widgets/UploadTable';

export default {
  name: 'UPSecureFourColorMap',
  components: {
    UploadTable,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      uploadPageInfo: state => state.psInfo.uploadPageInfo,
    }),
  },
  created() {
    this.getUploadFile(this.uploadPageInfo.rowGuid);
  },
  methods: {
    getUploadFile(id) {
      this.$nextTick(() => {
        this.$refs.upload.setPageId(id);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
