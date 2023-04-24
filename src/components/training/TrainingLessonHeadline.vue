<template>
  <TrainingHeadline>
    <template #default>{{ headline }}</template>
    <template #after-text>
      <TrainingBookmark
        :isActive="isBookmarkActive"
        :isShowTooltip="isShowBookmarkTooltip"
        @click.native="bookmarkClickHandler"
      ></TrainingBookmark>
    </template>
  </TrainingHeadline>
</template>

<script>
import TrainingHeadline from "./TrainingHeadline.vue";
import TrainingBookmark from "./TrainingBookmark.vue";

export default {
  name: "TrainingLessonHeadline",

  components: { TrainingHeadline, TrainingBookmark },

  props: {
    headline: {
      type: String,
      default: "",
    },
    isBookmarkActive: {
      type: Boolean,
      default: false,
    },
    isShowBookmarkTooltip: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    bookmarkClickHandler() {
      this.$emit("bookmark-clicked");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>