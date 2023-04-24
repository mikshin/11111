<template>
  <div class="input-text">
    <label class="input-text__label">
      <input
        class="input-text__input"
        :class="{
          'input-text__input--disabled': input.disabled,
          'input-text__input--error': errors.length > 0,
        }"
        :name="input.name"
        :required="input.required"
        type="text"
        @change="emitThisData"
        @input="validate"
        v-model="newValue"
        :autocomplete="input.autocomplete ? input.autocomplete : 'off'"
        :maxlength="input.maxLength"
        :disabled="input.disabled"
      />

      <div
        class="input-text__placeholder placeholder"
        :class="{
          'placeholder--required': input.required,
          'placeholder--active': newValue,
        }"
        v-if="input.placeholder"
      >
        {{ input.placeholder }}
      </div>
    </label>

    <div class="input-text__bottom">
      <InputErrors class="input-text__errors" :errors="this.errors" />

      <InputCounter
        class="input-text__counter"
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
  name: "InputTextV2",

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
      type: "text",
      name: this.input.name,
      newValue: this.input.defaultValue ? this.input.defaultValue : "",
      isValid: this.input.required && !this.input.defaultValue ? false : true,
      errors: [],
    };
  },

  computed: {},

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
  },

  watch: {},

  mounted() {
    this.emitThisData();
  },
};
</script>

<style lang="scss" scoped>
.input-text {
  &__label {
    position: relative;

    display: block;
    line-height: 0;
  }

  &__input {
    width: 100%;
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

    @include transition();

    &:not(.input-text__input--error):focus {
      border: 1px solid var(--red500);
    }

    &--disabled {
      cursor: not-allowed;
    }

    &--error {
      border: 1px solid var(--red900);
    }

    @include hover {
      &:not(.input-text__input--disabled):not(.input-text__input--error) {
        border: 1px solid var(--red500);
      }
    }
  }

  &__input:focus ~ .input-text__placeholder {
    top: 7px;
    transform: unset;

    @extend .caption-2;
  }

  &__placeholder {
    position: absolute;
    top: 50%;
    left: 23px;
    transform: translateY(-50%);
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

    &__input:focus ~ .input-text__placeholder {
      top: 5px;
    }
  }
}
</style>
