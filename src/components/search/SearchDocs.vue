<template>
  <ul class="search-docs" v-if="docs.length > 0">
    <li class="search-docs__item" v-for="(doc, i) in docs" :key="i">
      <AppDocument
        class="search-docs__app-document"
        v-if="doc.FILE"
        :fileTitle="doc.FILE.originalName"
        :fileSize="doc.FILE.fileSize"
        :fileExtension="doc.FILE.extension"
        :fileLink="doc.FILE.fileLink"
        :fileDate="doc.TIMESTAMP_X"
      />
    </li>
  </ul>
</template>

<script>
import AppDocument from "@/components/UI/document/AppDocument.vue";

export default {
  name: "SearchDocs",

  components: {
    AppDocument,
  },

  props: {
    docs: {
      type: Array,
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
.search-docs {
  width: 100%;
  padding: var(--v-rhythm-4) 0;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 var(--v-rhythm-8);

  background-color: var(--white900);

  &__item {
  }

  &__app-document {
  }

  @include phones {
    grid-template-columns: 1fr;
  }
}
</style>