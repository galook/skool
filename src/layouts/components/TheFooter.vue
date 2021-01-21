<!-- =========================================================================================
    File Name: TheFooter.vue
    Description: Footer component
    Component Name: TheFooter
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template functional>
  <footer class="the-footer flex-wrap justify-between" :class="classes">
    <p>
      <span class="hidden sm:inline-block">Made by </span>
      <a href="quvia.cz" target="_blank" rel="nofollow"> Quvia</a>
      <span>, COPYRIGHT &copy;</span>
      <span>{{ new Date().getFullYear() }} </span>
    </p>
  </footer>
</template>

<script>
export default {
  name: "the-footer",
  props: {
    classes: {
      type: String,
    },
  },
};
</script>
