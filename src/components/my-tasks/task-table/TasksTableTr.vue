<template>
  <tr class="tasks-table-tr">
    <td
      class="tasks-table-tr__td tasks-table-tr__td--link"
      :class="{ 'tasks-table-tr__td--crossed': task.STATUS === 'Завершена' }"
      @click="$emit('openTaskModal', task.ID)"
    >
      {{ task.TITLE }}
    </td>
    <td class="tasks-table-tr__td">{{ task.CREATED_DATE }}</td>
    <td class="tasks-table-tr__td">
      {{ task.DEADLINE ? task.DEADLINE : "-" }}
    </td>
    <td class="tasks-table-tr__td">
      <SimplePersonCard
        :avatar="{
          alt: task.CREATED_BY.FULL_NAME,
          src: task.CREATED_BY.USER_PHOTO,
        }"
        :fullName="task.CREATED_BY.FULL_NAME"
        :isMiniSize="true"
        :link="true"
        :id="task.CREATED_BY.ID"
        :vacation="task.CREATED_BY.VACATION"
        :fired="task.CREATED_BY.FIRED"
      />
    </td>
    <td class="tasks-table-tr__td">
      <div class="tasks-table-tr__td-responsible">
        <SimplePersonCard
          v-for="person in task.ACCOMPLICES"
          :key="person.ID"
          :avatar="{
            alt: person.FULL_NAME,
            src: person.USER_PHOTO,
          }"
          :fullName="person.FULL_NAME"
          :isMiniSize="true"
          :link="true"
          :id="person.ID"
          :vacation="person.VACATION"
          :fired="person.FIRED"
        />
      </div>
    </td>
    <td class="tasks-table-tr__td tasks-table-tr__td--bold">
      {{ task.STATUS }}
    </td>
  </tr>
</template>

<script>
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";

export default {
  name: "TasksTableTr",

  components: {
    SimplePersonCard,
  },

  props: {
    task: {
      type: Object,
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
.tasks-table-tr {
  &__td {
    padding: var(--v-rhythm-4);

    @extend .body-1;
    color: var(--gray900);
    text-align: left;
    // word-break: break-word;

    &--bold {
      @extend .caption-2;
    }

    &--link {
      cursor: pointer;
      @include transition();

      @include hover {
        color: var(--red900);
      }

      &:active {
        opacity: var(--active-opacity);
      }
    }

    &--crossed {
      text-decoration: line-through;
    }
  }

  &__td-responsible {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }
}
</style>