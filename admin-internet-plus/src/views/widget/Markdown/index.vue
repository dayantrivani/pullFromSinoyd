<!-- 组件 / Markdown 编辑器 -->

<template>
  <container fill>
    <md-editor toolbars-flag v-model="itemModel" />
  </container>
</template>

<script>
import MdEditor from '@/components/Markdown';

export default {
  name: 'Markdown',
  components: {
    MdEditor,
  },
  data() {
    return {
      itemModel: '## 《无问西东》\n你看到什么，听到什么，做什么，和谁在一起，有一种心灵深处满溢出来的不懊悔，也不羞耻的平和与喜悦。\n\n## 《燃情岁月》\n有些人能清楚地听到自己内心深处的声音，并以此行事。这些人要么变成了疯子，要么成为传奇。',
    };
  },
};
</script>
