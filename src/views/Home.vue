<template>
  <div>
    <img src="logo.svg" alt="quvia logo" style="max-width: 10em" /> <br /><br />
    <h1>Welcome</h1>

    <br /><br /><br />
    <h3>About SKOOL by Quvia</h3>
    <p>
      We always say that projects are created, because they make your life
      easier. That they help you. <br />That's just not true. This project was
      created either to make money, or because we were bored.
    </p>
    <br /><br /><br />

    <b>Name: </b> {{ user.username }} <br />
    <b>Verification Key: </b> {{ user.verificationKey }} <br />
    <b>Status: </b> {{ user.status }} <br />
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    this.user = this.$s.user;
  },
};
</script>
