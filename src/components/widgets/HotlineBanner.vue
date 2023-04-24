<template>
  <WidgetBanner
    class="hotline-banner"
    :class="{
      loading: isLoading,
      'hotline-banner--narrow': isNarrowType,
    }"
    :name="bannerData.NAME"
    :text="bannerData.PREVIEW_TEXT"
    :backgroundImage="acitveImage"
    :variant="variant"
    :isClampText="false"
  >
    <template #under-text>
      <router-link to="/hotline" class="secondary-btn hotline-banner__link">{{
        bannerData.BUTTON_NAME
      }}</router-link>
    </template>
  </WidgetBanner>
</template>



<script>
import axios from "axios";

import WidgetBanner from "./WidgetBanner.vue";

export default {
  name: "HotlineBanner",

  components: {
    WidgetBanner,
  },

  props: {
    variant: {
      type: String,
      required: false,
      validator: (value) => ["narrow"].includes(value),
    },
  },

  data() {
    return {
      isLoading: true,
      bannerData: [],
    };
  },

  computed: {
    isNarrowType() {
      return this.variant === "narrow";
    },
    acitveImage() {
      return this.breakpoints.phones || this.isNarrowType
        ? this.bannerData.VERTICAL_IMAGE
        : this.bannerData.HORIZONTAL_IMAGE;
    },
    breakpoints() {
      return this.$store.getters.breakpoints;
    },
  },

  methods: {
    async getBannerData() {
      try {
        this.isLoading = true;
        const response = await axios.get(
          "/mobileapp/api/banners/hotLine/widget"
        );
        if (response) {
          this.bannerData = response.data.data;

          this.isLoading = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },

  watch: {},

  mounted() {
    this.getBannerData();
  },
};
</script>

<style scoped lang="scss">
.hotline-banner {
  &__link {
    max-width: 320px;
  }

  @mixin narrow-version {
    min-height: 388px;
  }

  &--narrow {
    @include narrow-version;
  }

  @include phones {
    @include narrow-version;
  }
}
</style>