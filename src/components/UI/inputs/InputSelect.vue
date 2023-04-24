<template>
  <InputLabelWrapper :input="input" :isValid="isValid">
    <select
      :name="input.name"
      :multiple="input.multiple"
      :required="input.required"
      class="visually-hidden"
      :disabled="disabled || input.disabled"
    >
      <option value=""></option>
      <option
        v-for="(option, i) in input.selectValue"
        :key="i"
        :value="option.code"
        :selected="newValue && newValue.code === option.code"
      >
        {{ option.code }}
      </option>
    </select>
    <v-select
      ref="select"
      :searchable="input.searchable"
      :name="input.name"
      :multiple="input.multiple"
      :options="input.selectValue"
      v-model="newValue"
      v-bind:class="{
        'vs--full': isEmpty,
        'vs--tight': input.isTight,
        'vs--no-checkbox': input.noCheckboxes,
        'vs--disabled': disabled || input.disabled,
      }"
      :disabled="disabled || input.disabled"
      @input="validate"
      @search="selectSearch"
      :selected="vSelected"
      @option:selected="selectOption"
      :deselectFromDropdown="true"
    >
      <!-- eslint-disable-next-line vue/no-unused-vars  -->
      <template #no-options="{ search, searching, loading }"
        >Ничего не найдено</template
      >
    </v-select>
    <!-- <button @click="selectAll" type="button" v-if="this.multiple" class="vs__dropdown-option">Выделить все</button> -->

    <InputPlaceholder :input="input" />
    <InputErrors :errors="this.errors" />
  </InputLabelWrapper>
</template>

<script>
import "../../../assets/styles/plugins/v-select.scss";
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import InputPlaceholder from "./assets/InputPlaceholder.vue";
import { inputMixin } from "./assets/inputMixin";
export default {
  components: {
    InputLabelWrapper,
    InputErrors,
    InputPlaceholder,
  },

  name: "inputSelect",

  mixins: [inputMixin],

  props: {
    input: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      newValue: this.input.defaultValue,
      selectSearchText: "",
      vSelected: null,
    };
  },

  computed: {
    isEmpty() {
      if (this.newValue == null) {
        return false;
      } else if (Array.isArray(this.newValue)) {
        if (this.newValue.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
  },

  methods: {
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
    selectAll() {
      this.newValue = this.selectValue;
    },
  },

  mounted() {
    // Нужно для работы EventModalViewing.vue
    setTimeout(() => {
      if (this.input.defaultValue) {
        this.newValue = this.input.defaultValue;

        if (
          this.lazyValidation &&
          !this.isDirty &&
          this.input.defaultValue?.length
        ) {
          this.isValid = true;

          this.$emit("onChange", {
            data: this,
          });
        }
      }
    }, 1);
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/inputTemplate.scss";

// Селект
// Основные стили для селекта подключаются в начале тега script
.v-select {
  border: 1px solid var(--gray500);
  min-height: $inputHeight;
  transition: 0.3s;
  border-radius: 0;
  &:hover,
  &:focus,
  &:active {
    border: 1px solid var(--red500);

    .vs__actions .vs__open-indicator {
      fill: var(--red900);
    }
  }

  &.vs--open {
    border: 1px solid var(--red500);
  }

  & ~ .placeholder {
    order: -1;
  }

  &.vs--full,
  &.vs--open {
    @include placeholderTop();
  }
}
</style>