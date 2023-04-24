<template>
  <AppModal class="ask-question__modal" @onClose="closePopup" :maxWidth="'800'">
    <img :src="image.fileLink" alt="" class="question__modal-image" />
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
export default {
  name: "SimpleImageModal",

  components: {
    AppModal,
  },

  props: {
    image: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    closePopup() {
      this.$emit("closePreview");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.question__modal-image {
  width: 100%;
  height: auto;
}
</style>