<template>
  <div>
    <statisticGroup :items="itemsStats" />
    <b-card title="Users">
      hey
    </b-card>
  </div>
</template>

<script>
import statisticGroup from "./plugin/statisticGroup.vue"

export default {
  data() {
    return {
      fields: ['username', 'accessLevel', 'suspended', 'discord', 'language'],
      
    }
  },

  async mounted() {
    let user = await q.userRequest()
    this.items = await user.getAllUsers()

    

    this.items.forEach(item => { 
      item.suspended = item.suspended ? 'Yes' : ''
    })

  },
  components: {
    statisticGroup
  }
}
</script>

<style></style>
