<template>
  <div id="app">
    <div class="container"></div>
  </div>
</template>

<script>
// import api from './server/api';
export default {
  data()
  {
    return { Ads: [], Ad: null };
  },
  methods: {
  },
  mounted()
  {
    // console.log(api);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 20%;
}
</style>
