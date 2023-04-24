<template>
  <picture class="simple-picture" @click="$emit('onClick')">
    <template v-for="(item, i) in mediaArray">
      <source
        v-if="item.webpSrc"
        :media="item.media"
        type="image/webp"
        :srcset="webpSrcset(item.webpSrc, item.webpSrc2x)"
        :key="i"
      />
      <source
        :media="item.media"
        :type="`image/${getType(item.src)}`"
        :srcset="srcset(item.src, item.src2x)"
        :key="i + 'a'"
      />
    </template>

    <source
      v-if="webpSrc"
      type="image/webp"
      :srcset="webpSrcset(webpSrc, webpSrc2x)"
    />
    <source
      v-if="src"
      :type="`image/${getType(src)}`"
      :srcset="srcset(src, src2x)"
    />

    <img class="simple-picture__img" :src="source" :alt="src ? alt : ''" />
  </picture>
</template>

<script>
export default {
  name: "SimplePicture",

  components: {},

  data() {
    return {};
  },

  props: {
    alt: {
      type: String,
      required: false,
      default: "",
    },

    src: {
      type: String,
      required: false,
      default: "../img/icons/avatar-plug.svg",
    },

    src2x: {
      type: String,
      required: false,
      default: "",
    },

    webpSrc: {
      type: String,
      required: false,
      default: "",
    },

    webpSrc2x: {
      type: String,
      required: false,
      default: "",
    },

    mediaArray: {
      type: Array,
      required: false,
      default: function () {
        return [];
      },
    },
  },

  computed: {
    source() {
      return this.src ? this.src : `/img/icons/avatar-plug.svg`;
    },
  },

  methods: {
    getType(src) {
      return src.split(".").pop();
    },

    srcset(src, src2x) {
      return src2x ? `${src}, ${src2x} 2x` : src;
    },

    webpSrcset(webpSrc, webpSrc2x) {
      return webpSrc2x ? `${webpSrc}, ${webpSrc2x} 2x` : webpSrc;
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-picture {
  display: block;

  // background-color: var(--red500);
  // background-image: url("~@/assets/images/icons/avatar-plug.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  &__img {
    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;
  }
}
</style>