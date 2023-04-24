<template>
  <div class="training-documents">
    <AppDocument
      class="training-documents__file"
      v-for="item in files"
      :key="item.fileId"
      :fileTitle="item.originalName"
      :fileSize="item.fileSize"
      :fileExtension="item.extension"
      :fileLink="item.fileLink"
    />
  </div>
</template>

<script>
import AppDocument from "@UI/document/AppDocument.vue";

export default {
  name: "TrainingDocuments",

  components: {
    AppDocument,
  },

  props: {
    files: {
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
.training-documents {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
</style>