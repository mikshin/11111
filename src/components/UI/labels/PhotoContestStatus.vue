<template>
  <div
    class="photo-contest-status"
    :class="{
      'photo-contest-status--active': active,
      'photo-contest-status--not-active': !active,
    }"
  >
    {{ active ? "Конкурс активен" : "Конкурс  завершён" }}
  </div>
</template>

<script>
export default {
  name: "PhotoContestStatus",

  components: {},

  props: {
    active: {
      type: Boolean,
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
.photo-contest-status {
  padding: 10px var(--v-rhythm-4);

  @extend .overline;

  border-radius: 40px;
  background-color: var(--white900);

  &--active {
    color: var(--red900);
  }

  &--not-active {
    color: var(--gray900);
  }
}
</style>