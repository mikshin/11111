<template>
  <div class="input-checkbox">
    <label
      class="input-checkbox__label"
      :class="{
        'input-checkbox__label--disabled': input.disabled,
        'input-checkbox__label--error': errors.length > 0,
      }"
    >
      <input
        class="input-checkbox__hidden-input visually-hidden"
        :name="input.name"
        :required="input.required"
        type="checkbox"
        @change="onChange"
        v-model="newValue"
        :disabled="input.disabled"
      />
      <UserIcons
        class="input-checkbox__icon"
        :iconName="`${newValue ? 'checkbox-true' : 'checkbox-false'}`"
      />
      <span class="input-checkbox__title">{{ input.placeholder }}</span>
    </label>

    <InputErrors class="input-checkbox__errors" :errors="this.errors" />
  </div>
</template>

<script>
import InputErrors from "./assets/InputErrors.vue";

export default {
  name: "InputCheckboxV2",

  components: {
    InputErrors,
  },

  props: {
    input: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      type: "checkbox",
      name: this.input.name,
      isValid: this.input.required && !this.input.defaultValue ? false : true,
      errors: [],
      newValue: this.input.defaultValue ? this.input.defaultValue : false,
    };
  },

  methods: {
    onChange() {
      this.validate();
      this.emitThisData();
    },

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
.input-checkbox {
  &__label {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-2);

    color: var(--gray900);

    cursor: pointer;

    &:not(.input-checkbox__label--disabled) {
      &:hover {
        .input-checkbox__icon {
          fill: var(--red900);
        }
      }

      .input-checkbox__hidden-input:checked + .input-checkbox__icon {
        fill: var(--red900);
      }
    }

    &--disabled {
      color: var(--gray500);

      cursor: not-allowed;

      .input-checkbox__icon {
        fill: var(--gray500);
      }
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;

    fill: var(--gray500);
    @include transition(fill);
  }

  &__title {
    width: calc(100% - 32px);

    text-overflow: ellipsis;
    white-space: nowrap;
    @extend .body-1;

    overflow: hidden;
  }

  @include phones {
    &__title {
      @include font(14px, 20px, 400);
    }
  }
}
</style>
