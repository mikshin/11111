<template>
  <form class="simple-search" @submit.prevent="sendSearchRequest">
    <SimpleInput
      class="simple-search__input"
      :type="'search'"
      :placeholder="'Поиск'"
      v-model="searchQuery"
      @changeValue="changeValue"
    />
    <User-icons class="simple-search__icon" :iconName="'search'" />
  </form>
</template>

<script>
import SimpleInput from "@/components/UI/inputs/SimpleInput.vue";

export default {
  name: "SimpleSearch",

  components: {
    SimpleInput,
  },

  data() {
    return {
      searchQuery: "",
    };
  },

  computed: {},

  methods: {
    changeValue(value) {
      this.searchQuery = value;
    },

    sendSearchRequest() {
      this.searchQuery
        ? this.$emit("sendSearchRequest", this.searchQuery)
        : null;
    },
  },
};
</script>

<style scoped lang="scss">
.simple-search {
  position: relative;

  width: 100%;

  &__input {
    width: 100%;
    padding-right: var(--v-rhythm-10);
  }

  &__icon {
    position: absolute;
    top: 50%;
    right: var(--v-rhythm-4);
    transform: translateY(-50%);

    width: 24px;
    height: 24px;

    fill: var(--gray500);
  }
}
</style>
