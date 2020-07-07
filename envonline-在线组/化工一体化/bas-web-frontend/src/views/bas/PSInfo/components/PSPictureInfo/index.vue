<template>
  <!-- 企业图片信息 -->
  <el-card class="title-card" type="title">
    <template slot="header">企业图片信息</template>
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-plus"
        @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除</el-button>
    </div>
    <el-table
      border
      height="calc(100% - 76px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column label="操作" width="116">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="fas fa-eye"
            @click="onClickSee(scope.row)">查看</el-button>
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column property="module" label="模块名称" show-overflow-tooltip></el-table-column> -->
      <el-table-column property="title" min-width="150" label="标题" show-overflow-tooltip></el-table-column>
      <el-table-column property="typeName" min-width="100" label="类型" show-overflow-tooltip></el-table-column>
      <el-table-column property="remark" min-width="200" label="描述" show-overflow-tooltip></el-table-column>
    </el-table>
    <dialog-modal ref="dialog" :title="`${objectId ? '编辑' : '新增'}企业图片信息`" size="mini" :before-close="beforeClose">
      <el-form :model="itemForm" ref="form" label-width="57px" :rules="rules" class="item-space pad-x-sm">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="itemForm.title"></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="typeCodeId">
          <el-select v-model="itemForm.typeCodeId">
            <el-option
              v-for="item in dict.EnterprisePictureTypes" :key="item.rowGuid"
              :label="item.dictName"
              :value="item.rowGuid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片：" prop="picture">
          <upload-picture ref="upload" :limit="1" :objectId="objectId"></upload-picture>
        </el-form-item>
        <el-form-item label="描述：" prop="remark">
          <el-input type="textarea" v-model="itemForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="onSaveCheck()"
          icon="fas fa-save"
          :loading="saveLoading">保 存</el-button>
        <el-button @click="beforeClose" icon="fa fa-times">关 闭</el-button>
      </div>
    </dialog-modal>
    <dialog-modal :title="imgTitle" ref="imgDialog" append-to-body>
      <img width="100%" :src="imageUrl" alt="">
    </dialog-modal>
    <!-- 分页 -->
    <paging-query v-model="pager" @query="getItemList"/>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import UploadPicture from '@/components/upload-picture';

