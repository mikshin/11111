<template>
  <InputLabelWrapper class="input-radio" :input="input" :isValid="isValid">
    <div class="input-radio__content">
      <span
        class="input-radio__placeholder"
        :class="{ required: input.required }"
        v-if="input.placeholder"
        >{{ input.placeholder }}</span
      >

      <div class="input-radio__list">
        <label
          class="input-radio__label"
          :class="{ 'input-radio__label--disabled': input.disabled }"
          v-for="(radio, i) in input.radioValue"
          :key="i"
        >
          <input
            class="input-radio__hidden-input visually-hidden"
            placeholder=" "
            :name="input.name"
            :required="input.required"
            type="radio"
            @change="validate"
            :value="radio"
            :disabled="input.disabled"
            v-model="newValue"
          />

          <UserIcons
            class="input-radio__icon"
            :iconName="
              newValue && newValue.code === radio.code
                ? 'radio-true'
                : 'radio-false'
            "
          />
          <span class="input-radio__text-radio">{{ radio.name }}</span>
        </label>
      </div>
    </div>

    <InputErrors class="input-radio__errors" :errors="this.errors" />
  </InputLabelWrapper>
</template>

<script>
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import { inputMixin } from "./assets/inputMixin";
export default {
  name: "inputRadio",

  mixins: [inputMixin],

  props: {
    input: Object,
  },

  components: {
    InputLabelWrapper,
    InputErrors,
  },

  data() {
    return {
      newValue: this.input.defaultValue,
    };
  },

  computed: {
    isChecked() {
      return this.$refs.in;
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
.input-radio {
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);
  }

  &__placeholder {
    @extend .subtitle-2;
    color: var(--gray500);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__label {
    display: flex;
    align-items: flex-start;
    gap: var(--v-rhythm-2);

    cursor: pointer;

    &--disabled {
      cursor: not-allowed;
    }

    &:hover:not(.input-radio__label--disabled) {
      .input-radio__icon {
        fill: var(--red900);
      }
    }
  }

  &__hidden-input {
    &:checked + .input-radio__icon {
      fill: var(--red900);
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;

    fill: var(--gray500);

    @include transition(fill);
  }

  &__text-radio {
    padding-top: 2px;

    @extend .body-1;
    color: var(--gray900);
  }

  &__errors {
  }
}
</style>
