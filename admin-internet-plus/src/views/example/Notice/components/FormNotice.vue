<template>
  <div class="fill">
    <div class="pad-b-scope fn-flex">
      <el-button type="text" class="mar-r-sm" @click="$emit('back')">
        <icon name="arrow-left" />
        <span>返回列表</span>
      </el-button>
      <el-input
        v-if="edit"
        v-model="itemModel.title"
        show-word-limit
        maxlength="100"
        size="medium"
        placeholder="公告标题"
      ></el-input>
      <div v-else class="flex-1">{{ title }}</div>
      <el-button
        type="primary"
        class="mar-l-sm"
        :loading="loading"
        @click="onSave"
      >{{ `${row.id ? '更新' : '发布'}公告` }}
      </el-button>
    </div>
    <div style="height: calc(100% - 44px)">
      <md-editor v-model="itemModel.content" :toolbars-flag="edit" :subfield="edit" />
    </div>
  </div>
</template>

<script>
import MdEditor from '@/components/Markdown';

import { emptyForm, saveNotice } from '../request';

export default {
  components: {
    MdEditor,
  },
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      itemModel: emptyForm(),
    };
  },
  created() {
    const { title, content } = this.row;
    this.itemModel = emptyForm({ title, content });
  },
  methods: {
    onSave() {
      this.loading = true;
      saveNotice(this.itemModel)
        .then((response) => {
          const { success, msg } = response.data;
          if (success) {
            this.$emit('query');
          } else {
            this.$message.warning(msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
