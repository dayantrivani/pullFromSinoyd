<template>
<span></span>
</template>

<script>
export default {
  name: 'transit',
  beforeCreate() {
    // console.log(this.$route.params.name);
    this.$router.replace({ name: this.$route.params.name });
  },
};
</script>
