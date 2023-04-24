<template>
  <!-- Сказали, что нужно скрывать виджет, если нет документов -->
  <WidgetWrapper
    v-if="documents"
    :iconName="'documents-widget'"
    :title="'Мои документы для пропуска'"
    class="documents-widget"
  >
    <div class="documents-widget__main" :class="{ loading: isLoading }">
      <ol v-if="documents" class="documents-widget__list">
        <li
          class="documents-widget__list-item"
          v-for="document in documents"
          :key="document.ID"
        >
          <span class="documents-widget__list-item-name">{{
            document.NAME
          }}</span>
          <span
            class="documents-widget__list-item-date"
            :class="[document.COLOR]"
            >до {{ document.DATE_END }}</span
          >
        </li>
      </ol>
      <div v-else class="documents-widget__main-default widget-text-default">
        Документов нет
      </div>
      <div v-if="!isEndLoading" v-intersection="fetchDocuments"></div>
    </div>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";

import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";

export default {
  name: "DocumentsWidget",

  components: { WidgetWrapper },

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {
      isLoading: false,
      documents: null,
      isEndLoading: true,
    };
  },

  computed: {},

  methods: {
    async fetchDocuments() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/myDocument/lkWidget`,
          params: {
            count: 10,
            startFrom: this.documents?.length || 0,
          },
        });
        this.documents = this.documents
          ? [...this.documents, ...response.data.data]
          : response.data.data;

        this.isEndLoading = response.data.end;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {},

  mounted() {
    this.fetchDocuments();
  },
};
</script>

<style scoped lang="scss">
.documents-widget {
  &__main {
    // Макс.высота - высота шапки виджета
    height: calc(600px - 64px);
    padding: var(--v-rhythm-8) var(--v-rhythm-4);

    overflow: auto;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    counter-reset: list-element;
  }

  &__list-item {
    display: flex;
    gap: 16px;

    counter-increment: list-element;

    &::before {
      content: counter(list-element) ".";

      color: var(--gray500);
      @extend .subtitle-1;
    }
  }

  &__list-item-name {
    flex-grow: 1;

    word-break: break-word;
    @extend .subtitle-1;
  }

  &__list-item-date {
    flex-shrink: 0;

    @extend .body-1;

    &.red {
      color: var(--red900);
    }

    &.yellow {
      color: #ff8800;
    }

    &.green {
      color: var(--chatPrimary);
    }
  }
}
</style>