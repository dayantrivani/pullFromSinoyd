<template>
<!-- 集成页 各个系统组件 -->
  <div class="control-item">
    <ul>
      <li v-for="(item, index) in itemList.data" :key="index">
        <p class="hover-link">
          <label @click="onItemClick">{{item.text}}</label>
          <span @click="onItemClick" v-show="itemList.isShowValue">{{item.value}}<span class="unit">{{item.unit}}</span></span>
        </p>
      </li>
    </ul>
    <div class="item-bg hover-link">
      <img style="width: 100%" type="bg" src="../../../../assets/wholeprocessImage/controlItemBg.png" @click="onItemClick"/>
      <div class="bg-top-icon" :class="`icon-index${index}`" @click="onItemClick"></div>
      <img style="width: 50%" :src="imgList[index - 1]" @click="onItemClick"/>
    </div>
  </div>
</template>

<script>
import controlName1 from '@/assets/wholeprocessImage/controlName1.png';
import controlName2 from '@/assets/wholeprocessImage/controlName2.png';
import controlName3 from '@/assets/wholeprocessImage/controlName3.png';
import controlName4 from '@/assets/wholeprocessImage/controlName4.png';
import controlName5 from '@/assets/wholeprocessImage/controlName5.png';

export default {
  name: 'controlItem',
  props: {
    index: {
      default: 0,
    },
    itemList: {
      default: {
        isShowValue: true,
        data: [],
      },
    },
  },
  data() {
    return {
      imgList: [
        controlName1,
        controlName2,
        controlName3,
        controlName4,
        controlName5,
      ],
    };
  },
  methods: {
    onItemClick() {
      this.$emit('click');
    },
  },
};
</script>
