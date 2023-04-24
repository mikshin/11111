<template>
  <div class="app-document" :class="{ 'app-document--disabled': disabled }">
    <AppFile
      class="app-document__app-file"
      :fileTitle="fileTitle"
      :fileSize="fileSize"
      :fileExtension="fileExtension"
      :fileDate="fileDate"
    />

    <div class="app-document__btns">
      <a
        class="app-document__btn app-document__btn--eye"
        v-if="hasButtonEye && !disabled"
        :href="datFileUrl(fileLink)"
        target="_blank"
      >
        <UserIcons
          class="app-document__btn-icon app-document__btn-icon"
          :iconName="'eye-on'"
        />
      </a>
      <a
        class="app-document__btn"
        v-if="!disabled"
        :href="datFileUrl(fileLink)"
        download
      >
        <UserIcons class="app-document__btn-icon" :iconName="'download'" />
      </a>
      <button
        class="app-document__btn"
        v-if="hasButtonCross && !disabled"
        @click="$emit('clickCross', fileId)"
      >
        <UserIcons class="app-document__btn-icon" :iconName="'X'" />
      </button>
    </div>
  </div>
</template>

<script>
import AppFile from "@/components/UI/document/AppFile.vue";

export default {
  name: "AppDocument",

  components: { AppFile },

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

    fileLink: {
      type: String,
      required: true,
    },

    fileDate: {
      type: String,
      required: false,
    },

    fileId: {
      type: Number,
      required: false,
    },

    hasButtonEye: {
      type: Boolean,
      required: false,
      default: false,
    },

    hasButtonCross: {
      type: Boolean,
      required: false,
      default: false,
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    datFileUrl() {
      // корректировк адреса для локалхоста
      const getHostame =
        window.location.hostname === "localhost"
          ? "test.naftgaz.hopper-it.ru"
          : window.location.hostname;

      const getProtocol = window.location.protocol;

      return (link) => {
        const linkParts = link.split("/");

        const ind = linkParts.indexOf("upload");

        ind !== -1 ? linkParts.splice(0, ind) : linkParts.splice(0, 1);
        const nl = new URL(
          `/${linkParts.join("/")}`,
          `${getProtocol}//${getHostame}`
        );

        return nl.href;
      };
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.app-document {
  &--disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  padding: {
    top: var(--v-rhythm-3);
    right: var(--v-rhythm-6);
    bottom: var(--v-rhythm-3);
    left: var(--v-rhythm-3);
  }

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--v-rhythm-6);

  @include transition();

  &:not(.app-document--disabled) {
    @include hover {
      background-color: var(--white900);
      @include box-sh(1px, var(--gray300));

      .app-document__btns {
        opacity: 1;
      }
    }

    @include no-hover {
      background-color: var(--white900);
    }
  }

  &__app-file {
  }

  &__btns {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-6);

    @include transition();
    opacity: 0;

    @include no-hover {
      opacity: 1;
    }
  }

  &__btn {
    @include transition();
    cursor: pointer;

    @include hover {
      .app-document__btn-icon {
        fill: var(--red900);
      }
    }

    &:active {
      opacity: var(--active-opacity);
    }

    &--eye {
      @include no-hover {
        display: none;
      }
    }
  }

  &__btn-icon {
    width: 24px;
    height: 24px;

    fill: var(--gray500);
    @include transition();
  }

  @include phones {
    padding-right: var(--v-rhythm-4);

    gap: var(--v-rhythm-4);

    background-color: var(--white900);

    &__btns {
      gap: var(--v-rhythm-4);
    }

    &__btn {
      &--eye {
        display: none;
      }
    }
  }
}
</style>