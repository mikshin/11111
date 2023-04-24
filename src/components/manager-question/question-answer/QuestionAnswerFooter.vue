<template>
  <div class="question-answer-footer">
    <div class="question-answer-footer__date">{{ date }}</div>
  </div>
</template>

<script>
export default {
  name: "QuestionAnswerFooter",

  components: {},

  props: {
    date: {
      type: String,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.question-answer-footer {
  padding-top: var(--v-rhythm-8);

  border-top: 2px solid var(--gray300);

  &__date {
    padding: 3px 6px;

    @extend .caption-1;
    color: var(--gray700);
  }
}
</style>