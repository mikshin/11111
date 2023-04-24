<template>
  <ul class="training-audios">
    <li class="training-audios__item" v-for="item in audios" :key="item.fileId">
      <audio class="training-audios__audio" controls="controls">
        <source :src="item.fileLink" :type="item.fileType" />
      </audio>
    </li>
  </ul>
</template>

<script>
export default {
  name: "TrainingAudios",

  components: {},

  props: {
    audios: {
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
.training-audios {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-4);

  &__item {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__audio {
    width: 100%;
  }
}
</style>