<template>
  <div class="manager-question">
    <QuestionAnswerHeader
      class="manager-question__header"
      :type="'question'"
      :person="{
        avatar: {
          alt: questionData.ANONIME
            ? 'Аноним'
            : questionData.CREATED_BY.FULL_NAME,
          src: questionData.ANONIME ? null : questionData.CREATED_BY.USER_PHOTO,
        },
        fullName: questionData.ANONIME
          ? 'Аноним'
          : questionData.CREATED_BY.FULL_NAME,
        profession: questionData.ANONIME
          ? null
          : questionData.CREATED_BY.WORK_POSITION,
        link: questionData.ANONIME ? false : true,
        id: questionData.ANONIME ? null : questionData.CREATED_BY.ID,
        vacation: questionData.ANONIME
          ? null
          : questionData.CREATED_BY.VACATION,
        fired: questionData.ANONIME ? null : questionData.CREATED_BY.FIRED,
      }"
    />

    <QuestionAnswerMain
      class="manager-question__main"
      :text="questionData.DETAIL_TEXT"
      :files="questionData.FILES"
      :rights="questionData.QUESTION_RIGHT ? questionData.QUESTION_RIGHT : []"
      @onDelete="deleteModalIsVisible = true"
      @onEdit="editModalIsVisible = true"
    />

    <QuestionAnswerFooter
      class="manager-question__footer"
      :date="questionData.DATE_CREATE"
    />

    <transition name="fade">
      <ManagerQuestionDeleteModal
        class="page-manager-question__delete-modal"
        v-if="deleteModalIsVisible"
        :questionId="questionData.ID"
        :questionName="questionData.NAME"
        @onClose="deleteModalIsVisible = false"
        @onDelete="onDelete"
      />
    </transition>

    <transition name="fade">
      <AskQuestionModal
        v-if="editModalIsVisible"
        @closeModal="editModalIsVisible = false"
        :editMode="true"
        :questionCategory="questionData.CATEGORY"
        :recipient="{
          value: {
            code: recipient.ID,
            label: recipient.FULL_NAME,
          },
        }"
        :questionID="questionData.ID"
        @refreshQuestionList="update"
      />
    </transition>
  </div>
</template>

<script>
import QuestionAnswerHeader from "@/components/manager-question/question-answer/QuestionAnswerHeader.vue";
import QuestionAnswerMain from "@/components/manager-question/question-answer/QuestionAnswerMain.vue";
import QuestionAnswerFooter from "@/components/manager-question/question-answer/QuestionAnswerFooter.vue";
import ManagerQuestionDeleteModal from "@/components/manager-question/ManagerQuestionDeleteModal.vue";
import AskQuestionModal from "@/components/modals/AskQuestionModal.vue";

export default {
  name: "ManagerQuestion",

  components: {
    QuestionAnswerHeader,
    QuestionAnswerMain,
    QuestionAnswerFooter,
    ManagerQuestionDeleteModal,
    AskQuestionModal,
  },

  props: {
    questionData: {
      type: Object,
      required: true,
    },

    recipient: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      deleteModalIsVisible: false,
      editModalIsVisible: false,
    };
  },

  computed: {},

  methods: {
    onDelete() {
      this.$router.push(`/questions`);
    },

    update() {
      this.$emit("questionUpdate");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.manager-question {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-8);

  &__header {
  }

  &__main {
  }

  &__footer {
  }
}
</style>