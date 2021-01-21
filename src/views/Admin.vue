<template>
  <div>
    <h2>Administrative Tools</h2>
    <br /><br />
    <vs-row>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
        <statistics-card-line
          icon="UsersIcon"
          icon-right
          :statistic="users.length"
          statisticTitle="Registered Users"
          class="statSmall"
        />
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";

export default {
  data() {
    return {
      users: "value",
    };
  },
  methods: {
    async getUsers() {
      try {
        this.users = await user.getAllUsers();
      } catch (e) {
        this.alert.fire(
          "Server Error",
          "Could not retrieve data from quvia-net: " + e.message,
          "error"
        );
      }
    },
  },
  mounted() {
    this.getUsers();
  },
  components: {
    StatisticsCardLine,
  },
};
</script>

<style lang="scss" scoped>
.statSmall {
  height: 60%;
}
</style>