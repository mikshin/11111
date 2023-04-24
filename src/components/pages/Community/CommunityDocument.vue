<template>
  <div class="document__wrapper">
    <div class="document__content-side">
      <div v-if="user" class="document__image-wrapper" @click="toLK(user.ID)">
        <tippy
          class="info-tooltip"
          animation="fade"
          arrow
          theme="light"
          :touch="false"
          :flipOnUpdate="true"
        >
          <template v-slot:trigger>
            <SimplePicture class="document__image" :src="user.USER_PHOTO" />
            <UserIcons
              class="document__image-label"
              v-if="user.VACATION"
              :iconName="'vacation-label'"
            />
            <UserIcons
              class="document__image-label"
              v-else-if="user.FIRED"
              :iconName="'fired-label'"
            />
          </template>
          <div class="document__tooltip-content">
            {{ user.FULL_NAME }}
          </div>
        </tippy>
      </div>
      <div class="document__file-wrapper">
        <AppFile
          class="document__app-file"
          :fileTitle="document.FILE.originalName"
          :fileSize="document.FILE.fileSize"
          :fileExtension="document.FILE.extension"
          :fileDate="document.DATE_CREATE"
        />
      </div>
    </div>
    <div class="document__actions-side">
      <a class="document__btn" :href="`${datFileUrl(document.FILE.fileLink)}`">
        <UserIcons class="document__btn-icon" :iconName="'download'" />
      </a>
      <!-- <a
        class="document__btn document__btn--eye"
        v-if="hasButtonEye"
        :href="datFileUrl(document.FILE.fileLink)"
        target="_blank"
      >
        <UserIcons class="document__btn-icon" :iconName="'eye-on'" />
      </a> -->
      <!-- <span v-if="canBeEdited"> edit </span>
      <span v-if="canBeDeleted"> delete </span> -->

      <div class="document__btns-edit" v-if="rights && rights.length > 0">
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
  </div>
</template>

<script>
// import axios from "axios";
import AppFile from "@/components/UI/document/AppFile.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import FunctionBtn from "@/components/UI/FunctionBtn.vue";
export default {
  name: "CommunityDocument",

  components: { SimplePicture, AppFile, FunctionBtn },

  props: {
    document: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: false,
    },
    rights: {
      type: [Array, null],
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    hasButtonEye() {
      let extension = this.document.FILE.extension.toLowerCase();
      if (
        extension === "png" ||
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "gif" ||
        extension === "svg" ||
        extension === "webp" ||
        extension === "pdf"
      ) {
        return true;
      } else {
        return false;
      }
    },

    datFileUrl() {
      // корректировк адреса для локалхоста
      const getHostame = window.location.hostname === window.location.hostname;

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

  methods: {
    toLK(id) {
      this.$router.push(`/lk?=${id}`);
    },

    onDelete() {
      this.$emit("onDelete", this.document.ID);
    },
    onEdit() {
      this.$emit("onEdit", this.document.ID);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.document {
  &__wrapper {
    padding: {
      top: var(--v-rhythm-3);
      right: var(--v-rhythm-6);
      bottom: var(--v-rhythm-3);
      left: var(--v-rhythm-3);
    }
    background-color: var(--white900);
    border-bottom: 2px solid var(--gray300);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-rhythm-6);
    width: 100%;
    @include transition();

    @include hover {
      background-color: var(--gray200);
      @include box-sh(1px, var(--gray300));

      .document__actions-side {
        opacity: 1;
      }
    }

    @include no-hover {
      background-color: var(--white900);
    }

    &:last-child {
      border-color: #0000;
    }
  }
  &__tooltip-content {
    @extend .caption-1;
    padding: var(--v-rhythm-1) var(--v-rhythm-2);
  }
  &__content-side {
    display: flex;
    align-items: center;
  }
  &__actions-side {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-6);

    @include transition();
    opacity: 0;

    @include no-hover {
      opacity: 1;
    }
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
  &__btns-edit {
    display: flex;
    gap: var(--v-rhythm-6);
  }
  &__btn {
    @include transition();
    cursor: pointer;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
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
  &__image-wrapper {
    position: relative;

    width: 40px;
    height: 40px;

    cursor: pointer;
    margin-right: var(--v-rhythm-2);
    flex-shrink: 0;
  }
  &__image {
    width: 100%;
    height: 100%;

    border-radius: 20px;
    overflow: hidden;
  }
  &__image-label {
    position: absolute;
    top: -2px;
    left: -2px;

    width: 14px;
    height: 14px;
  }
  &__file-wrapper {
    //width: calc(100% - 50px);
    width: 100%;
  }
}
@media (max-width: 768px) {
  .document {
    &__wrapper {
      padding: {
        top: var(--v-rhythm-1);
        right: var(--v-rhythm-2);
        bottom: var(--v-rhythm-1);
        left: var(--v-rhythm-1);
      }
    }
    &__actions-side {
      gap: var(--v-rhythm-1);
    }
    &__app-file {
      align-items: center;
    }
    &__btns-edit {
      gap: var(--v-rhythm-1);
    }
    &__file-wrapper {
      width: 80%;
    }
    &__btn {
      width: 22px;
      height: 22px;
    }
  }
}
</style>
