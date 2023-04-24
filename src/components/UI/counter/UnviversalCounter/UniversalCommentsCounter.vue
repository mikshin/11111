<template>
  <router-link class="comments-counter" :to="urlPath">
    <app-counter
      class="comments-counter__inner"
      :counterIcon="'comment'"
      :counterNumber="counter"
    ></app-counter>
  </router-link>
</template>

<script>
import AppCounter from "@/components/UI/counter/AppCounter.vue";
export default {
  name: "UniversalCommentsCounter",

  components: { AppCounter },

  props: {
    counter: {
      type: Number,
      required: true,
    },
    endpoint: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    urlPath() {
      return `${this.endpoint.routerLink}/${this.endpoint.params.groupNewsId}#comments`;
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>