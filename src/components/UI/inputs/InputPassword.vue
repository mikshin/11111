<template>
  <InputLabelWrapper :input="input" :isValid="isValid">
    <input
      placeholder=" "
      :name="input.name"
      :required="input.required"
      :type="passwordType ? 'password' : 'text'"
      @input="validate"
      v-model="newValue"
      :autocomplete="input.autocomplete"
    />

    <InputPlaceholder :input="input" />
    <button @click="passwordType = !passwordType" type="button" class="button">
      <UserIcons :iconName="'eye-on'" />
    </button>
    <InputErrors :errors="this.errors" />
  </InputLabelWrapper>
</template>

<script>
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import InputPlaceholder from "./assets/InputPlaceholder.vue";
import { inputMixin } from "./assets/inputMixin";
export default {
  name: "inputPassword",

  mixins: [inputMixin],

  props: {
    input: Object,
  },

  components: {
    InputLabelWrapper,
    InputErrors,
    InputPlaceholder,
  },

  data() {
    return {
      newValue: null,
      passwordType: true,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/inputTemplate.scss";
.button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: var(--gray500);
  @include transition(fill);

  &:hover,
  &:focus {
    fill: var(--red900);
  }
}
input {
  padding-right: 42px;
}
</style>
