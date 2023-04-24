<template>
  <div class="section-comments">
    <SectionCommentsHeader
      :quantity="commentsCount"
      :instance="instance"
      :viewsEndPoints="viewsEndPoints"
      :likesEndPoints="likesEndPoints"
      :commentsEndPoints="commentsEndPoints"
    />

    <Comments
      :entryId="entryId"
      @onComments="addComments"
      :recordType="recordType"
      :requestGetComments="requestGetComments"
      :isWhiteBg="isWhiteBg"
      :alignment="alignment"
    />
  </div>
</template>

<script>
import SectionCommentsHeader from "@/components/comments/section-comments/SectionCommentsHeader.vue";
import Comments from "@/components/pages/news/comments.vue";

export default {
  name: "SectionComments",

  components: {
    SectionCommentsHeader,
    Comments,
  },

  props: {
    requestGetComments: {
      type: Object,
      required: true,
    },

    commentsCount: {
      type: Number,
      required: true,
    },

    recordType: {
      type: String,
      required: true,
    },

    entryId: {
      type: String,
      required: true,
    },

    instance: {
      type: Object,
      required: false,
    },
    likesEndPoints: {
      type: Object,
      required: false,
    },
    viewsEndPoints: {
      type: Object,
      required: false,
    },
    commentsEndPoints: {
      type: Object,
      required: false,
    },
    isWhiteBg: {
      type: Boolean,
      default: false,
    },
    alignment: {
      type: String,
      default: "center",
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    addComments() {
      this.$emit("addComments");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>