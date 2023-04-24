<template>
  <div class="app-avatar">
    <SimplePicture class="app-avatar__photo" :src="newAvatar" :alt="alt" />
    <div class="app-avatar__change">
      <label class="app-avatar__label">
        <input
          class="visually-hidden"
          ref="input"
          type="file"
          @change="setImage"
          :accept="accept" />
        <span class="app-avatar__pen" v-bind:class="{ empty: !newAvatar }">
          <UserIcons :iconName="'pen'" class="app-avatar__pen-icon" /> </span
      ></label>
      <div class="app-avatar__hover-layer">
        <UserIcons
          class="app-avatar__hover-layer-icon"
          :iconName="'add-photo'"
        />
        <span class="app-avatar__hover-layer-title">Загрузить фото</span>
        <span class="app-avatar__hover-layer-info"
          >Максимальный размер: 5&nbsp;Мб</span
        >
      </div>
      <transition name="fade">
        <AppModal v-if="isOpenPopup" @onClose="closePopup" :maxWidth="'480'">
          <div
            class="app-avatar__popup app-avatar__popup--cropper cropper"
            :class="{ loading: isLoading }"
            v-if="openPopupIt === 'cropper'"
          >
            <VueCropper
              class="cropper__img"
              ref="cropper"
              :src="imgSrc"
              :aspect-ratio="1 / 1"
              alt="Source Image"
            />
            <div class="cropper__controls">
              <button
                class="cropper__control"
                @click="rotateLeft"
                type="button"
              >
                <svg class="cropper__control-icon">
                  <use :xlink:href="makeIconPath('rotate-left')"></use>
                </svg>
                <span>повернуть влево</span>
              </button>
              <button
                class="cropper__control"
                @click="rotateRight"
                type="button"
              >
                <svg class="cropper__control-icon">
                  <use :xlink:href="makeIconPath('rotate-right')"></use>
                </svg>
                <span>повернуть вправо</span>
              </button>
              <button class="cropper__control" @click="flipY" type="button">
                <svg class="cropper__control-icon">
                  <use :xlink:href="makeIconPath('flip-horizontal')"></use>
                </svg>
                <span>отразить по горизонтали</span>
              </button>
              <button class="cropper__control" @click="flipX" type="button">
                <svg class="cropper__control-icon">
                  <use :xlink:href="makeIconPath('flip-vertical')"></use>
                </svg>
                <span>отразить по вертикали</span>
              </button>
            </div>
            <div class="cropper__btns">
              <button class="primary-btn" @click="sendForm">
                <span>Сохранить</span>
              </button>
              <button class="secondary-btn" @click="closePopup">
                <span>Отменить</span>
              </button>
            </div>
          </div>

          <div
            class="app-avatar__popup app-avatar__popup--error-size"
            v-if="openPopupIt === 'errorSize'"
          >
            <div class="app-avatar__popup-content">
              <span class="app-avatar__popup-title"
                >Выбранный файл слишком большой</span
              >
              <span class="app-avatar__popup-description"
                >Пожалуйста, загрузите изображение весом до 5 Мб</span
              >
            </div>
            <div class="app-avatar__popup-btns">
              <button class="primary-btn" @click="$refs.input.click()">
                <span>Загрузить фото</span>
              </button>
              <button class="secondary-btn" @click="closePopup">
                <span>Отменить</span>
              </button>
            </div>
          </div>

          <div
            class="app-avatar__popup app-avatar__popup--error-change"
            v-if="openPopupIt === 'errorChange'"
          >
            <div class="app-avatar__popup-content">
              <span class="app-avatar__popup-title">Произошла ошибка</span>
              <span class="app-avatar__popup-description"
                >Пожалуйста, попробуйте еще раз</span
              >
            </div>
            <div class="app-avatar__popup-btns">
              <button class="primary-btn" @click="$refs.input.click()">
                <span>Загрузить фото</span>
              </button>
              <button class="secondary-btn" @click="closePopup">
                <span>Отменить</span>
              </button>
            </div>
          </div>
        </AppModal>
      </transition>
    </div>
  </div>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
import VueCropper from "vue-cropperjs";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import SimplePicture from "@/components/UI/SimplePicture.vue";

