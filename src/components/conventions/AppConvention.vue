<template>
  <div class="app-convention">
    <div
      class="app-convention__label"
      :style="{
        'background-color': color,
      }"
    ></div>
    <div class="app-convention__info">
      <span class="app-convention__title">{{ title }}</span>
      <span class="app-convention__description">{{ description }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppConvention",

  components: {},

  props: {
    color: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
.app-convention {
  display: flex;
  align-items: center;
  gap: var(--v-rhythm-6);

  &__label {
    width: 40px;
    height: 40px;
    flex-shrink: 0;

    border-radius: 6px;
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__title {
    @extend .body-1;
    color: var(--gray900);
  }

  &__description {
    @extend .caption-1;
    color: var(--gray500);
  }
}
</style>