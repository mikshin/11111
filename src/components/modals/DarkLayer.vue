<template>
  <!-- !Имя класс используется в onClose . mousedown используется для того, что бы модалка не закрывалась, когда пользователь выделяет что то мышкой и отпускает кнопку на серой зоне -->
  <div class="dark-layer" @mousedown="onClose" :ref="'darkLayer'">
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isMobileDevice } from "@/assets/scripts/scripts.js";

export default {
  name: "DarkLayer",

  components: {},

  props: {},

  data() {
    return {
      body: document.body,
      wrapper: document.querySelector(".app"),
      appHeader: document.querySelector(".app-header"),
      classDisableScroll: "disable-scroll",
      pagePosition: null,
    };
  },

  methods: {
    disableScroll() {
      if (
        !this.body.dataset.popupCount ||
        this.body.dataset.popupCount === "0"
      ) {
        this.paddingRightControl(this.paddingRight);

        this.pagePosition = window.scrollY;
        this.body.classList.add(this.classDisableScroll);
        this.body.dataset.position = this.pagePosition;
        this.body.style.top = `${-this.pagePosition}px`;
        // Чинит баг в мозиле, когда шапка в позиции стики улетает наверх.
        this.appHeader.style.position = "relative";
        this.appHeader.style.top = `${this.pagePosition}px`;

        //popupCount нужен для того, что бы можно было открывать несколько попапов поверх друг друга
        this.body.dataset.popupCount = 1;
      } else {
        this.body.dataset.popupCount++;
      }
    },

    enableScroll() {
      if (this.body.dataset.popupCount === "1") {
        this.paddingRightControl("");

        this.pagePosition = parseInt(this.body.dataset.position, 10);
        this.body.style.top = "";
        this.appHeader.style.position = "";
        this.appHeader.style.top = "";
        this.body.classList.remove(this.classDisableScroll);
        window.scroll({ top: this.pagePosition, left: 0 });
        this.body.removeAttribute("data-position");

        this.body.dataset.popupCount--;
      } else {
        this.body.dataset.popupCount--;
      }
    },

    paddingRightControl(paddingRight) {
      this.body.style.paddingRight = paddingRight;
    },

    onClose(e) {
      // На мобилке модалка не должна закрываться при клике на серую область. Так же добавлена проверка, что бы закрывалась нуная модалка, если открыты несколько
      if (
        !isMobileDevice() &&
        e.target.classList.contains("dark-layer") &&
        this.$refs.darkLayer === e.target
      )
        this.$emit("onClose");
    },
  },

  computed: {
    ...mapGetters(["browserWindowWidth"]),

    paddingRight() {
      return `${this.browserWindowWidth - this.wrapper.offsetWidth}px`;
    },
  },

  mounted() {
    this.disableScroll();
  },

  destroyed() {
    this.enableScroll();
  },
};
</script>

<style lang="scss" scoped>
.dark-layer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: calc(var(--header) + 1);

  width: 100vw;
  // Нельзя ставить, сломается сайдбар чата
  // height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.25);

  cursor: pointer;
}
</style>