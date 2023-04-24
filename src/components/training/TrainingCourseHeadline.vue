<template>
  <TrainingHeadline :isGrayText="isGrayHeadlineText">
    <template #default>{{ headline }}</template>
    <template #after-text v-if="isShowLessonButton">
      <TrainingLessonButtonLink
        :isBookmark="hasBookmark"
        :link="lessonBookmarkLink"
        @click.native="buttonClickHandler"
        :class="{
          loading: isLoading,
        }"
      ></TrainingLessonButtonLink>
    </template>
  </TrainingHeadline>
</template>

<script>
import TrainingHeadline from "./TrainingHeadline.vue";
import TrainingLessonButtonLink from "./TrainingLessonButtonLink.vue";

export default {
  name: "TrainingCourseHeadline",

  components: { TrainingHeadline, TrainingLessonButtonLink },

  props: {
    headline: {
      type: String,
      default: "",
    },
    isGrayHeadlineText: {
      type: Boolean,
      default: false,
    },
    isShowLessonButton: {
      type: Boolean,
      default: false,
    },
    hasBookmark: {
      type: Boolean,
      default: false,
    },
    lessonBookmarkLink: {
      type: String,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    buttonClickHandler() {
      this.$emit("navigate-button-clicked");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>