<template>
  <div class="app-conventions">
    <span class="app-conventions__title" v-if="title">{{ title }}</span>
    <ul class="app-conventions__list">
      <li
        class="app-conventions__item"
        v-for="(item, i) in conventionsList"
        :key="i"
      >
        <AppConvention
          class="app-conventions__app-convention"
          :color="item.color"
          :title="item.title"
          :description="item.description"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import AppConvention from "@/components/conventions/AppConvention.vue";

export default {
  name: "AppConventions",

  components: {
    AppConvention,
  },

  props: {
    title: {
      type: String,
      required: false,
      default: "",
    },
    conventionsList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.app-conventions {
  &__title {
    display: block;
    margin-bottom: var(--v-rhythm-4);

    @extend .subtitle-2;
    color: var(--gray900);
  }

  &__list {
    padding-left: var(--v-rhythm-4);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__item {
  }

  &__app-convention {
  }
}
</style>