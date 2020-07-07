<template>
  <!-- 企业关停并转记录 -->
  <upload-table ref="upload"/>
</template>

<script>
import { mapState } from 'vuex';
import UploadTable from '@/components/widgets/UploadTable';

export default {
  name: 'UPRecordEPClosTurn',
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
