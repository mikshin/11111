<template>
  <div class="divisions-docs" :class="{ loading: isLoading }">
    <ul class="divisions-docs__list" v-if="docs.length > 0">
      <li class="divisions-docs__item" v-for="doc in docs" :key="doc.ID">
        <AppDocument
          class="divisions-docs__app-document"
          v-if="doc.FILE"
          :fileTitle="doc.FILE.originalName"
          :fileSize="doc.FILE.fileSize"
          :fileExtension="doc.FILE.extension"
          :fileLink="doc.FILE.fileLink"
          :fileDate="doc.TIMESTAMP_X"
        />
      </li>
    </ul>
    <router-link class="divisions-docs__link primary-btn" :to="'/all_documents'"
      >Все документы</router-link
    >
  </div>
</template>

<script>
import axios from "axios";
import AppDocument from "@/components/UI/document/AppDocument.vue";

export default {
  name: "DivisionsDocs",

  components: {
    AppDocument,
  },

  props: {
    depId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      docs: [],
    };
  },

  computed: {},

  methods: {
    async getDocs() {
      try {
        this.isLoading = true;
        this.docs = [];
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/depDocumentList?depId=${this.depId}`,
        });

        this.docs = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    getExtension(str) {
      const arr = str.split("/");
      const extension = arr[arr.length - 1];
      return extension;
    },

    getDate(str) {
      const arr = str.split(" ");
      const date = arr[0];
      return date;
    },
  },

  watch: {},

  mounted() {
    this.getDocs();
  },
};
</script>

<style scoped lang="scss">
.divisions-docs {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-6);

  &__list {
    width: 100%;
    padding: var(--v-rhythm-4) 0;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0 var(--v-rhythm-8);

    background-color: var(--white900);
  }

  &__item {
  }

  &__app-document {
  }

  &__link {
    width: max-content;
  }

  @include desktop {
    &__list {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>