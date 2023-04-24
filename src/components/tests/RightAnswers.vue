<template>
  <div class="right-answers">
    <ul class="right-answers__list">
      <li
        class="right-answers__item"
        v-for="answer in answersList"
        :key="answer.code"
      >
        <span
          class="right-answers__item-truth"
          :class="{
            'right-answers__item-truth--right': answer.status === 'right',
          }"
        >
          <template v-if="answer.status">{{
            answer.status === "right" ? "Верно" : "Неверно"
          }}</template>
        </span>
        <span class="right-answers__item-answer">{{ answer.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "RightAnswers",

  components: {},

  props: {
    answersList: {
      type: Array,
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
.right-answers {
  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__item {
    display: flex;
    gap: var(--v-rhythm-2);
  }

  &__item-truth {
    width: 63px;
    flex-shrink: 0;

    @extend .subtitle-1;
    color: var(--red900);

    &--right {
      color: var(--chatPrimary);
    }
  }

  &__item-answer {
    @extend .body-1;
    color: var(--gray900);
  }
}
</style>