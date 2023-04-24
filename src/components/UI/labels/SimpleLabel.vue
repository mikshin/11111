<template>
  <div class="simple-label">{{ labelText }}</div>
</template>

<script>
export default {
  name: "SimpleLabel",

  components: {},

  props: {
    labelText: {
      type: String,
      required: true,
    },
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
.simple-label {
  padding: 7px 8px 5px 8px;

  @extend .overline;
  color: var(--gray900);

  background-color: var(--white900);
  border-radius: 40px;
  box-shadow: 0px 1px 2px rgba(16, 35, 47, 0.15);
}
</style>