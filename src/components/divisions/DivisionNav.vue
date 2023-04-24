<template>
  <ul class="division-nav">
    <li class="division-nav__item" v-for="(item, i) in depNav" :key="i">
      <a
        :href="`#${item.name}`"
        class="division-nav__link text-btn"
        @click.prevent="goToArticle(item.name)"
        >{{ item.placeholder }}</a
      >
    </li>
  </ul>
</template>

<script>
import VueScrollTo from "vue-scrollto";

export default {
  name: "DivisionNav",

  components: {},

  props: {
    depNav: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    goToArticle(id) {
      //!TODO сделать offset переменной, зависящей от высоты шапки
      VueScrollTo.scrollTo(`#${id}`, { offset: -92 });
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.division-nav {
  display: flex;
  flex-wrap: wrap;

  &__item {
  }

  &__link {
  }

  @include phones {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--v-rhythm-2);

    &__link {
      padding: var(--v-rhythm-1) 0;
    }
  }
}
</style>