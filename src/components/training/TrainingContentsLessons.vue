<template>
  <TrainingContentsBlock class="training-lesson-contents-lessons">
    <template #headline>Содержание</template>
    <template #default>
      <div class="training-lesson-contents-lessons__list">
        <LabelListItem
          v-for="lesson in contents"
          :key="lesson.id"
          :to="getContentsLink(lesson)"
          :append="true"
        >
          <template #text>
            {{ lesson.name }}
            <template v-if="lesson.childCount"
              >({{ lesson.childCount }})</template
            >
          </template>
        </LabelListItem>
      </div>
    </template></TrainingContentsBlock
  >
</template>

<script>
import { getLinkForLesson } from "@utils";

import LabelListItem from "@UI/LabelListItem.vue";

import TrainingContentsBlock from "./TrainingContentsBlock.vue";

export default {
  name: "TrainingContentsLessons",

  components: { LabelListItem, TrainingContentsBlock },

  props: {
    contents: {
      type: Array,
      default: () => null,
    },
  },

  data() {
    return {
      items: null,
    };
  },

  computed: {},

  methods: {
    getContentsLink(lesson) {
      return getLinkForLesson(lesson.id);
    },
  },

  watch: {},

  mounted() {},

  created() {},
};
</script>

<style scoped lang="scss">
</style>