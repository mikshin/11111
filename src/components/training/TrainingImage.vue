<template>
  <LabelImage class="training-image" :src="image">
    <template #default v-if="labels">
      <div class="training-image__labels">
        <AppLabel
          v-for="(label, index) in labels"
          :key="index"
          :collorClass="label.collorClass"
          >{{ label.text }}</AppLabel
        >
      </div>
    </template>
  </LabelImage>
</template>

<script>
import LabelImage from "@UI/LabelImage.vue";
import AppLabel from "@UI/labels/AppLabel.vue";

import { generateLablesForCourse } from "@utils";

export default {
  name: "TrainingImage",

  components: {
    LabelImage,
    AppLabel,
  },

  props: {
    src: {
      type: String,
      required: false,
      default: "",
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    isNewEmployee: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: null,
    },
  },

  data() {
    return {};
  },

  computed: {
    labels() {
      return generateLablesForCourse(
        this.isDraft,
        this.isNewEmployee,
        this.status
      );
    },
    image() {
      return this.src || "/img/training/plug-image-course.jpg";
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.training-image {
  width: 100%;
  aspect-ratio: 672 / 480;

  &__labels {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-rhythm-2);
  }
}
</style>