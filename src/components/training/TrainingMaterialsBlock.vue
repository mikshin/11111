<template>
  <div class="training-materials-block">
    <div class="training-materials-block__headline">{{ headline }}</div>
    <div class="training-materials-block__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrainingMaterialsBlock",

  components: {},

  props: {
    headline: {
      type: String,
      required: false,
      default: "",
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
.training-materials-block {
  &__headline {
    margin-bottom: var(--v-rhythm-2);

    @extend .subtitle-2;
  }
}
</style>