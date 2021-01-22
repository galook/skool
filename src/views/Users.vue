<template>
  <div>
    <statisticGroup :items="itemsStats" />
    <b-card title="Users">
      <b-table :fields="fields" :items="items" sort-by="username" />
    </b-card>
  </div>
</template>

<script>
import statisticGroup from './plugin/statisticGroup.vue';

export default {
  data() {
    return {
      fields: ['username', 'accessLevel', 'suspended', 'discord', 'language'],
      items: [],
      itemsStats: [
        {
          icon: 'UserIcon',
          color: 'light-primary',
          title: 0,
          subtitle: 'User Count',
        },
      ],
    };
  },

  async mounted() {
    let user = await q.userRequest();
    this.items = await user.getAllUsers();
    this.itemsStats[0].title = this.items.length;
    this.items.forEach((item) => {
      if (item.suspended) {
        item.suspended = 'Yes';
        this.itemSuspendedCount++
      } else item.suspended = '';
    });
  },
  components: {
    statisticGroup,
  },
};
</script>

<style></style>
