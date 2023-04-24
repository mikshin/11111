<template>
  <transition-group name="fade" class="manager-answer-to-me">
    <QuestionAnswerMain
      class="manager-answer-to-me__main"
      v-if="!formIsVisible && text"
      :key="'main'"
      :text="text"
      :files="files"
      :rights="rights.filter((item) => item !== 'add')"
      @onEdit="formIsVisible = true"
    />

    <QuestionAnswerFooter
      class="manager-answer-to-me__footer"
      v-if="date && !formIsVisible"
      :key="'footer'"
      :date="date"
    />

    <div
      class="manager-answer-to-me__text-default"
      v-if="!formIsVisible && !text"
      :key="'text-default'"
    >
      <span>Требует ответа</span>

      <UserIcons
        class="manager-answer-to-me__text-default-icon"
        :iconName="'attention'"
      />
    </div>

    <button
      class="manager-answer-to-me__btn-add primary-btn"
      v-if="!formIsVisible && !hasAnswer"
      :key="'btn-add'"
      @click="formIsVisible = true"
    >
      Ответить
    </button>

    <ManagerAnswerForm
      class="manager-answer-to-me__form"
      v-if="formIsVisible"
      :key="'form'"
      :answerId="answerId"
      :questionId="questionId"
      :defaultText="text"
      :defaultFiles="files"
      @answerReset="closeForm"
      @answerUpdate="answerUpdate"
    />
  </transition-group>
</template>

<script>
import QuestionAnswerMain from "@/components/manager-question/question-answer/QuestionAnswerMain.vue";
import QuestionAnswerFooter from "@/components/manager-question/question-answer/QuestionAnswerFooter.vue";
import ManagerAnswerForm from "@/components/manager-question/manager-answer/ManagerAnswerForm.vue";

export default {
  name: "ManagerAnswerToMe",

  components: {
    QuestionAnswerMain,
    QuestionAnswerFooter,
    ManagerAnswerForm,
  },

  props: {
    answerId: {
      type: String,
      required: true,
    },

    questionId: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    files: {
      type: Array,
      required: true,
    },

    rights: {
      type: Array,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      formIsVisible: false,
    };
  },

  computed: {
    hasAnswer() {
      return this.text || this.filse ? true : false;
    },
  },

  methods: {
    closeForm() {
      this.formIsVisible = false;
    },

    answerUpdate() {
      this.closeForm();
      this.$emit("answerUpdate");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.manager-answer-to-me {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-8);

  &__main {
  }

  &__footer {
  }

  &__text-default {
    display: flex;
    gap: var(--v-rhythm-2);
    align-items: center;

    @extend .body-2;
    color: var(--gray900);
  }

  &__text-default-icon {
    width: 20px;
    height: 20px;

    fill: var(--red900);
  }

  &__btn-add {
    align-self: flex-start;
  }

  &__form {
  }
}
</style>