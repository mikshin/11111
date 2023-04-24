<template>
  <div class="app-checkbox">
    <label
      class="app-checkbox__label"
      :class="{
        'app-checkbox__label--disabled': disabled,
        'app-checkbox__label--error': errors.length > 0,
      }"
    >
      <input
        class="app-checkbox__hidden-input visually-hidden"
        type="checkbox"
        v-model="value"
        :name="name"
        :required="required"
        :disabled="disabled"
      />
      <UserIcons
        class="app-checkbox__icon"
        :iconName="`${value ? 'checkbox-true' : 'checkbox-false'}`"
      />
      <span
        class="app-checkbox__title"
        :class="{
          required: required,
          'app-checkbox__title--online': oneLine,
        }"
        >{{ title }}</span
      >
    </label>

    <InputErrors class="app-checkbox__errors" :errors="this.errors" />
  </div>
</template>

<script>
import InputErrors from "@/components/UI/inputs/assets/InputErrors.vue";

export default {
  name: "AppCheckbox",

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
      required: true,
    },

    defaultValue: {
      type: Boolean,
      required: false,
      default: false,
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

    showErrors: {
      type: Boolean,
      required: false,
      default: true,
    },

    oneLine: {
      // нужен для того, что бы инпут был в одну строку и если не убирается, то были точки в конце
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      value: false,
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
        if (!this.firstValidate && this.showErrors) {
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
        type: "checkbox",
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
.app-checkbox {
  &__label {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-2);

    color: var(--gray900);

    cursor: pointer;

    &:not(.app-checkbox__label--disabled) {
      &:hover {
        .app-checkbox__icon {
          fill: var(--red900);
        }
      }

      .app-checkbox__hidden-input:checked + .app-checkbox__icon {
        fill: var(--red900);
      }
    }

    &--disabled {
      color: var(--gray500);

      cursor: not-allowed;

      .app-checkbox__icon {
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

    @extend .body-1;

    &--online {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  @include phones {
    &__title {
      @include font(14px, 20px, 400);
    }
  }
}
</style>