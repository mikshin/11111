<template>
  <Component
    :is="currentCompoent"
    class="training-lesson-button-link primary-btn"
    v-bind="currentAttributes"
  >
    <UserIcons
      v-if="isBookmark"
      class="training-lesson-button-link__icon"
      iconName="bookmark"
    />
    <span class="training-lesson-button-link__text">
      <template v-if="isBookmark">Перейти к закладке</template>
      <template v-else>Начать обучение</template>
    </span>
  </Component>
</template>

<script>
export default {
  name: "TrainingLessonButtonLink",

  props: {
    isBookmark: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: "",
    },
  },

  data() {
    return {};
  },

  computed: {
    currentCompoent() {
      return this.isBookmark ? "router-link" : "button";
    },
    currentAttributes() {
      return this.isBookmark
        ? {
            to: this.link,
          }
        : {
            type: "button",
          };
    },
  },
};
</script>

<style scoped lang="scss">
.training-lesson-button-link {
  &__icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;

    fill: var(--white900);
  }
}
</style>