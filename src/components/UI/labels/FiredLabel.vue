<template>
  <div class="fired-label">Уволен</div>
</template>

<script>
export default {
  name: "FiredLabel",

  components: {},

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
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
.fired-label {
  padding: var(--v-rhythm-2) var(--v-rhythm-4);

  @extend .overline;
  color: var(--gray900);

  background-color: var(--gray500);
  border-radius: 40px;
}
</style>