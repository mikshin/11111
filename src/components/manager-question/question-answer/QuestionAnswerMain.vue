<template>
  <div class="question-answer-main">
    <div class="question-answer-main__text" v-html="textWithNewLines"></div>

    <div class="question-answer-main__files" v-if="files && files.length > 0">
      <AppDocument
        v-for="file in files"
        :key="file.fileId"
        :fileTitle="file.originalName"
        :fileSize="file.fileSize"
        :fileLink="file.fileLink"
        :fileExtension="file.extension"
      />
    </div>

    <div class="question-answer-main__btns" v-if="rights && rights.length > 0">
      <template v-for="(right, i) in rights">
        <FunctionBtn
          class="question-answer-main__btn"
          :key="i"
          v-if="right === 'edit'"
          :iconName="'pen'"
          @clickBtn="onEdit"
        />

        <FunctionBtn
          class="question-answer-main__btn"
          :key="i"
          v-if="right === 'delete'"
          :iconName="'trash'"
          @clickBtn="onDelete"
        />
      </template>
    </div>
  </div>
</template>

<script>
import FunctionBtn from "@/components/UI/FunctionBtn.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";

export default {
  name: "QuestionAnswerMain",

  components: {
    FunctionBtn,
    AppDocument,
  },

  props: {
    questionId: {
      type: String,
      required: false,
      default: "",
    },

    text: {
      type: String,
      required: false,
    },

    files: {
      type: Array,
      required: false,
    },

    rights: {
      type: Array,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    textWithNewLines() {
      return this.text?.replaceAll("\r\n", "<br/>");
    },
  },

  methods: {
    onEdit() {
      this.$emit("onEdit");
    },

    onDelete() {
      this.$emit("onDelete");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.question-answer-main {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-8);

  &__text {
    width: 100%;

    @extend .body-2;
    color: var(--gray900);
    word-break: break-word;
  }

  &__files {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);
  }

  &__btns {
    margin-left: auto;

    display: flex;
    gap: var(--v-rhythm-6);
  }

  &__btn {
  }
}
</style>