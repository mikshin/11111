<template>
  <form @submit.prevent="" class="polls_form">
    <fieldset v-if="item.type === 'checkbox'" class="checkbox_list">
      <span
        class="poll_placeholder"
        v-show="item.placeholder"
        v-html="item.placeholder"
      ></span>
      <Input
        :input="{
          type: 'checkbox',
          placeholder: checkbox.name,
          name: checkbox.code,
        }"
        v-for="(checkbox, j) in item.checkboxValue"
        :key="j"
        @onChange="changeAnswer"
      />
    </fieldset>
    <template v-else-if="item.type === 'combo'">
      <span
        class="poll_placeholder"
        v-show="item.placeholder"
        v-html="item.placeholder"
      ></span>
      <ComboPoll
        :item="item"
        @onComplete="isReady = true"
        @onChange="changeAnswer"
      />
    </template>
    <template v-else-if="item.type === 'radio'">
      <span
        class="poll_placeholder"
        v-show="item.placeholder"
        v-html="item.placeholder"
      ></span>
      <Input
        :input="{
          name: item.name,
          radioValue: item.radioValue,
          required: item.required,
          type: item.type,
        }"
        @onChange="changeAnswer"
      />
    </template>
    <template v-else>
      <span
        class="poll_placeholder"
        v-show="item.placeholder"
        v-if="item.type != 'text' && item.type != 'textarea'"
        v-html="item.placeholder"
      ></span>
      <Input :input="item" @onChange="changeAnswer" />
    </template>
    <div class="button_wrapper" v-if="withButton">
      <button
        class="secondary-btn"
        v-if="position != 0"
        type="button"
        @click="vote(position - 1)"
      >
        Назад
      </button>

      <button
        class="primary-btn"
        v-if="!last"
        type="button"
        :disabled="!isReady"
        @click="vote(position + 1)"
      >
        Далее
      </button>

      <button
        class="primary-btn"
        v-else
        type="button"
        :disabled="!isReady"
        @click="sendForm"
      >
        Отправить
      </button>
    </div>
  </form>
</template>
<script>
import Input from "../../UI/inputTemplate.vue";
import ComboPoll from "./comboPoll.vue";
export default {
  name: "polls-form",
  components: {
    Input,
    ComboPoll,
  },
  props: {
    item: Object,
    position: undefined,
    last: Boolean,
    withButton: Boolean,
  },
  data() {
    return {
      isReady: false,
      answer: {},
      type: "",
    };
  },
  methods: {
    changeAnswer(data) {
      if (this.item.type === "checkbox") {
        let tmp = 0;
        let currentAnswer = [];
        for (let checkbox of this.$children) {
          if (checkbox.newValue) {
            tmp++;
            currentAnswer.push([checkbox.input.name]);
          }
        }
        this.isReady = tmp > 0 ? true : false;
        this.answer = currentAnswer;
        this.type = this.item.type;
      }
      // Логика для радиобаттона
      else if (this.item.type === "radio") {
        if (data.data.newValue === null || data.data.newValue.length === 0) {
          this.isReady = false;
        } else {
          this.isReady = true;
          this.answer = [[data.data.newValue.code]];
        }
      }
      // Логика для селекта
      else if (this.item.type === "select") {
        // множественный
        if (this.item.multiple) {
          if (data.data.newValue.length === 0) {
            this.isReady = false;
          } else {
            this.isReady = true;
            let tmp = [];
            for (let value of data.data.newValue) {
              tmp.push(value.code);
            }
            this.answer = [tmp];
          }
        }
        // не множественный
        else {
          if (data.data.newValue === null) {
            this.isReady = false;
          } else {
            this.isReady = true;
            this.answer = [[data.data.newValue.code]];
          }
        }
      } else if (this.item.type === "text" || this.item.type === "textarea") {
        this.answer = [data.data.input.name, data.data.newValue];
      } else if (this.item.type === "combo") {
        this.answer = data.answers[this.item.name];
      }
      this.$emit("onChange", {
        data: {
          id: this.item.name,
          answers: this.answer,
        },
      });
    },
    vote(position) {
      this.$emit("onVote", {
        data: {
          position: position + 1,
          id: this.item.name,
          answers: this.answer,
          type: this.item.type,
        },
      });
    },
    change(data) {
      this.$set(this.answer, this.item.name, data.data.answers);
      this.$emit("onVote", {
        data: {
          answers: this.answer,
        },
      });
    },
    sendForm() {
      this.vote(this.position);
      this.$emit("onSend");
    },
  },
};
</script>

<style lang="scss" scoped>
.button_wrapper {
  padding: var(--v-rhythm-8) 0;

  display: flex;
  flex-wrap: wrap;
  gap: var(--v-rhythm-2) var(--v-rhythm-6);
  justify-content: space-between;

  button {
    flex-grow: 1;
  }
}

.polls_form {
  & + & {
    margin-top: var(--v-rhythm-6);
  }
}
.checkbox_list {
  padding: 0;
  border: none;
}
.poll_placeholder {
  @extend .subtitle-1;
  display: block;
  margin-bottom: var(--v-rhythm-6);
  word-break: break-word;

  @include phones {
    margin-bottom: var(--v-rhythm-4);
    font-size: 13px;
  }
}
.combo_list {
  margin-bottom: var(--v-rhythm-4);
}
</style>
