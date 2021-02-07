<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-block d-md-inline-block mt-25">
      COPYRIGHT © {{ new Date().getFullYear() }}
      <b-link
        class="ml-25"
        href="https://1.envato.market/pixinvent_portfolio"
        target="_blank"
        >Quvia</b-link
      >
      <span class="d-none d-sm-inline-block">
        <span class="invisible"> - </span> All rights Reserved</span
      >
    </span>

    <span class="float-md-right m-auto d-none d-md-block"
      >Portal {{ $info.version }}  |  SKOOL by Quvia {{ $info.skool }}</span
    >
  </p>
</template>

<script>
import { BLink } from 'bootstrap-vue';

export default {
  components: {
    BLink,
  },
  mounted() {
    console.log(process.env);
  },
};
</script>
