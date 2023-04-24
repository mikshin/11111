<template>
  <div class="radio-button">
    <div class="radio-button__content">
      <span
        class="radio-button__title"
        :class="{
          required: required,
        }"
        v-if="title"
        >{{ title }}</span
      >

      <div class="radio-button__list">
        <label
          class="radio-button__label"
          :class="{ 'radio-button__label--disabled': disabled }"
          v-for="(radio, i) in radioList"
          :key="i"
        >
          <input
            class="radio-button__hidden-input visually-hidden"
            type="radio"
            v-model="value"
            :name="name"
            :required="required"
            :value="radio.code"
            :disabled="disabled"
          />

          <UserIcons
            class="radio-button__icon"
            :iconName="value === radio.code ? 'radio-true' : 'radio-false'"
          />
          <span class="radio-button__text-radio">{{ radio.label }}</span>
        </label>
      </div>
    </div>

    <InputErrors class="radio-button__errors" :errors="this.errors" />
  </div>
</template>

<script>
import InputErrors from "@/components/UI/inputs/assets/InputErrors.vue";

export default {
  name: "RadioButton",

  components: {
    InputErrors,
  },

  props: {
    name: {
      type: [String, Number],
      required: true,
    },

    title: {
      type: String,
      required: false,
      default: "",
    },

    radioList: {
      type: Array,
      required: true,
    },

    defaultValue: {
      type: [String, Number],
      required: false,
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    required: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      value: null,
      isValid: false,
      errors: [],
      // Нужно для того, что бы при инициализации не выскакивали errors
      firstValidate: true,
    };
  },

  computed: {},

  methods: {
    validate() {
      this.errors = [];
      if (this.required && !this.value) {
        this.isValid = false;
        if (!this.firstValidate) {
          this.errors.push("Данное поле обязательно для заполнения");
        }
      } else {
        this.isValid = true;
      }

      this.firstValidate ? (this.firstValidate = false) : null;
      this.emitData();
    },

    emitData() {
      this.$emit("emitData", {
        name: this.name,
        value: this.value,
        isValid: this.isValid,
        type: "radio",
      });
    },
  },

  watch: {
    defaultValue() {
      this.value = this.defaultValue;
    },

    value() {
      this.validate();
    },
  },

  mounted() {
    if (this.value === this.defaultValue) {
      this.validate();
    } else {
      this.value = this.defaultValue;
    }
  },
};
</script>

<style scoped lang="scss">
.radio-button {
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);
    align-items: flex-start;
  }

  &__title {
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

    &:not(.radio-button__label--disabled) {
      &:hover {
        .radio-button__icon {
          fill: var(--red900);
        }
      }

      .radio-button__hidden-input:checked + .radio-button__icon {
        fill: var(--red900);
      }
    }

    &--disabled {
      color: var(--gray500);

      cursor: not-allowed;
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
  }

  &__errors {
  }
}
</style>