<template>
  <div class="input-textarea">
    <label class="input-textarea__label">
      <textarea
        class="input-textarea__input"
        :class="{
          'input-textarea__input--disabled': input.disabled,
          'input-textarea__input--error': errors.length > 0,
        }"
        :style="{
          height: textareaHeight,
        }"
        ref="textareaElement"
        :name="input.name"
        :required="input.required"
        type="text"
        @change="emitThisData"
        @input="validate"
        v-model="newValue"
        :autocomplete="input.autocomplete ? input.autocomplete : 'off'"
        :maxlength="input.maxLength"
        :disabled="input.disabled"
      ></textarea>

      <div
        class="input-textarea__placeholder placeholder"
        :class="{
          'placeholder--required': input.required,
          'placeholder--active': newValue,
        }"
        v-if="input.placeholder"
      >
        {{ input.placeholder }}
      </div>
    </label>

    <div class="input-textarea__bottom">
      <InputErrors class="input-textarea__errors" :errors="this.errors" />

      <InputCounter
        class="input-textarea__counter"
        :maxLength="input.maxLength"
        :newValue="newValue"
      />
    </div>
  </div>
</template>

<script>
import InputErrors from "./assets/InputErrors.vue";
import InputCounter from "./assets/InputCounter.vue";

export default {
  name: "InputTextareaV2",

  components: {
    InputErrors,
    InputCounter,
  },

  props: {
    input: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      type: "textarea",
      name: this.input.name,
      newValue: this.input.defaultValue ? this.input.defaultValue : "",
      isValid: this.input.required && !this.input.defaultValue ? false : true,
      errors: [],
      scrollHeight: 0,
      elementBorderSize: 0,
      textareaHeight: "auto",
    };
  },

  computed: {
    textareaElement() {
      return this.$refs.textareaElement;
    },
  },

  methods: {
    validate() {
      this.errors = [];
      if (this.input.required && !this.newValue) {
        this.isValid = false;
        this.errors.push("Данное поле обязательно для заполнения");
        return;
      }

      this.isValid = true;
    },

    emitThisData() {
      this.$emit("getThisData", this.$data);
    },

    updateSizes() {
      this.textareaHeight = "auto";

      this.$nextTick(() => {
        this.scrollHeight = this.textareaElement.scrollHeight;

        // Так как рамки равны, беру только верхнюю
        this.elementBorderSize = window.getComputedStyle(
          this.textareaElement
        ).borderTopWidth;

        this.updateTextareaHeight();
      });
    },

    updateTextareaHeight() {
      this.textareaHeight = `calc(${this.scrollHeight}px + (${this.elementBorderSize} * 2))`;
    },
  },

  watch: {
    newValue() {
      this.updateSizes();
    },
  },

  mounted() {
    this.updateSizes();

    this.emitThisData();
  },
};
</script>

<style lang="scss" scoped>
.input-textarea {
  &__label {
    position: relative;

    display: block;
    line-height: 0;
  }

  &__placeholder {
    position: absolute;
    top: 15px;
    left: 23px;
  }

  &__input {
    width: 100%;
    height: 128px;
    padding: {
      top: 23px;
      right: 23px;
      bottom: 7px;
      left: 23px;
    }

    @extend .body-2;
    color: var(--gray900);

    background-color: var(--white900);
    border: 1px solid var(--gray500);

    resize: none;
    @include transition();

    &:not(.input-textarea__input--error):focus {
      border: 1px solid var(--red500);
    }

    &--disabled {
      cursor: not-allowed;
    }

    &--error {
      border: 1px solid var(--red00);
    }

    @include hover {
      &:not(.input-textarea__input--disabled):not(.input-textarea__input--error) {
        border: 1px solid var(--red500);
      }
    }
  }

  &__input:focus ~ .input-textarea__placeholder {
    top: 7px;
    transform: unset;

    @extend .caption-2;
  }

  &__bottom {
    width: 100%;
    display: flex;
    gap: var(--v-rhythm-2);
  }

  &__errors {
  }

  &__counter {
    margin-top: var(--v-rhythm-1);
    margin-left: auto;
  }

  @include phones {
    &__input {
      height: 100px;
      padding: {
        top: 19px;
        right: 11px;
        bottom: 7px;
        left: 11px;
      }
    }

    &__placeholder {
      left: 11px;
    }

    &__input:focus ~ .input-textarea__placeholder {
      top: 5px;
    }
  }
}
</style>