export default {
  name: 'PSPictureInfo',
  components: { UploadPicture },
  data() {
    return {
      loading: false,
      itemList: [],
      selectedIds: [],
      objectId: '', // 当前上传文件的对象id
      itemForm: {},
      pager: {
        count: 0,
        rows: 15,
        page: 1,
      },
      dict: { EnterprisePictureTypes: [] }, // 字典表对象
      saveLoading: false,
      imageUrl: '', // 照片路径
      imgTitle: '',
      loadingSee: false,
      rules: {
        title: [
          { required: true, message: '请输入类型', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.getItemList(this.psId);
  },
  computed: {
    psId() { // 企业信息页面点击获取企业id
      return this.$store.state.psInfo.id || JSON.parse(window.sessionStorage.getItem('psInfo')).id;
    },
    userType() {
      return this.$store.getters['auth/userType'];
    },
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    isEmptyObj(obj) { // 判断对象是否为空
      return Object.keys(obj).length === 0;
    },
    getDictList() { // 获取字典表数据
      // 页面无需字典表时不执行
      if (this.isEmptyObj(this.dict)) { return; }
      const dictList = Object.keys(this.dict);
      // 循环请求字典表
      dictList.forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => { this.dict[key] = val; });
      }));
    },
    getItemList(psId) { // 获取数据列表
      const { rows, page } = this.pager;
      this.$http.get('bas/pSPictureInfo', {
        params: {
          rows,
          page,
          psId: psId || this.psId,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    onClickSee(row) {
      if (!this.loadingSee) {
        this.loadingSee = true;
        this.objectId = row.id;
        this.$http.get(`res/document/objectId/${this.objectId || row.id}`).then((response) => {
          if (response.data.data.length !== 0) {
            this.imageUrl = response.data.data[0].base64Content;
            this.imgTitle = row.title;
            this.$refs.imgDialog.openDialog();
          } else {
            this.$message.warning({
              message: '暂无图片，请先上传！',
              duration: 3000,
              showClose: true,
            });
          }
        }).finally(() => {
          this.loadingSee = false;
        });
      }
    },
    onClickAdd() { // 点击新增
      this.$nextTick(() => {
        this.$refs.upload.getImg();
      });
      this.beforeOpen();
    },
    onClickEdit(row) { // 点击编辑
      this.objectId = row.id;
      this.getOneItem(row.id);
      this.$nextTick(() => {
        this.$refs.upload.getImg(row.id);
      });
      this.beforeOpen();
    },
    onSaveCheck(callback) { // 保存记录
      // 表单是否需要验证
      if (this.isEmptyObj(this.rules)) {
        this.onSaveItem(callback);
        return;
      }
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
        // if (this.objectId) {
        //   const uploadRes = await this.$refs.upload.onUpload();
        // }
      });
    },
    onSaveItem() { // 发送保存记录请求
      this.saveLoading = false;
      if (this.objectId) {
        this.$http.all([
          this.SAVE_ITEM(),
          this.$refs.upload.onUpload(this.objectId),
        ]).then(this.$http.spread((saveRes, uploadRes) => {
          // uploadRes.data.code === 200
          //   && uploadRes.data.success
          //   &&
          if (saveRes.data.code === 200
            && saveRes.data.success) {
            // 关闭弹框
            this.beforeClose();
            // 查询数据
            this.getItemList();
          } else {
            this.$message.warning({
              message: `${uploadRes.data.code === 200 ? '' : uploadRes.data.msg}
                ${saveRes.data.code === 200 ? '' : saveRes.data.msg}`,
              duration: 3000,
              showClose: true,
            });
          }
          this.saveLoading = false;
        }, ({ response }) => {
          this.saveLoading = false;
          analyzeResp(response);
        }));
      } else {
        this.SAVE_ITEM().then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            if (!this.objectId) { // id不存在，先新增后上传
              this.objectId = response.data.data.id;
              this.$refs.upload.onUpload(response.data.data.id).then((res) => {
                if (res.data.code === 200 && res.data.success) {
                  // 关闭弹框
                  this.beforeClose();
                  // 查询数据
                  this.getItemList();
                } else {
                  this.$message.warning({
                    message: res.data.message,
                    duration: 3000,
                    showClose: true,
                  });
                }
              }, ({ res }) => {
                analyzeResp(res);
              }).finally(() => {
                this.saveLoading = false;
              });
            }
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        });
      }
    },
    onDeleteItem() { // 点击删除
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.delete('bas/pSPictureInfo/', { data: this.selectedIds }).then((response) => {
          if (response.data.success) {
            this.$message.success({
              message: '删除成功',
              duration: 3000,
              showClose: true,
            });
            this.getItemList();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
            });
          }
        }, (response) => {
          analyzeResp(response);
        });
      });
    },
    getOneItem(id) { // 获取单条数据
      return new Promise((resolve) => {
        this.$http.get(`bas/pSPictureInfo/${id}`).then((response) => {
          if (response.data.success) {
            this.itemForm = response.data.data;
            resolve(response);
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, (response) => {
          analyzeResp(response);
        });
      });
    },
    SAVE_ITEM() {
      return this.$http[this.objectId ? 'put' : 'post']('bas/pSPictureInfo/', {
        ...this.itemForm,
        psId: this.psId,
      });
    },
    beforeOpen() {
      this.getDictList();
      this.$refs.dialog.openDialog();
    },
    beforeClose() { // 关闭弹窗前回调
      this.objectId = '';
      this.itemForm = {};
      this.$refs.upload.clearFiles();
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
