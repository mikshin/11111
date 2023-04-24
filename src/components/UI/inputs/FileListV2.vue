<template>
  <ul class="file-list">
    <li v-for="(file, i) in this.files" :key="i" class="file-list__item">
      <span :title="file.name" class="file-list__item-name">{{
        file.name
      }}</span>
      <button class="file-list__item-btn" @click="deleteFile(i)" type="button">
        <UserIcons class="file-list__item-btn-icon" :iconName="'cross'" />
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  name: "FileListV2",

  components: {},

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

  methods: {
    deleteFile(i) {
      this.$emit("deleteFile", i);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.file-list {
  display: flex;
  gap: var(--v-rhythm-1);
  flex-wrap: wrap;

  &__item {
    position: relative;

    max-width: 270px;
    min-width: 80px;
    padding: var(--v-rhythm-1);
    padding-right: var(--v-rhythm-8);

    display: flex;
    align-items: center;

    border: 1px solid var(--red300);
    border-radius: var(--v-rhythm-6);
    background-color: var(--red100);
  }

  &__item-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__item-btn {
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);

    width: 24px;
    height: 24px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__item-btn-icon {
    width: 20px;
    height: 20px;

    @include transition(fill);

    fill: var(--red500);

    @include hover {
      fill: var(--red900);
    }
  }
}
</style>