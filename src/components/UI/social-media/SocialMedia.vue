<template>
  <ul class="social-media">
    <li
      class="social-media__item"
      v-for="(socialMedia, i) of socialMediaData"
      :key="i"
    >
      <a class="social-media__link" :href="socialMedia.LINK" target="_blank"
        ><social-media-icon
          class="social-media__icon"
          :socialName="socialMedia.TYPE"
          :iconSize="iconSize"
      /></a>
    </li>
  </ul>
</template>

<script>
import SocialMediaIcon from "./SocialMediaIcon.vue";

export default {
  name: "SocialMedia",

  components: { SocialMediaIcon },

  props: {
    socialMediaData: {
      type: Array,
      required: true,
    },
    iconSize: {
      type: Number,
      required: false,
      default: 40,
    },
  },

  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.social-media {
  display: flex;
  flex-wrap: wrap;
  gap: var(--v-rhythm-4);

  &__item {
    flex-shrink: 0;
  }

  &__link {
    @include transition();

    display: block;
    line-height: 0;

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__icon {
  }
}
</style>
