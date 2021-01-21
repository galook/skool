<template>
  <div>
    <br />
    <vs-button @click="contactNet">
      Contact <b>quvia-net</b> for data retrieval
    </vs-button>
    <br />
    <br />
    <vs-checkbox v-model="autoRetrieve">AutoRetrieve</vs-checkbox>

    <br /><br /><br />
    <div class="largeText">
      <p v-if="typeof fundBalance == 'number'">
        Aktuální stav třídního konta:
        <b>{{ fundBalance + " " + getKus(fundBalance) }}</b>
      </p>
      <p v-else>Žádné informace o stavu konta</p>
    </div>
    <br /><br /><br />

    <vs-table :data="transactions">
      <template slot="header">
        <h3>Všechny Transakce</h3>
      </template>
      <template slot="thead">
        <vs-th> No. </vs-th>
        <vs-th> Směr </vs-th>
        <vs-th> Protistrana </vs-th>
        <vs-th> Popis </vs-th>
        <vs-th> Typ platby </vs-th>
        <vs-th> Hodnota </vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr :key="i" v-for="(tr, i) in data">
          <vs-td :data="i">
            {{ i + 1 }}
          </vs-td>

          <vs-td
            :data="data[i].direction"
            :style="`color: ${data[i].direction == 'in' ? 'green' : 'red'};`"
          >
            {{ data[i].direction == "in" ? "příchozí" : "odchozí" }}
          </vs-td>

          <vs-td :data="data[i].counterparty">
            {{ data[i].counterparty }}
          </vs-td>

          <vs-td :data="data[i].description">
            {{ data[i].description }}
          </vs-td>

          <vs-td :data="data[i].colectivePayment">
            {{ data[i].colectivePayment ? "Kolektivní" : "Individuální" }}
          </vs-td>

          <vs-td :data="data[i].amount">
            <b>{{ data[i].amount }}</b> {{ getKus(data[i].amount) }}
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
        this.fundBalance = await user.getBalance();
        this.transactions = await user.getAllTransactions();
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
    this.autoRetrieve =
      window.localStorage.getItem("fund.autoRetrieve") == "true";
    if (this.autoRetrieve) this.contactNet();
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