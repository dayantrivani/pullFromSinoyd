<template>
  <!-- 辅助生产设备 -->
  <el-card type="title" class="AuxiliarProduction">
    <template slot="header">辅助生产设备信息</template>
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <el-table
      class="mar-t-xs"
      border
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="70">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="name" label="名称" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column property="type" label="类型" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column property="remark" label="描述" show-overflow-tooltip min-width="150"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList()"/>
    <dialog-modal ref="dialog" size="mini" :title="isEdit ? '编辑辅助生产设备' : '新增辅助生产设备'" @close="closeDialog">
      <el-form ref="form" label-width="60px" :model="form" class="mar-t-xs pad-x-sm item-space" :rules="rules">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="type">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="remark">
          <el-input  type="textarea" v-model="form.remark"
            maxlength="255" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="图片：">
          <el-upload
            ref="upload"
            action=""
            :http-request="onUpload"
            list-type="picture-card"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
            :auto-upload="false"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-change="fileChange"
            :before-upload="beforeUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fa fa-save" @click="save">保 存</el-button>
        <el-button icon="fa fa-times" @click="closeDialog">关 闭</el-button>
      </span>
    </dialog-modal>
  </el-card>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
// import { resolve } from 'q';

export default {
  name: 'AuxProductEquipInfo',
  mixins: [queryList, deleteItem],
  data() {
    return {
      url: 'bas/auxProductEquipInfo',
      isEdit: false, // 区别新增和编辑
      itemList: [],
      form: {
        name: '',       // 名称
        type: '',       // 类型
        remark: '',   // 描述
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' },
        ],
      },
      dialogImageUrl: '',
      dialogVisible: false,
      loading: false,
      fileList: [],
      formatData: {},
      objectId: '',
    };
  },
  computed: {
    // 记录企业列表选中当前行id
    id() {
      return this.$store.state.psInfo.id || JSON.parse(window.sessionStorage.getItem('psInfo')).id;
    },
  },
  watch: {},
  created() {},
  methods: {
    fileChange(file, fileList) {
      this.fileList = fileList;
    },
    // 上传前的钩子 格式化
    beforeUpload(file) {
      this.formatData = new FormData();  // 创建form对象
      this.formatData.append('file', file, file.name);  // file对象是 beforeUpload参数
    },
    // 上传方法
    onUpload() {
      this.$http.post(`res/document/upload?objectId=${this.objectId}`, this.formatData).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          // 关闭弹框
          this.closeDialog();
          // 查询数据
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.message,
            duration: 1500,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.avatarLoading = false;
      });
    },
    // 新增点击事件
    onClickAdd() {
      this.fileList = [];
      this.isEdit = false;
      this.$refs.dialog.openDialog();
    },
    // 表格编辑事件
    async onClickEdit(row) {
      this.isEdit = true;
      this.$refs.dialog.openDialog();
      const res = await this.getOne(row);
      this.getImg(res.data.data.id);
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, psId: this.id },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
    // 获取一条事件
    getOne(row) {
      return new Promise((resolve) => {
        this.$http.get(`bas/auxProductEquipInfo/${row.id}`)
          .then((response) => {
            if (response.data.success) {
              this.form = response.data.data;
              resolve(response);
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
      });
    },
    // 获取编辑中图片信息事件
    async getImg(id) {
      this.$http.get(`res/document/objectId/${id}`)
        .then((response) => {
          if (response.data.success) {
            if (response.data.data.length) {
              this.fileList = [];
              response.data.data.forEach((el) => {
                this.fileList.push({ id: el.id, name: el.physicalName, url: el.base64Content });
              });
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
    // 新增编辑弹框关闭事件
    closeDialog() {
      this.$refs.dialog.closeDialog();
      this.form = {
        name: '',
        type: '',
        remark: '',
      };
      // 清空图片列表
      this.fileList = [];
    },
    // 表单保存事件
    save() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        if (!this.isEdit) {
          this.$set(this.form, 'psId', this.id);
        }
        this.$http[this.isEdit ? 'put' : 'post']('bas/auxProductEquipInfo/', this.form)
          .then((response) => {
            if (response.data.code === 200 && response.data.success) {
              this.$message.success({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
              this.objectId = response.data.data.id;
              // 判断所有附件状态是否为success
              if (this.fileList.every(val => val.status === 'success') || !this.fileList.length) {
                this.closeDialog();
                this.getItemList();
              } else {
                this.$refs.upload.submit();
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
          }).finally(() => {
            this.loading = false;
          });
      });
    },
    beforeRemove(file) {
      if (file.status === 'success') {
        this.$http.delete('res/document', { data: [file.id] });
        // return this.deleteImg(file.id);
      }
    },
    handleRemove() {},
    // 编辑中附件删除
    async deleteImg(id) {
      let flag = false;
      const res = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      if (res) {
        flag = true;
        this.$http.delete('res/document', { data: [id] });
      }
      return flag;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style>

</style>