export default {
  name: "AppAvatar",

  components: {
    VueCropper,
    AppModal,
    SimplePicture,
  },

  props: {
    src: {
      type: String,
      required: false,
      default: "",
    },

    alt: {
      type: String,
      required: false,
      default: "",
    },

    url: {
      type: String,
      required: false,
      default: "",
    },
  },

  data() {
    return {
      imgSrc: "",
      tmpPhoto: "",
      isOpenPopup: false,
      openPopupIt: "",
      isLoading: false,
      accept: ".jpg, .jpeg, .png",
    };
  },

  computed: {
    newAvatar() {
      return this.tmpPhoto ? this.tmpPhoto : this.src;
    },
  },

  methods: {
    makeIconPath(iconName) {
      return `../img/icons/sprites/cropper-icons.svg#${iconName}`;
    },

    setImage(e) {
      let isAcceptableExt = true;

      if (this.accept.indexOf(e.target.files[0].type.split("/")[1]) === -1) {
        isAcceptableExt = false;
      }

      if (!isAcceptableExt) {
        alert("Загрузите изображение в формате " + this.accept);
        return;
      } else {
        const file = e.target.files[0];
        this.isOpenPopup = true;

        if (file.size > 5242880) {
          this.openPopupIt = "errorSize";
          return;
        }

        this.openPopupIt = "cropper";
        this.firstFile = file;
        if (!isAcceptableExt) {
          alert("Загрузите изображение в формате " + this.accept);
          return;
        }
        if (typeof FileReader === "function") {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.imgSrc = event.target.result;
            this.$refs.cropper.replace(event.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          console.log("FileReader API не поддерживается устройством");
        }
      }
    },

    rotateLeft() {
      this.$refs.cropper.rotate(-90);
    },

    rotateRight() {
      this.$refs.cropper.rotate(90);
    },

    flipY() {
      this.$refs.cropper.scale(-1, 1);
    },

    flipX() {
      this.$refs.cropper.scale(1, -1);
    },

    sendForm() {
      let cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();

      let dataUrl = cropImg.split(",");
      let base64 = dataUrl[1];
      let mime = dataUrl[0].match(/:(.*?);/)[1];
      let bin = atob(base64);
      let length = bin.length;
      let buf = new ArrayBuffer(length);
      let arr = new Uint8Array(buf);

      bin.split("").forEach((e, i) => (arr[i] = e.charCodeAt(0)));
      let newImage = new File([buf], this.firstFile.name, { type: mime });

      let formData = new FormData();
      formData.append("PERSONAL_PHOTO", this.firstFile);
      formData.append("UF_CROPPED_PHOTO", newImage);

      if (this.url) {
        this.changePhoto(formData, cropImg);
      } else {
        this.emitPhoto(newImage, cropImg);
      }
    },

    async changePhoto(formData, cropImg) {
      try {
        this.isLoading = true;
        await axios({
          method: "post",
          url: `mobileapp/api/user/changePhoto`,
          data: formData,
        });

        // Обновляем данные пользователя
        this.updataCurrentUser();

        this.tmpPhoto = cropImg;
        this.closePopup();
      } catch (error) {
        this.openPopupIt = "errorChange";
        this.$refs.input.value = null;
      } finally {
        this.isLoading = false;
      }
    },

    async updataCurrentUser() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/footerheader/`,
        });

        const currentUser = Object.values(response.data)[0];

        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      } catch (error) {
        console.log(error);
      }
    },

    emitPhoto(newImage, cropImg) {
      this.tmpPhoto = cropImg;
      this.closePopup();

      this.$emit("onLoad", {
        data: newImage,
      });
    },
    closePopup() {
      this.isOpenPopup = false;
      this.$refs.input.value = null;
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
.app-avatar {
  position: relative;

  &__photo {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    object-position: center;
    object-fit: cover;
  }

  &__change {
  }

  &__label {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;

    cursor: pointer;

    @include hover {
      & + .app-avatar__hover-layer {
        opacity: 1;
      }
      .app-avatar__pen {
        opacity: 0;
      }
    }

    @mixin hover {
      @media (hover: hover) {
        &:active {
          & + .app-avatar__hover-layer {
            opacity: var(--active-opacity);
          }
        }
      }
    }
  }

  &__pen {
    position: absolute;
    top: 16px;
    right: 16px;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;

    border-radius: 8px;
    fill: #fff;
    background-color: rgba(#445562, 0.3);
    transition: 0.3s opacity ease;

    &.empty {
      background-color: var(--red900);
    }
    &-icon {
      width: 16px;
      height: 16px;
    }
  }

  &__hover-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: var(--v-rhythm-2);

    padding: var(--v-rhythm-2);

    color: var(--white900);
    text-align: center;

    @include transition();

    opacity: 0;

    &::before {
      content: "";

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background-color: var(--gray700);
      opacity: 0.3;
      border-radius: 8px;
    }

    &-icon,
    &-title,
    &-info {
      position: relative;
    }

    &-icon {
      width: 48px;
      height: 48px;
      fill: var(--white900);
    }

    &-title {
      @extend .h3;
    }

    &-info {
      @extend .body-2;
    }
  }

  &__popup {
    width: 100%;

    &--cropper {
      max-width: 320px;
    }

    &--error-size,
    &--error-change {
      max-width: 464px;
    }

    &__content {
      color: var(--gray900);

      *:last-child {
        margin-bottom: 0;
      }
    }

    &-title,
    &-description {
      display: block;
    }

    &-title {
      margin-bottom: var(--v-rhythm-4);

      @extend .h3;
    }

    &-description {
      @extend .body-2;
    }

    &-btns {
      margin-top: var(--v-rhythm-8);

      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--v-rhythm-4);
    }
  }

  @include phones {
    &__pen {
      padding: 10px;

      &-icon {
        width: 24px;
        height: 24px;
      }
    }
  }
}

.cropper {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__img {
    margin-bottom: var(--v-rhythm-6);
  }

  &__controls {
    margin-bottom: var(--v-rhythm-8);

    display: flex;
    gap: var(--v-rhythm-2);
  }

  &__control {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--v-rhythm-2);

    width: 74px;

    @extend .caption-1;
    color: var(--red900);
    text-align: center;

    @include transition();

    &:active {
      opacity: var(--active-opacity);
    }

    &-icon {
      width: 48px;
      height: 48px;
    }
  }

  &__btns {
    display: flex;
    gap: var(--v-rhythm-4);
    align-items: center;
  }

  @include phones {
    &__img {
      // Сделано, что бы не было вертикального скролла. Из высоты окна браузера вычитается высота попапа (за исключением cropper).
      height: calc(100vh - 268px);
      max-height: 320px;
    }

    &__controls {
      gap: var(--v-rhythm-1);
    }

    &__control {
      width: 64px;

      &-icon {
        width: 40px;
        height: 40px;
      }
    }
  }
}
</style>
