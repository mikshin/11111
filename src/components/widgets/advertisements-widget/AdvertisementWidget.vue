<template>
  <WidgetWrapper
    v-if="fetchData.length > 0"
    :iconName="'stop'"
    :title="'Объявления'"
    :textBtn="'Все объявления'"
    @clickWidgetBtn="goToAll"
  >
    <div class="advertisements-widget__wrapper" :class="{ loading: isLoading }">
      <Swiper
        :options="swiperOption"
        class="swiper advertisements-widget__item"
      >
        <SwiperSlide
          v-for="item in fetchData"
          :key="item.ID"
          class="swiper-slide advertisements-widget__body"
        >
          <div class="advertisements-widget__header">
            {{ item.NAME }}
          </div>
          <div
            class="advertisements-widget__text"
            v-html="item.PREVIEW_TEXT"
          ></div>
          <div class="advertisements-widget__actions">
            <router-link
              class="advertisements-widget__link text-btn"
              :to="`/advertisements/${item.ID}`"
              >Перейти</router-link
            >
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="advertisements-widget__btns">
        <CarouselBtn
          :prevNext="'prev'"
          :id="'ads-widget-prev'"
          :transparent="true"
        />
        <CarouselBtn
          :prevNext="'next'"
          :id="'ads-widget-next'"
          :transparent="true"
        />
      </div>
    </div>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import CarouselBtn from "@/components/UI/CarouselBtn.vue";
export default {
  name: "AdvertisementWidget",

  components: {
    Swiper,
    SwiperSlide,
    WidgetWrapper,
    CarouselBtn,
  },

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {
      fetchData: [],
      isLoading: true,
      swiperOption: {
        allowTouchMove: false,
        slidesPerView: 1,
        spaceBetween: 16,
        loop: false,
        observer: true,

        navigation: {
          nextEl: "#ads-widget-next",
          prevEl: "#ads-widget-prev",
        },
      },
    };
  },

  computed: {},

  methods: {
    goToAll() {
      this.$router.push(`/advertisements`);
    },

    async getAdvertisements() {
      try {
        this.isLoading = true;
        const response = await axios.get("/mobileapp/api/advertising/widget");

        if (response.data) {
          this.fetchData = response.data.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {},

  mounted() {
    this.getAdvertisements();
  },
};
</script>

<style scoped lang="scss">
.advertisements-widget {
  &__wrapper {
    position: relative;
  }
  &__item {
    padding: var(--v-rhythm-6) var(--v-rhythm-4);
  }
  &__body {
    border-radius: var(--v-rhythm-2);
    background-color: var(--white900);
    padding: var(--v-rhythm-4);
  }
  &__header {
    @extend .subtitle-1;
  }
  &__text {
    @extend .caption-1;
    height: var(--v-rhythm-8);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &__actions {
    margin-top: var(--v-rhythm-4);
    display: flex;
    align-items: flex-start;
  }
  &__link {
  }
  &__btns {
    bottom: 38px;
    z-index: 1;
    right: 25px;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 0 var(--v-rhythm-4) var(--v-rhythm-4);
  }
}
</style>