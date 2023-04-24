<template>
  <ul class="file_list">
    <li v-for="(file, i) in this.files" :key="i">
      <!-- <img
            v-if="file.type === 'image/jpeg' || file.type === 'image/png'"
            :src="convertImage(file)"
          /> -->
      <span :title="file.name">{{ file.name }}</span>
      <button @click="$emit('deleteFile', i)" type="button">
        <user-icons :iconName="'cross'"></user-icons>
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    files: {
      type: Array,
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.file_list {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: var(--v-rhythm-2);
  flex-wrap: wrap;

  li {
    background-color: var(--red100);
    margin-bottom: var(--v-rhythm-1);
    border-radius: var(--v-rhythm-6);
    border: 1px solid var(--red300);
    margin-right: var(--v-rhythm-1);
    white-space: nowrap;
    max-width: 270px;
    min-width: 80px;
    text-overflow: ellipsis;
    overflow: hidden;
    // padding: 8px;
    // padding-right: 33px;
    padding: 5px 32px 5px 8px;
    display: inline-block;
    position: relative;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    img {
      width: 100%;
      max-width: 100%;
      // height: 100%;
      object-fit: cover;

      & + span {
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    button {
      fill: var(--red500);
      position: absolute;
      right: 2px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: fill 0.3s;

      &:hover {
        fill: var(--red900);
      }

      .user-icons {
        --icon-size: 20px;
      }
    }

    span {
      display: block;
      word-wrap: break-word;
    }
  }
}
</style>