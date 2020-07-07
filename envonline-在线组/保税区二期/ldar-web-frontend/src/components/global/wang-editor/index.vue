<template>
  <div ref="editor"></div>
</template>

<script>
import Editor from 'wangeditor';

export default {
  name: 'WangEditor',
  model: {
    prop: 'content',
    event: 'input',
  },
  props: {
    content: { required: true },
  },
  mixins: [],
  components: {},
  watch: {},
  data() {
    return {};
  },
  methods: {
  },
  mounted() {
    const editor = new Editor(this.$refs.editor);
    editor.customConfig.onchange = (html) => {
      this.$emit('input', html);
    };
    editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
    editor.create();
    editor.txt.html(this.content);
  },
};
</script>

<style lang="scss" scoped>
</style>
