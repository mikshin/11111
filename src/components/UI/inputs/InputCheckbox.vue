<template>
  <InputLabelWrapper class="input-checkbox" :input="input" :isValid="isValid">
    <label
      class="input-checkbox__label"
      :class="{ 'input-checkbox__label--disabled': input.disabled }"
    >
      <input
        class="input-checkbox__hidden-input visually-hidden"
        :name="input.name"
        :required="input.required"
        type="checkbox"
        @change="validate"
        v-model="newValue"
        :disabled="input.disabled"
      />
      <UserIcons
        class="input-checkbox__icon"
        :iconName="`${newValue ? 'checkbox-true' : 'checkbox-false'}`"
      />

      <span
        class="input-checkbox__placeholder"
        :class="{ required: input.required }"
        v-if="input.placeholder"
        >{{ input.placeholder }}</span
      >
    </label>
    <InputErrors class="input-checkbox__errors" :errors="this.errors" />
  </InputLabelWrapper>
</template>

<script>
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import { inputMixin } from "./assets/inputMixin";
import InputErrors from "./assets/InputErrors.vue";

import Vue from "vue";
export const EventBus = new Vue();

export default {
  name: "inputCheckbox",

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
      newValue: this.input.defaultValue ? this.input.defaultValue : null,
    };
  },
};
</script>

<style lang="scss" scoped>
.input-checkbox {
  &__label {
    display: flex;
    align-items: flex-start;
    gap: var(--v-rhythm-2);

    cursor: pointer;

    &--disabled {
      cursor: not-allowed;
    }

    &:hover:not(.input-checkbox__label--disabled) {
      .input-checkbox__icon {
        fill: var(--red900);
      }
    }
  }

  &__hidden-input {
    &:checked + .input-checkbox__icon {
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

  &__placeholder {
    padding-top: 2px;

    @extend .body-1;
    color: var(--gray900);
  }

  &__errors {
  }
}
</style>
