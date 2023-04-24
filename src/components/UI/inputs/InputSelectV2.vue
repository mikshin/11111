<template>
  <div class="input-select">
    <label class="input-select__label">
      <select
        class="input-select__hidden-input visually-hidden"
        :name="input.name"
        :multiple="input.multiple"
        :required="input.required"
      >
        <option value=""></option>
        <option
          v-for="(option, i) in input.selectValues"
          :key="i"
          :value="option.code"
          :selected="newValue && newValue.code === option.code"
        >
          {{ option.code }}
        </option>
      </select>

      <v-select
        class="input-select__v-select"
        :class="{
          'input-select__v-select--error': errors.length > 0,
        }"
        v-model="newValue"
        :options="input.selectValues"
        :name="input.name"
        :multiple="input.multiple"
        :autocomplete="input.autocomplete ? input.autocomplete : 'off'"
        :disabled="input.disabled"
        :required="input.required"
        @input="setNewvalue"
        @search="selectSearch"
        @open="isOpen = true"
        @close="isOpen = false"
      >
        <!-- eslint-disable-next-line vue/no-unused-vars  -->
        <template #no-options>
          <div class="input-select__v-select-text-default">
            Ничего не найдено
          </div>
        </template>
      </v-select>

      <div
        class="input-select__placeholder placeholder"
        :class="{
          'placeholder--required': input.required,
          'placeholder--active':
            newValue.length > 0 || this.isOpen || selectSearchText.length > 0,
        }"
        v-if="input.placeholder"
      >
        {{ input.placeholder }}
      </div>
    </label>

    <InputErrors class="input-select__errors" :errors="this.errors" />
  </div>
</template>

<script>
import "../../../assets/styles/plugins/v-select.scss";
import InputErrors from "./assets/InputErrors.vue";

export default {
  name: "InputSelectV2",

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
      isOpen: false,
      selectSearchText: "",
      type: "select",
      name: this.input.name,
      isValid: this.checkValid(),
      errors: [],
      newValue:
        this.input.defaultValue && this.input.defaultValue.length > 0
          ? this.input.defaultValue
          : [],
    };
  },

  computed: {},

  methods: {
    setNewvalue(val) {
      // Делаем, что бы всегда в newValue был массив, вне зависмости от multiple
      if (val === null) {
        this.newValue = [];
      } else if (!(val.length || val.length >= 0)) {
        this.newValue = [val];
      }

      this.validate();
      this.$emit("onChange", this.$data);
    },

    validate() {
      this.errors = [];
      if (this.input.required && this.newValue.length === 0) {
        this.isValid = false;
        this.errors.push("Данное поле обязательно для заполнения");
        return;
      }

      this.isValid = true;
    },

    emitThisData() {
      this.$emit("getThisData", this.$data);
    },

    checkValid() {
      if (this.input.required) {
        if (this.input.defaultValue) {
          return this.input.defaultValue.length > 0 ? true : false;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },

    selectSearch(search) {
      this.selectSearchText = search;
    },

    selectOption() {
      // Добавление тайтлов
      setTimeout(() => {
        const elements = document.querySelectorAll(".vs__selected");
        [...elements].forEach(function (elem) {
          const elemText = elem.innerText;
          elem.title == "" ? (elem.title = elemText) : null;
        });
      }, 0);
    },
  },

  mounted() {
    this.emitThisData();
  },

  watch: {
    // Нужно что бы сбросить значение у связанных между собой селектов. Т.е. когда значения второго селекта, зависят от выбора в первом.
    input: {
      handler: function (newValue) {
        if (!newValue.selectValues.length) {
          this.newValue =
            this.input.defaultValue && this.input.defaultValue.length > 0
              ? this.input.defaultValue
              : [];
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
// Основные стили для селекта подключаются в начале тега script
.input-select {
  &__label {
    position: relative;
    display: block;
  }

  &__hidden-input {
  }

  &__v-select {
    border: 1px solid var(--gray500);

    // min-height: $inputHeight;
    @include transition();

    &:not(.vs--disabled):not(.input-select__v-select--error) {
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