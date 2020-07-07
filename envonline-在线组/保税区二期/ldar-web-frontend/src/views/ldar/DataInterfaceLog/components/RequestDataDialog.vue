<template>
  <dialog-modal ref="dialog"
                title="传输数据"
                maxScrollbar
                size="mini"
                @close="closeDialog">
    <el-input type="textarea"
              :rows="30"
              v-model="newData">
    </el-input>
    <div slot="footer"
         class="dialog-footer">
      <el-button icon="fa fa-times"
                 @click="closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/libs/util';

export default {
  name: 'DialogForm',
  data() {
    return {
      newData: '',
      loading: false,
    };
  },
  methods: {
    // 开
    openDialog(row) {
      this.getItemList(row.id);
      this.$refs.dialog.openDialog();
    },
    getItemList(id) {
      this.loading = true;
      this.$http.get(`ldar/dataInterfaceLog/${id}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          const { data } = response.data;
          this.newData = JSON.stringify(JSON.parse(data.requestData), null, '\t');
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
    // 关
    closeDialog() {
      this.data = '';
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
