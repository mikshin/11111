<template>
  <div class="divisions-team">
    <EmployeesWidget class="divisions-team__widget" :depId="depId" />
    <BirthdaysWidgetList class="divisions-team__widget" :depId="depId" />
  </div>
</template>

<script>
import EmployeesWidget from "@widgets/EmployeesWidget.vue";
import BirthdaysWidgetList from "@widgets/BirthdaysWidgetList.vue";
export default {
  name: "DivisionsTeam",

  components: {
    EmployeesWidget,
    BirthdaysWidgetList,
  },

  props: {
    depId: {
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
.divisions-team {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--v-rhythm-8);

  &__widget {
    height: 412px;
  }

  @include phones {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>