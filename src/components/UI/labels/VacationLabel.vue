<template>
  <div class="vacation-label">отпуск</div>
</template>

<script>
export default {
  name: "VacationLabel",

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
.vacation-label {
  padding: var(--v-rhythm-2) var(--v-rhythm-4);

  @extend .overline;
  color: var(--white900);

  background-color: var(--chatPrimary);
  border-radius: 40px;
}
</style>