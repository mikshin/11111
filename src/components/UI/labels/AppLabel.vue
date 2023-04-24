<template>
  <div class="app-label" :class="colorModifier">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "AppLabel",

  components: {},

  props: {
    collorClass: {
      type: String,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    colorModifier() {
      return this.collorClass
        .split(" ")
        .map((className) => `app-label--${className}`);
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.app-label {
  width: max-content;
  padding: var(--v-rhythm-1) var(--v-rhythm-2);

  display: flex;
  align-items: center;
  gap: var(--v-rhythm-2);

  @extend .overline;
  color: var(--white900);

  border-radius: 40px;

  &--chat-primary {
    background-color: var(--chatPrimary);
  }

  &--white {
    background-color: var(--white900);
  }

  // @param $color - Переменная, обозначающая нужный цвет для генерации
  // @param $class-prefix [$color] - Префикс генерируемого класса. По умолчанию равен переменной класса. Например, если передан цвет red, но не передан класс, будет сгенерировано --red100 и т.д
  // @param $property [background-color] - Генерируемое свойство для класса
  // @return При передаче "red", будет сгенерировано 9 классов, c --red100 до --red900 с соответствующим классом и background-color
  @mixin create-color-variants(
    $color,
    $class-prefix: $color,
    $property: "background-color"
  ) {
    @for $i from 1 through 9 {
      &--#{$class-prefix}#{$i * 100} {
        #{$property}: var(--#{$color}#{$i * 100});
      }
    }
  }

  @include create-color-variants("red");
  @include create-color-variants("gray");
  @include create-color-variants("red", "red-text", "color");
  @include create-color-variants("gray", "gray-text", "color");
}
</style>