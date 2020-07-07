<template>
  <select-icon v-model="iconModel" />
</template>

<script>
// 引入图标选择器组件
import SelectIcon from '@/components/SelectIcon';

export default {
  components: {
    SelectIcon,
  },
  data() {
    return {
      // 绑定值
      iconModel: '',
    };
  },
};
</script>
