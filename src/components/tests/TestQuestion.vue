<template>
  <div
    class="test-question"
    :class="{
      'test-question--is-complited': isComplited,
      'test-question--right': question.status && question.status === 'right',
      'test-question--wrong': question.status && question.status === 'wrong',
    }"
  >
    <div class="test-question__question">
      <div class="test-question__question-text">
        <span class="test-question__question-text-number"
          >{{ questionNumber }}.
        </span>
        <div
          class="test-question__question-text-inner"
          v-html="question.questionText"
        ></div>
      </div>

      <SimplePicture
        class="test-question__question-picture"
        v-if="question.image"
        :src="question.image"
        :alt="question.questionText"
      />
    </div>

    <template v-if="!isComplited">
      <GroupCheckbox
        class="test-question__answer"
        v-if="question.type === 'checkbox'"
        :name="question.id"
        :checkboxList="question.answers"
        :required="true"
        @emitData="getData"
      />

      <RadioButton
        class="test-question__answer"
        v-else-if="question.type === 'radiobutton'"
        :name="question.id"
        :radioList="question.answers"
        :defaultValue="question.defaultValue"
        :required="true"
        @emitData="getData"
      />

      <SortSelect
        class="test-question__answer"
        v-else-if="question.type === 'sorting'"
        :name="question.id"
        :selectList="question.answers"
        :required="true"
        :showErrors="false"
        @emitData="getData"
      />
    </template>

    <RightAnswers
      class="test-question__answer"
      :answersList="question.answers"
      v-else
    />
  </div>
</template>

<script>
import SimplePicture from "@/components/UI/SimplePicture.vue";
import GroupCheckbox from "@/components/tests/GroupCheckbox.vue";
import RadioButton from "@/components/tests/RadioButton.vue";
import SortSelect from "@/components/tests/SortSelect.vue";
import RightAnswers from "@/components/tests/RightAnswers.vue";

export default {
  name: "TestQuestion",

  components: {
    SimplePicture,
    GroupCheckbox,
    RadioButton,
    SortSelect,
    RightAnswers,
  },

  props: {
    questionNumber: {
      type: Number,
      required: true,
    },

    question: {
      type: Object,
      required: true,
    },

    isComplited: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    getData(answer) {
      answer.questionId = this.question.id;
      if (!answer.value) {
        answer.value = [];
      } else if (
        typeof answer.value === "string" ||
        typeof answer.value === "number"
      ) {
        const val = answer.value;
        answer.value = [];
        answer.value.push(val);
      }
      this.$emit("emitData", answer);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.test-question {
  padding-left: var(--v-rhythm-8);

  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-6);

  &--is-complited {
    padding: var(--v-rhythm-4) var(--v-rhythm-8);
    border-radius: 8px;
  }

  &--right {
    border: 2px solid var(--chatPrimary);
  }

  &--wrong {
    border: 2px solid var(--red900);
  }

  &__question {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);
  }

  &__question-text {
    display: flex;
  }

  &__question-text-number {
    margin-right: var(--v-rhythm-1);

    @extend .subtitle-1;
    color: var(--gray900);
  }

  &__question-text-inner {
    @extend .v-html;
  }

  &__question-picture {
    width: 100%;
    max-width: 100%;
  }

  &__answer {
  }

  @include phones {
    &--is-complited {
      padding: var(--v-rhythm-2) var(--v-rhythm-2);
    }
  }
}
</style>