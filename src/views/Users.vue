<template>
  <div>
    <statisticGroup :items="itemsStats" />
    <b-card title="Users">
      <b-table responsive :fields="fields" :items="items" sort-by="username" />
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
        {
          icon: 'PowerIcon',
          color: 'light-primary',
          title: 0,
          subtitle: 'Users Suspended'
        }
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
        this.itemsStats[1].title++
      } else item.suspended = '';
    });
  },
  components: {
    statisticGroup,
  },
}; 
</script>

<style></style>
