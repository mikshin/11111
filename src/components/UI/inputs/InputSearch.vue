<template>
  <InputLabelWrapper :input="input" :isValid="isValid" class="input-search">
    <input
      class="input-search__input"
      placeholder=" "
      :name="input.name"
      :required="input.required"
      type="search"
      @input="validate"
      v-model="newValue"
      :autocomplete="input.autocomplete"
      @focus="$emit('onFocus')"
    />
    <UserIcons class="input-search__icon" :iconName="'search'" />
    <InputPlaceholder :input="input" />
    <InputErrors :errors="this.errors" />
  </InputLabelWrapper>
</template>

<script>
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import InputPlaceholder from "./assets/InputPlaceholder.vue";
import { inputMixin } from "./assets/inputMixin";

export default {
  name: "InputSearch",

  mixins: [inputMixin],

  props: {
    input: {
      type: Object,
      required: true,
    },
  },

  components: {
    InputLabelWrapper,
    InputErrors,
    InputPlaceholder,
  },

  data() {
    return {
      newValue: null,
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/inputTemplate.scss";

.input-search {
  &__input {
  }

  &__icon {
    position: absolute;
    top: 19px;
    right: 19px;

    width: 24px;
    height: 24px;

    fill: var(--gray500);
  }
}
</style>
