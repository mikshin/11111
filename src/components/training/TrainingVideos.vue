<template>
  <div class="training-videos">
    <div
      class="training-videos__item"
      v-for="video in videos"
      :key="video.fileId"
    >
      <video class="training-videos__video" controls>
        <!-- #t=0.1 в src нужно что бы в сафари подгружался первый кадр на видео, как превью -->
        <source :src="`${video.fileLink}#t=0.1`" :type="video.fileType" />
      </video>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrainingVideos",

  components: {},

  props: {
    videos: {
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
.training-videos {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-4);

  &__video {
    width: 100%;
  }
}
</style>