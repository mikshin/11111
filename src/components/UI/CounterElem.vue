<template>
  <div class="counter">
    <UserIcons :iconName="iconName" class="counter__icon" />
    <span class="counter__count">{{ count }}</span>
  </div>
</template>

<script>
import UserIcons from "@/components/global/UserIcons.vue";
export default {
  name: "CounterElem",

  components: { UserIcons },

  props: {
    iconName: String,
    count: Number,
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.counter {
  display: flex;
  align-items: center;
  column-gap: var(--v-rhythm-2);
  &__icon {
    width: var(--v-rhythm-11);
    height: var(--v-rhythm-11);
    fill: var(--gray700);
  }

  &__count {
    @extend .h4;
    color: var(--red900);
  }
}
</style>