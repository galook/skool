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

    <br /><br /><br />
    <vs-row vs-justify="left">
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="6">
        <vs-card class="myrgin">
          <div slot="header">
            <h3>News</h3>
          </div>
          <div>
            <br />
            <h5>Moderation Pages - Work In Progress</h5>
            <br />
            <h6>
              <li>Fund Management</li>
              <li>Admin Tools</li>
            </h6>
            <br />
          </div>
          <div>
            <br />
            <h5>Fund Category Added</h5>
            <br />
            <h6>
              <li>Retrieve All Transactions from server</li>
              <li>Get the current Balance of the Fund</li>
              <li>AutoRetrieve</li>
              <li>Payments Page Added</li>
            </h6>
            <br />
          </div>
          
          <div slot="footer">
            <vs-row vs-justify="flex-end"> </vs-row>
          </div>
        </vs-card>
      </vs-col>
    </vs-row>
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
    this.user = this.storage.user;
    console.log(q);
  },
};
</script>

<style lang="scss" scoped>
.myrgin * {
  margin-top: 1%;
}
</style>

