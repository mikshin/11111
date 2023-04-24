<template>
  <div class="simple-input-radios">
    <label
      class="simple-input-radios__label"
      v-for="(inputData, i) in inputsData"
      :key="i"
    >
      <input
        class="simple-input-radios__input visually-hidden"
        :name="name"
        type="radio"
        :value="inputData.value"
        v-model="newValue"
        :disabled="inputData.disabled"
        @change="changeRadio"
      />
      <span class="simple-input-radios__fake-input"></span>
      <span class="simple-input-radios__title">{{ inputData.title }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "SimpleInputRadios",

  components: {},

  props: {
    name: {
      type: String,
      required: true,
    },
    inputsData: {
      type: Array,
      required: true,
    },
    selectedInput: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      newValue: this.selectedInput ? this.selectedInput : null,
    };
  },

  computed: {},

  methods: {
    changeRadio() {
      this.$emit("changeRadio", this.newValue);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.simple-input-radios {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--v-rhythm-3);

  &__label {
    --fake-input-color: var(--gray500);
    width: 100%;

    display: flex;
    align-items: center;

    &:hover {
      .simple-input-radios__input:not(:disabled)
        + .simple-input-radios__fake-input {
        --fake-input-color: var(--red900);
      }
    }
  }

  &__input:checked + &__fake-input {
    --fake-input-color: var(--red900);
    &::after {
      background-color: var(--fake-input-color);
    }
  }

  &__fake-input {
    position: relative;

    flex-shrink: 0;
    padding: 2px;
    margin-right: var(--v-rhythm-2);

    &::before,
    &::after {
      content: "";

      display: block;
    }

    &::before {
      width: 20px;
      height: 20px;

      border: 2px solid var(--fake-input-color);
      border-radius: 50%;

      @include transition(border-color);
    }

    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      width: 10px;
      height: 10px;

      background-color: transparent;
      border-radius: 50%;

      @include transition(background-color);
    }
  }

  &__title {
    width: calc(100% - 36px);

    text-overflow: ellipsis;
    white-space: nowrap;
    @extend .body-1;
    color: var(--gray900);

    overflow: hidden;
  }
}
</style>