<template>
  <TrainingContentsBlock>
    <template #headline>Тесты</template>
    <template #default>
      <div class="training-tests-list">
        <LabelListItem
          :to="getTestLink(test)"
          v-for="test in tests"
          :key="test.id"
        >
          <template #text>{{ test.name }}</template>
          <template #label v-if="test.status">
            <AppLabel :collorClass="getLabelClass(test.status)">{{
              getLabelText(test.status)
            }}</AppLabel>
          </template>
        </LabelListItem>
      </div>
    </template>
  </TrainingContentsBlock>
</template>

<script>
import { getLinkToTest } from "@utils";

import LabelListItem from "@UI/LabelListItem.vue";
import AppLabel from "@UI/labels/AppLabel.vue";

import TrainingContentsBlock from "./TrainingContentsBlock.vue";

export default {
  name: "TrainingContentsTests",

  components: { LabelListItem, AppLabel, TrainingContentsBlock },

  props: {
    tests: {
      type: Array,
      default: () => null,
    },
    courseId: {
      type: [String, Number],
      default: null,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    getLabelText(status) {
      return status === "failed" ? "Тест не пройден" : "Тест пройден";
    },
    getLabelClass(status) {
      return status === "failed" ? "red700" : "chat-primary";
    },
    getTestLink(test) {
      return getLinkToTest(test.id, this.courseId);
    },
  },

  watch: {},

  mounted() {},

  created() {},
};
</script>

<style scoped lang="scss"></style>