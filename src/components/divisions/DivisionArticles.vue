<template>
  <div class="division-articles" :class="{ loading: isLoading }">
    <div class="division-articles__nav" v-show="hasNav">
      <CarouselBtn
        class="division-articles__nav-btn"
        :prevNext="'prev'"
        :id="'division-articles-prev'"
        ref="btnPrev"
      />
      <CarouselBtn
        class="division-articles__nav-btn"
        :prevNext="'next'"
        :id="'division-articles-next'"
        ref="btnNext"
      />
    </div>

    <Swiper
      class="division-articles__swiper swiper"
      v-if="articles.length > 0"
      :options="swiperOption"
      @ready="checkControls"
    >
      <div
        class="division-articles__swiper-slide swiper-slide"
        v-for="slide in articles"
        :key="slide.ID"
      >
        <SlideCard
          class="division-articles__slide-card"
          :title="slide.NAME"
          :id="slide.ID"
          @onClick="openModal"
        />
      </div>
    </Swiper>

    <div
      class="division-articles__pagination"
      v-show="hasPagination"
      id="division-articles-pagination"
      ref="pagination"
    ></div>

    <!-- Модалка -->
    <transition name="fade">
      <PagesСontentModal
        class="division-articles__modal"
        :pageId="pageId"
        :isVisible="modalIsOpen"
        @onClose="closeModal"
      />
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import { Swiper } from "vue-awesome-swiper";
import PagesСontentModal from "@/components/modals/pages-content-modal/PagesСontentModal.vue";
import SlideCard from "@/components/carousels/SlideCard.vue";
import CarouselBtn from "@/components/UI/CarouselBtn.vue";

export default {
  name: "DivisionArticles",

  components: {
    Swiper,
    PagesСontentModal,
    SlideCard,
    CarouselBtn,
  },

  props: {
    depId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      hasNav: false,
      hasPagination: false,

      isLoading: false,

      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 16,
        observer: true,
        pagination: {
          el: "#division-articles-pagination",
          clickable: true,
          type: "bullets",
        },
        navigation: {
          nextEl: "#division-articles-next",
          prevEl: "#division-articles-prev",
        },
        breakpoints: {
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
          },
          // when window width is >= 1300px
          1300: {
            slidesPerView: 3,
          },
        },
      },

      articles: [],

      modalIsOpen: false,
      pageId: "",
    };
  },

  computed: {},

  methods: {
    async getArticles() {
      try {
        this.isLoading = true;
        this.articles = [];
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/contentPage/list?depId=${this.depId}`,
        });

        this.articles = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    openModal(id) {
      this.pageId = id;
      this.modalIsOpen = true;
    },

    closeModal() {
      this.modalIsOpen = false;
    },

    checkControls() {
      this.hasNav = !(
        this.checkClass(this.$refs.btnPrev.$el, "swiper-button-disabled") &&
        this.checkClass(this.$refs.btnNext.$el, "swiper-button-disabled")
      );

      this.hasPagination = this.$refs.pagination.children.length > 1;
    },

    checkClass(el, className) {
      return el.classList.contains(className);
    },
  },

  watch: {},

  mounted() {
    this.getArticles();
  },
};
</script>

<style scoped lang="scss">
.division-articles {
  position: relative;

  &__nav {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    transform: translateY(-100%);

    display: flex;
    gap: var(--v-rhythm-2);
  }

  &__nav-btn {
  }

  &__swiper {
    margin: -16px -8px;
    padding: 16px 8px;
  }

  &__swiper-slide {
    height: auto;
  }

  &__slide-card {
    height: 100%;
  }

  &__pagination {
    margin-top: var(--v-rhythm-4);
  }

  &__modal {
  }
}
</style>