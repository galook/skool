<template>
  <div>
    <h1>Financial Administration</h1>
    <br /><br />
    <vs-row>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
        <statistics-card-line
          icon="BriefcaseIcon"
          icon-right
          :statistic="fundBalance + ' CZK'"
          statisticTitle="Fund Balance"
          class="statSmall"
        />
      </vs-col>
      <vs-col
        vs-type="flex"
        vs-offset=""
        vs-justify="center"
        vs-align="center"
        vs-w="6"
      >
        <statistics-card-line
          icon="HashIcon"
          icon-right
          :statistic="transactions.length"
          statisticTitle="Total Transactions"
          class="statSmall"
        />
      </vs-col>
    </vs-row>

    <br /><br /><br />
    <vx-card title="Add Transaction" class="max-w-md mx-auto space-x-5 ">
      <div class="space-y-10">
        <vs-input-number v-model="amount" class="h-16 vsinp" label="CZK" />
        <vs-switch v-model="collective" class=" w-32">
          <span class="w-16" slot="on">Kolektivní</span>
          <span slot="off">Individuální</span>
        </vs-switch>
             <vs-switch v-model="direction" class=" w-32">
          <span class="w-16" slot="on">Příchozí</span>
          <span slot="off">Odchozí</span>
        </vs-switch>
        <vs-input label-placeholder="Protistrana" v-model="counterparty" />

        <vx-input-group class="">
          <template slot="prepend">
            <div class="prepend-text bg-primary">
              <span>Popis</span>
            </div>
          </template>

          <vs-textarea v-model="popis" />
        </vx-input-group>
              <vs-button color="primary" @click="addTransaction()" type="border">Založit transakci</vs-button>

      </div>

    </vx-card>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
import VxCard from "../components/vx-card/VxCard.vue";

export default {
  data() {
    return {
      fundBalance: 0,
      transactions: [],
      amount: 0,
      popis: "",
      collective: false,
      counterparty: "",
      direction: 0
    };
  },
  methods: {
    async addTransaction() {
      try {
        let result = await user.addTransaction(this.amount, this.collective, this.counterparty, this.popis, this.direction ? 'in' : 'out', ' ')
        if (result) {
          this.alert.fire({
            title: 'Transaction Added',
            html: 'Your query is finished',
            toast: true
          })
        }
      } catch (e) {
        this.alert.fire('Error when contacting the Server', e.message, 'error')
      }
    }
  },
  components: {
    StatisticsCardLine,
    VxCard,
  },
  async mounted() {
    try {
      this.fundBalance = await user.getBalance();
      this.transactions = await user.getAllTransactions();
    } catch (e) {
      this.alert.fire("Error getting data from server", e.message, "error");
    }
  },
};
</script>

<style lang="scss">
.statSmall {
  height: 60%;
  width: 90%;
  transition: height 2s, width 2s;
}
.vsinp {
}
</style>