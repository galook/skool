<template>
  <div>
    <vs-table :data="transactions">
      <template slot="header">
        <h3>Platby</h3>
      </template>
      <template slot="thead">
        <vs-th> Stav </vs-th>
        <vs-th> Protistrana </vs-th>
        <vs-th> Popis </vs-th>
        <vs-th> Úročení </vs-th>
        <vs-th> Hodnota </vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr :key="i" v-for="(tr, i) in data">
          <vs-td
            :data="data[i].toPay"
            :style="`color: ${
              data[i].toPay ? 'darkred' : 'green'
            }; font-weight: ${data[i].toPay ? 'bold' : 'normal'};`"
          >
            {{ data[i].toPay ? "Čeká na platbu" : "Zaplaceno" }}
          </vs-td>

          <vs-td :data="data[i].user">
            {{ data[i].user }}
          </vs-td>

          <vs-td :data="data[i].description">
            {{ data[i].description }}
          </vs-td>

          <vs-td :data="data[i].cumulateInterest">
            {{ data[i].cumulateInterest ? "Ano" : "Ne" }}
          </vs-td>

          <vs-td :data="data[i].amount">
            <b> {{ data[i].amount }}  </b> {{ getKus(data[i].amount) }}
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      transactions: [],
      fundBalance: 0,
      autoRetrieve: false,
    };
  },
  methods: {
    async contactNet() {
      this.alert.fire({
        title: "Starting...",
        text: "Contacting quvia-net",
        icon: "info",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      try {
        this.transactions = await user.getPayments();
      } catch (e) {
        this.alert.fire({
          title: "Error",
          text: `Server did not send correct data: ${e.message}`,
          icon: "error",
          toast: true,
          position: "bottom-end",
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
      this.alert.fire({
        title: "Retreived",
        text: "The data was received from the server",
        icon: "success",
        grow: true,
        toast: true,
        position: "bottom-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    },
    getKus(amount) {
      return amount % 1 == 0
        ? amount < 1 || amount >= 5
          ? "korun"
          : amount < 2
          ? "koruna"
          : "koruny"
        : "korun";
    },
  },
  mounted() {
    this.contactNet();
  },
  watch: {
    autoRetrieve(newValue, oldValue) {
      window.localStorage.setItem("fund.autoRetrieve", newValue);
      if (newValue) {
        this.contactNet();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.largeText {
  font-size: 2em;
}
</style>