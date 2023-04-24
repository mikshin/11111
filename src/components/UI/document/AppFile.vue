<template>
  <div class="app-file">
    <svg class="app-file__icon">
      <use
        :xlink:href="`/img/icons/sprites/document-icons.svg#${extension}`"
      ></use>
    </svg>
    <div class="app-file__info">
      <span class="app-file__title" v-html="fileTitle"></span>
      <div class="app-file__data">
        <span v-if="fileDate" v-html="fileDate"></span>
        <span class="app-file__dot" v-if="fileDate">•</span>
        {{ fileSize }}
      </div>
    </div>
  </div>
</template>

<script>
import { normalizeExtension } from "@utils";

export default {
  name: "AppFile",

  components: {},

  props: {
    fileTitle: {
      type: String,
      required: true,
    },

    fileSize: {
      type: String,
      required: true,
    },

    fileExtension: {
      type: String,
      required: true,
    },

    fileDate: {
      type: String,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    extension() {
      return normalizeExtension(this.fileExtension);
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.app-file {
  display: flex;
  gap: var(--v-rhythm-3);

  &__icon {
    width: 48px;
    height: 48px;

    flex-shrink: 0;

    fill: var(--gray700);
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-1);
  }

  &__title {
    @extend .subtitle-2;
    color: var(--gray900);
    word-break: break-all;
  }

  &__data {
    @extend .caption-1;
    color: var(--gray500);
  }

  &__dot {
    padding: 0 var(--v-rhythm-2);
  }

  @include phones {
    &__icon {
      width: 32px;
      height: 32px;
    }

    &__info {
      gap: 2px;
    }
  }
  .message__file & {
    max-width: calc(90%);
    &__info {
      max-width: calc(100% - 48px);
    }
    &__title {
      white-space: nowrap;
      max-width: calc(100%);
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
