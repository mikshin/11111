<template>
  <div class="label-image">
    <SimplePicture :src="src" class="label-image__image"></SimplePicture>
    <div class="label-image__labels" v-if="!!$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import SimplePicture from "@UI/SimplePicture.vue";

export default {
  name: "",

  components: {
    SimplePicture,
  },

  props: {
    src: {
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
.label-image {
  position: relative;

  &__image {
    width: 100%;
    height: 100%;

    object-fit: cover;
  }

  &__labels {
    position: absolute;
    top: var(--v-rhythm-4);
    left: var(--v-rhythm-4);
  }
}
</style>