<template>
  <div class="container">
    <header class="header">
      <div class="logo">
        <span></span>
      </div>
      <div class="top">
        <span></span>
      </div>
    </header>
    <section class="section">
      <div class="btns">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </section>
    <main class="main"></main>
  </div>
</template>

<script>
export default {
  name: 'Skeleton',
};
</script>

<style scoped>
  .container {
    height: 100%;
  }
  .header {
    height: 46px;
    width: 100%;
    background: #eee;
  }
  .logo {
    width: 200px;
    height: 100%;
    float: left;
    background: #89bef7;
    padding: 10px;
  }
  .logo span {
    width: 100%;
    height: 100%;
    display: inline-block;
    background-color: rgba(240, 240, 240, .4);
  }
  .top {
    float: right;
  }
  .section {
    float: left;
    width: 200px;
    height: calc(100% - 46px);
    background: #6b6f77;
  }
  .section .btns {
    height: 45px;
    line-height: 45px;
    text-align: center;
  }
  .section .btns span {
    display: inline-block;
    margin: 15px 10px;
    width: 26px;
    height: 26px;
    background-color: rgba(240, 240, 240, .4);
  }
  .section ul {
    padding: 0 10px;
  }
  .section li {
    display: block;
    margin-top: 10px;
    height: 30px;
    background-color: rgba(240, 240, 240, .4);
  }
  .main {
    float: right;
    width: calc(100% - 210px);
    height: calc(100% - 56px);
    margin-top: 10px;
    margin-left: 10px;
    background: #eee;
  }
</style>
