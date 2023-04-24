<template>
  <FunctionBtn
    class="event-modal-viewing__top-btn"
    v-if="isEditBtn"
    :iconName="'pen'"
    @clickBtn="toggleModal"
  />
  <button
    v-else
    class="primary-btn ask-question__button"
    @click="toggleModal"
    :disabled="isFired"
  >
    {{ title }}
  </button>
</template>


<script>
import FunctionBtn from "@/components/UI/FunctionBtn.vue";
export default {
  name: "AskQuestionButton",
  components: {
    FunctionBtn,
  },

  props: {
    isEditBtn: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Задать вопрос руководителю",
    },
    isFired: {
      type: Boolean,
      require: false,
    },
  },
  data() {
    return {
      isEditMode: false,
    };
  },
  // computed: {
  //   getID() {
  //     return this.$route.params.id;
  //   },
  // },
  methods: {
    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
      const data = this.isModalVisible;
      this.$emit("openModalDialog", data);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.ask-question {
  &__button {
    width: 100%;
    margin-bottom: var(--v-rhythm-3);
  }
}
</style>