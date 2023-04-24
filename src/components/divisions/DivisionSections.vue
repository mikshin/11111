<template>
  <div class="division-sections">
    <div
      class="division-sections__section"
      v-for="(section, i) in sectionsList"
      :key="i"
      :id="section.name"
    >
      <div class="division-sections__section-title">
        {{ section.placeholder }}
        <template v-if="section.name === 'command'"
          >({{ сountEmployee }})</template
        >
      </div>

      <DivisionsDocs
        class="division-sections__section-content division-sections__docs"
        v-if="section.name === 'documents'"
        :depId="selectDepId"
      />

      <DivisionsTeam
        class="division-sections__section-content division-sections__team"
        v-else-if="section.name === 'command'"
        :depId="selectDepId"
      />

      <DivisionArticles
        class="division-sections__section-content division-sections__articles"
        v-else-if="section.name === 'contentPages'"
        :depId="selectDepId"
      />

      <DivisionsProjects
        class="division-sections__section-content division-sections__projects"
        v-else-if="section.name === 'projects'"
        :depId="selectDepId"
      />

      <DivisionsEvents
        class="division-sections__section-content division-sections__events"
        v-else-if="section.name === 'calendar'"
        :depId="selectDepId"
      />
    </div>
  </div>
</template>

<script>
import DivisionsDocs from "@/components/divisions/DivisionsDocs.vue";
import DivisionsTeam from "@/components/divisions/DivisionsTeam.vue";
import DivisionArticles from "@/components/divisions/DivisionArticles.vue";
import DivisionsProjects from "@/components/divisions/DivisionsProjects.vue";
import DivisionsEvents from "@/components/divisions/DivisionsEvents.vue";

export default {
  name: "DivisionSections",

  components: {
    DivisionsDocs,
    DivisionsTeam,
    DivisionArticles,
    DivisionsProjects,
    DivisionsEvents,
  },

  props: {
    sectionsList: {
      type: Array,
      required: true,
    },

    selectDepId: {
      type: String,
      required: true,
    },

    сountEmployee: {
      type: Number,
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
.division-sections {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-12);

  &__section {
    width: 100%;
  }

  &__section-title {
    margin-bottom: var(--v-rhythm-6);

    @extend .h3;
    color: var(--gray500);
  }

  &__content {
    width: 100%;
  }
}
</style>