<template>
  <div class="training-lesson-contents-block">
    <div class="training-lesson-contents-block__headline">
      <slot name="headline"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TrainingContentsBlock",

  components: {},

  props: {},

  data() {
    return {};
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},

  created() {},
};
</script>

<style scoped lang="scss">
.training-lesson-contents-block {
  &__headline {
    padding-top: var(--v-rhythm-2);
    margin-bottom: var(--v-rhythm-4);

    color: var(--gray500);
    @extend .caption-2;

    border-top: 1px solid var(--gray300);
  }
}
</style>