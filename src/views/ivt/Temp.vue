<template>
<vx-card class="centerx">
    <vs-input-number v-model="temp" label="Teplota:" />
    <vs-select class="selectExample" label="Figuras" v-model="select1">
      <vs-select-item
        :key="i"
        :value="item.value"
        :text="item.text"
        v-for="(item, i) in options1"
      />
    </vs-select>
</vx-card>
</template>

<script>
export default {
  data() {
    return {
      temp: 20,
      options1: [
        {
          text: "Celsius",
          value: 0,
        },
        {
          text: "Fahrenheit",
          value: 1,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.center {
    text-align: center;
    align-content: center;
    align-items: center;
    align-self: center;
}
</style>
