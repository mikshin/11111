<template>
  <div class="manager-answer" :class="{ loading: isLoading }">
    <QuestionAnswerHeader
      class="manager-answer__header"
      :type="'answer'"
      :person="{
        avatar: {
          alt: answernData.RECEPIENT_ID.FULL_NAME,
          src: answernData.RECEPIENT_ID.USER_PHOTO,
        },
        fullName: answernData.RECEPIENT_ID.FULL_NAME,
        profession: answernData.RECEPIENT_ID.WORK_POSITION,
        link: true,
        id: answernData.RECEPIENT_ID.ID,
        vacation: answernData.RECEPIENT_ID.VACATION,
        fired: answernData.RECEPIENT_ID.FIRED,
      }"
    />

    <slot>
      <ManagerAnswerToMe
        v-if="questionAddressedToMe"
        :answerId="answernData.ANSWER_ID ? answernData.ANSWER_ID : ''"
        :questionId="answernData.QUESTION_ID"
        :text="answernData.ANSWER_TEXT ? answernData.ANSWER_TEXT : ''"
        :files="answernData.ANSWER_FILE ? answernData.ANSWER_FILE : []"
        :rights="answernData.ANSWER_RIGHT ? answernData.ANSWER_RIGHT : []"
        :date="answernData.ANSWER_DATE ? answernData.ANSWER_DATE : ''"
        @answerUpdate="answerUpdate"
      />
      <ManagerAnswerToNotMe
        v-else
        :questionId="answernData.QUESTION_ID"
        :text="answernData.ANSWER_TEXT ? answernData.ANSWER_TEXT : ''"
        :files="answernData.ANSWER_FILE ? answernData.ANSWER_FILE : []"
        :date="answernData.ANSWER_DATE ? answernData.ANSWER_DATE : ''"
        :authorID="specialID"
        :hasSubscription="
          answernData.WANT_KNOW_ANSWER ? answernData.WANT_KNOW_ANSWER : false
        "
      />
    </slot>
  </div>
</template>

<script>
import QuestionAnswerHeader from "@/components/manager-question/question-answer/QuestionAnswerHeader.vue";
import ManagerAnswerToMe from "@/components/manager-question/manager-answer/ManagerAnswerToMe.vue";
import ManagerAnswerToNotMe from "@/components/manager-question/manager-answer/ManagerAnswerToNotMe.vue";

export default {
  name: "ManagerAnswer",

  components: {
    QuestionAnswerHeader,
    ManagerAnswerToMe,
    ManagerAnswerToNotMe,
  },

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    answernData: {
      type: Object,
      required: true,
    },
    specialID: {
      type: String,
    },
  },

  data() {
    return {};
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },

    questionAddressedToMe() {
      return this.answernData.RECEPIENT_ID.ID === this.currentUser.ID
        ? true
        : false;
    },
  },

  methods: {
    answerUpdate() {
      this.$emit("answerUpdate");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.manager-answer {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-8);

  &__header {
  }
}
</style>