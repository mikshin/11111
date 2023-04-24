<template>
  <form class="app-search" @submit.prevent="sendSearchRequest">
    <div class="app-search__search-line">
      <user-icons class="app-search__search-line-icon" :iconName="'search'" />
      <input
        class="app-search__search-line-input"
        ref="inputSearch"
        type="search"
        placeholder="Поиск по контенту"
        v-model="searchQuery"
        v-focus
      />
    </div>
    <button
      class="app-search__btn primary-btn"
      type="submit"
      :disabled="searchQuery.length < 3 || searchQuery === userSearchQuery"
    >
      <span>Найти</span> <user-icons :iconName="'search'" />
    </button>
  </form>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "AppSearch",

  components: {},

  data() {
    return {
      searchQuery: "",
    };
  },

  computed: mapGetters(["userSearchQuery"]),

  watch: {
    userSearchQuery() {
      this.searchQuery = this.userSearchQuery;
      this.$refs.inputSearch.focus();
    },
  },

  methods: {
    sendSearchRequest() {
      this.updateUserSearchQuery(this.searchQuery);

      if (!this.searchQuery) this.$refs.inputSearch.focus();
    },

    ...mapMutations(["updateUserSearchQuery"]),
  },

  mounted() {
    this.searchQuery = this.userSearchQuery;
  },
};
</script>

<style scoped lang="scss">
.app-search {
  position: relative;

  display: flex;
  align-items: center;
  gap: var(--v-rhythm-8);
  padding: var(--v-rhythm-2) 0;

  &::before {
    content: "";

    position: absolute;
    left: 0;
    bottom: 0;

    width: 100%;
    height: 2px;

    background-color: var(--gray300);
  }

  &__search-line {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-3);
  }

  &__search-line-icon {
    width: 24px;
    height: 24px;

    flex-shrink: 0;

    fill: var(--gray700);
  }

  &__search-line-input {
    width: 100%;

    @extend .body-2;
    color: var(--gray900);

    border: none;
    background-color: unset;

    &::placeholder {
      color: var(--gray500);
    }
  }

  &__btn {
  }
}
</style>
