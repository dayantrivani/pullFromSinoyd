<template>
  <!-- 易制毒和易制爆信息 -->
  <el-card type="title" class="PoisonExplosive" :body-style="{ 'overflow-y': 'auto' }">
    <template slot="header">易制毒和易制爆信息</template>
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-save" @click="save">保 存</el-button>
    </div>
    <hr class="mar-x-sm">
    <el-form label-width="120px" :model="form" class="mar-t-xs" label-position="top" style="margin-left: 10px;">
      <el-row>
        <el-col :span="16">
            <el-form-item label="易制毒信息：">
              <el-input  type="textarea" v-model="form.easyMakePoisonInfo"
                :autosize="{ minRows: 2, maxRows: 2}"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="易制爆信息：">
            <el-input  type="textarea" v-model="form.easyMakeExplosionInfo"
              :autosize="{ minRows: 2, maxRows: 2}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
// import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'EasyMakePoisonExplosion',
  // mixins: [queryList, deleteItem],
  data() {
    return {
      form: {
        easyMakePoisonInfo: '',  // 易制毒
        easyMakeExplosionInfo: '',   // 易制爆
      },
      isEdit: false,
      loading: false,

    };
  },
  computed: {
    // 记录企业列表选中当前行id
    id() {
      return this.$store.state.psInfo.id || JSON.parse(window.sessionStorage.getItem('psInfo')).id;
    },
  },
  created() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.$http.get(`bas/easyMakePoisonExplosion/${this.id}`)
        .then((response) => {
          if (response.data.code === 200 && response.data.success) {
            if (response.data.data) {
              this.form = response.data.data;
              this.isEdit = true;
            } else {
              this.isEdit = false;
            }
          } else {
            this.$message({
              showClose: true,
              type: 'warning',
              message: response.data.msg,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        });
    },
    save() {
      if (!this.isEdit) {
        this.$set(this.form, 'psId', this.id);
      }
      this.$http[this.isEdit ? 'put' : 'post']('bas/easyMakePoisonExplosion/', this.form)
        .then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
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

<style>

</style>
