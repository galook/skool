<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <b-card title="Add Transaction">
        <qform
          :form="transactionData"
          @submit="submitTransaction()"
          required
        ></qform>
      </b-card>
      <b-card title="Add Payment">
        <qform :form="paymentForm" @submit="submitPay()" required></qform>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transactionData: {
        amount: {
          placeholder: 'Desired amount',
          append: 'CZK',
          type: 'number',
          data: '',
        },
        counterparty: {
          placeholder: 'Payment Entity',
          list: [],
          data: '',
        },
        description: {
          placeholder: 'Detailed text',
          type: 'textarea',
          data: '',
        },
        collective: {
          states: ['Yes', 'No'],
          type: 'switch',
          data: false,
        },
        direction: {
          states: ['Inward', 'Outward'],
          type: 'switch',
          data: false,
        },
        id: {
          label: 'Transaction ID',
          data: Math.floor(Math.random() * 10e9).toString(32),
        },
      },
      paymentForm: {
        amount: {
          placeholder: 'Desired amount',
          type: 'number',
          append: 'CZK',
          data: '',
        },
        user: {
          placeholder: 'User empowered to this payment',
          list: [],
          data: '',
        },
        description: {
          placeholder: 'Detailed text',
          type: 'textarea',
          data: '',
        },
        cumulateInterest: {
          label: 'Cumulate Interest',
          states: ['Yes', 'No'],
          type: 'switch',
          data: true,
        },
        due: {
          label: 'Date Due',  
          type: 'date',
          data: new Date(),
        },
      },
    };
  },
  async mounted() {
    let users = await this.quviauser.getAllUsers();
    console.log(users);
    this.transactionData.counterparty.list = users  
      .map((a) => a.username)
      .sort();
  },

  methods: {
    async submitTransaction() {
      let req;
      try {
        req = await this.quviauser.addTransaction(
          this.transactionData.amount.data,
          this.transactionData.collective.data,
          this.transactionData.counterparty.data,
          this.transactionData.description.data,
          this.transactionData.direction.data ? 'in' : 'out',
          this.transactionData.id.data
        );
      } catch (error) {
        this.$swal('Error Submitting', error.message);
      } finally {
        this.$swal('Success', req);
      }
    },
    async submitPay() {
      let req;
      try {
        req = await this.quviauser.addPayment(
          this.paymentForm.amount.data,
          this.paymentForm.user.data,
          this.paymentForm.description.data,
          this.paymentForm.cumulateInterest.data,
          Date.parse(this.paymentForm.due.data)
        );
      } catch (error) {
        this.$swal('Error Submitting', error.message);
      } finally {
        this.$swal('Success', req);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
