<template>
  <div class="question-answer-header">
    <div
      class="question-answer-header__type"
      :class="{
        'question-answer-header__type--question': type === 'question',
        'question-answer-header__type--answer': type === 'answer',
      }"
    >
      {{ typeCode.typeTitle }}
    </div>

    <div class="question-answer-header__person">
      <span class="question-answer-header__person-title">{{
        typeCode.typePersonTitle
      }}</span>

      <SimplePersonCard
        class="question-answer-header__person-card"
        :avatar="{ alt: person.avatar.alt, src: person.avatar.src }"
        :fullName="person.fullName"
        :profession="person.profession"
        :link="true"
        :id="person.id"
        :vacation="person.vacation"
        :fired="person.fired"
      />
    </div>
  </div>
</template>

<script>
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";

export default {
  name: "QuestionAnswerHeader",

  components: {
    SimplePersonCard,
  },

  props: {
    type: {
      type: String,
      required: true,
    },

    person: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      decoder: {
        question: {
          typeTitle: "Вопрос",
          typePersonTitle: "Спрашивает",
        },
        answer: {
          typeTitle: "Ответ",
          typePersonTitle: "Отвечает",
        },
      },
    };
  },

  computed: {
    typeCode() {
      return this.decoder[this.type];
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.question-answer-header {
  &__type {
    margin-bottom: var(--v-rhythm-8);

    @extend .subtitle-1;
    text-transform: uppercase;

    &--question {
      color: var(--red900);
    }

    &--answer {
      color: var(--chatPrimary);
    }
  }

  &__person {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__person-title {
    @extend .caption-1;
    color: var(--gray500);
  }

  &__person-card {
  }
}
</style>