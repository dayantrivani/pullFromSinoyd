<template>
  <div v-if="$config.layout.drawUse" class="btn item-helper">
    <button
      title="助手"
      :class="{ 'btn': 1, 'is-opened': visibleDrawer }"
      @click="open()">
      <icon name="icon-ellipsis" size="1.2em" />
    </button>
    <!-- <a-drawer
      title="小助手"
      placement="right"
      wrapClassName="pupop-helper"
      :closable="false"
      @close="close()"
      :visible="visibleDrawer">
      <p>不要温顺地走进那个良夜，</p><br/>
      <p>激情不能被消沉的暮色退缩，</p><br/>
      <p>咆哮吧咆哮，痛斥那光的退缩。</p><br/>
      <p>智者在临终的时候对黑暗妥协，</p><br/>
      <p>是因为他们的语言已黯然失色</p><br/>
      <p>他们也不想被夜色迷惑，</p><br/>
      <p>咆哮吧，咆哮，痛斥那光的退缩。</p>
    </a-drawer> -->
  </div>
</template>

<script>

export default {
  name: 'ItemDrawer',
  inject: ['app'],
  data() {
    return {
      visibleDrawer: false,
    };
  },
  methods: {
    open() {
      this.visibleDrawer = true;
    },
    close() {
      this.visibleDrawer = false;
    },
  },
};
</script>
