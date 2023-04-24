<template>
  <div class="app-select">
    <label class="app-select__label">
      <select
        class="app-select__hidden-input visually-hidden"
        :name="name"
        :multiple="multiple"
        :required="required"
      >
        <option value=""></option>
        <option
          v-for="(option, i) in selectValues"
          :key="i"
          :value="option.code"
          :selected="value && value.code === option.code"
        >
          {{ option.code }}
        </option>
      </select>

      <v-select
        class="app-select__v-select"
        :class="{
          'app-select__v-select--error': errors.length > 0,
        }"
        v-model="value"
        :options="selectValues"
        :name="name"
        :multiple="multiple"
        :autocomplete="autocomplete ? 'on' : 'off'"
        :disabled="disabled"
        :required="required"
        @input="getValue"
        @search="selectSearch"
        @open="isOpen = true"
        @close="isOpen = false"
      >
        <!-- eslint-disable-next-line vue/no-unused-vars  -->
        <template #no-options>
          <div class="app-select__v-select-text-default">Ничего не найдено</div>
        </template>
      </v-select>

      <div
        class="app-select__placeholder placeholder"
        :class="{
          required: required && showRequired,
          'placeholder--active':
            value.length > 0 || this.isOpen || selectSearchText.length > 0,
        }"
        v-if="placeholder"
      >
        {{ placeholder }}
      </div>
    </label>

    <InputErrors class="app-select__errors" :errors="this.errors" />
  </div>
</template>

<script>
import "../../assets/styles/plugins/v-select.scss";
import InputErrors from "@/components/UI/inputs/assets/InputErrors.vue";

export default {
  name: "AppSelect",

  components: {
    InputErrors,
  },

  props: {
    name: {
      type: [String, Number],
      required: false,
      default: "",
    },

    placeholder: {
      type: String,
      required: false,
      default: "",
    },

    selectValues: {
      type: Array,
      required: true,
    },

    defaultValue: {
      type: Array,
      required: false,
      default: function () {
        return [];
      },
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },

    autocomplete: {
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

    showRequired: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data() {
    return {
      isOpen: false,
      selectSearchText: "",
      isValid: false,
      errors: [],
      value: [],
      // Нужно для того, что бы при инициализации не выскакивали errors
      firstValidate: true,
    };
  },

  computed: {},

  methods: {
    getValue(val) {
      this.value = [];
      if (val) {
        // Делаем, что бы всегда в value был массив, вне зависмости от multiple
        if (val.code) {
          this.value.push(val);
        } else {
          val.forEach((item) => this.value.push(item));
        }
      }
    },

    validate() {
      this.errors = [];
      if (this.required && !this.value.length) {
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
        type: "select",
        isValid: this.isValid,
      });
    },

    selectSearch(search) {
      this.selectSearchText = search;
    },
  },

  watch: {
    defaultValue: {
      handler: function () {
        this.value = this.defaultValue;
      },
      deep: true,
    },

    value: {
      handler: function () {
        this.validate();
      },
      deep: true,
    },
  },

  mounted() {
    if (this.defaultValue && this.defaultValue.length) {
      this.value = this.defaultValue;
    } else {
      this.validate();
    }
  },
};
</script>

<style lang="scss" scoped>
// Основные стили для селекта подключаются в начале тега script
.app-select {
  &__label {
    position: relative;
    display: block;
  }

  &__hidden-input {
  }

  &__v-select {
    border: 1px solid var(--gray500);

    @include transition();

    &:not(.vs--disabled):not(.app-select__v-select--error) {
      &:hover,
      &:focus,
      &:active {
        border-color: var(--red500);

        .vs__open-indicator {
          fill: var(--red900);
        }
      }
    }

    &--error {
      border-color: var(--red900);
    }

    &.vs--open {
      border-color: var(--red500);
    }

    .vs__open-indicator {
      @include transition(fill);
    }

    ::v-deep {
      .vs__selected {
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        // Не работает тут
        // @extend .body-1;
      }

      @include phones {
        .vs__selected {
          line-height: 20px;
        }
      }
    }
  }

  &__v-select-text-default {
    padding: var(--v-rhythm-4) 0;
  }

  &__placeholder {
    position: absolute;
    top: 50%;
    left: 23px;
    transform: translateY(-50%);
  }

  &__errors {
  }

  @include phones {
    &__placeholder {
      left: 11px;
    }

    .placeholder--active {
      left: 11px;
    }
  }
}
</style>