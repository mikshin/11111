<template>
  <div class="poll__statistic" v-bind:class="{ loading: isLoading }">
    <ul v-show="!isRevoting">
      <li v-for="(item, i) of poll.STATISTIC" :key="i" class="question">
        <div class="question__name" v-html="item.QUESTION"></div>
        <template v-if="item.FIELD_TYPE === 'combo'">
          <template v-for="(question, key) in item.ANSWERS">
            <ul class="answer__list" :key="key">
              <template v-for="(answer, k) in question">
                <li class="answer" :key="k" v-if="answer">
                  <span
                    class="answer__procent"
                    v-if="answer.STATISTIC !== undefined"
                    >{{ answer.STATISTIC }}% </span
                  >{{ answer.MESSAGE }}
                </li>
              </template>
            </ul>
          </template>
        </template>
        <template v-else>
          <ul class="answer__list">
            <li class="answer" v-for="(answer, k) in item.ANSWERS" :key="k">
              <span class="answer__procent">{{ answer.STATISTIC }}% </span
              >{{ answer.MESSAGE }}
            </li>
          </ul>
        </template>
      </li>
    </ul>
    <form class="poll_form" v-if="isRevoting">
      <div v-for="(item, i) in inputs" :key="i" class="poll_item">
        <PollsForm :item="item" @onChange="changeAnswer" />
      </div>
    </form>

    <button
      class="primary-btn"
      v-if="changable && !isRevoting"
      type="button"
      @click="revote"
    >
      {{ !this.poll.STATISTIC ? "Пройти опрос" : "Изменить свои ответы" }}
    </button>

    <button
      class="primary-btn"
      v-if="changable && isRevoting"
      :disabled="!isFormReady"
      type="button"
      @click="send"
    >
      Отправить
    </button>
  </div>
</template>
<script>
import PollsForm from "./pollsForm.vue";
import axios from "axios";
export default {
  components: {
    PollsForm,
  },
  props: {
    poll: null,
    type: null,
  },
  data() {
    return {
      isLoading: false,
      isRevoting: false,
      isFormReady: false,
      inputs: [],
      errors: [],
      answers: {
        voteId: 0,
        answer: {},
      },
    };
  },
  computed: {
    changable() {
      if (this.poll.CAN_REVOTE) {
        if (this.poll.STATUS === "Завершен") return false;
        if (this.poll.STATUS === "Пройден") return true;
        if (this.poll.STATUS === "Не пройден") return true;
      }
      return false;
    },
  },
  methods: {
    changeAnswer(data) {
      this.$set(
        this.answers.answer[this.answers.voteId],
        data.data.id,
        data.data.answers
      );
      for (let child of this.$children) {
        if (child.isReady === false) {
          this.isFormReady = false;
        }
        this.isFormReady = true;
      }
    },
    revote() {
      this.isRevoting = true;

      this.isLoading = true;
      axios
        .get("mobileapp/api/vote/questions/?voteId=" + this.poll.ID)
        .then((response) => {
          this.answers.voteId = this.poll.ID;
          this.$set(this.answers.answer, this.poll.ID, {});
          this.inputs = response.data[this.poll.ID];
          this.isLoading = false;
        });
    },
    send() {
      this.isLoading = true;
      axios.post("mobileapp/api/vote/add/", this.answers).then((response) => {
        if (response.data === "Success") {
          this.isRevoting = false;
          this.isLoading = false;
          this.$emit("onUpdate");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.question {
  margin-bottom: var(--v-rhythm-8);
  max-width: 100%;
  word-break: break-word;

  &__name {
    @extend .subtitle-1;
    margin-bottom: var(--v-rhythm-6);

    @include phones {
      margin-bottom: var(--v-rhythm-4);
      font-size: 13px;
    }
  }

  @include phones {
    margin-bottom: var(--v-rhythm-6);
  }
}
.answer {
  &__procent {
    @extend .subtitle-1;
    color: var(--red900);
    width: 40px;
    display: inline-block;
    margin-right: 8px;
    white-space: nowrap;
  }
}
.poll {
  &__statistic {
    margin-top: var(--v-rhythm-11);
    padding-right: var(--v-rhythm-8);

    button {
      margin-bottom: 16px;
      @include phones {
        width: 100%;
        padding: var(--v-rhythm-2) var(--v-rhythm-6);
        height: auto;
        margin-top: var(--v-rhythm-8);
      }
    }

    @include phones {
      margin-top: var(--v-rhythm-6);
      padding-right: 0;
    }
  }
  &__placeholder {
    margin-bottom: var(--v-rhythm-6);
    display: block;
    color: var(--red900);
  }
}

.polls_form {
  margin-bottom: var(--v-rhythm-8);
  @include phones {
    margin-bottom: var(--v-rhythm-6);
  }
}

.answer__list {
  .answer {
    display: flex;
    margin-bottom: var(--v-rhythm-2);

    &__procent {
      flex-shrink: 0;
    }
  }
}
.poll_item::v-deep {
  .radio .input-radio__placeholder {
    display: none;
  }
}
</style>
