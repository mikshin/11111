<template>
  <div class="user-nav-counter">{{ number }}</div>
</template>

<script>
export default {
  name: "UserNavCounter",

  components: {},

  data() {
    return {};
  },

  props: {
    counter: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  computed: {
    number() {
      return this.counter < 100 ? this.counter : "99+";
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.user-nav-counter {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: var(--red700);
  box-shadow: 0 0 0 3px var(--gray700);

  @extend .overline;
  color: var(--white900);
}
</style>