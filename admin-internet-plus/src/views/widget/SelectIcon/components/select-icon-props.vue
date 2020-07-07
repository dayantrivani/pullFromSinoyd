<template>
  <select-icon v-model="iconModel" :data="iconList" />
</template>

<script>
// 引入图标选择器组件
import SelectIcon from '@/components/SelectIcon';
// 引入图标选项数据 { title: '包装材料', icon: 'icon-baozhuangcailiao' },
import iconList from './icons';

export default {
  components: {
    SelectIcon,
  },
  data() {
    return {
      // 绑定值
      iconModel: '',
      // 图标列表数据
      iconList,
    };
  },
};
</script>
