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
  name: "CommentsCounter",

  components: { AppCounter },

  props: {
    counter: {
      type: Number,
    },
    url: {
      type: String,
      required: false,
    },
  },

  data() {
    return {};
  },

  methods: {},

  computed: {
    urlPath() {
      return `${this.url}#comments`;
    },
  },
};
</script>

<style scoped lang="scss">
.comments-counter {
  cursor: pointer;

  &:active {
    opacity: var(--active-opacity);
  }

  &__inner {
  }
}
</style>
