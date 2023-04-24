<template>
  <div class="new-emp" ref="new_employee" v-if="cardItems.length">
    <!-- Тайтл -->
    <div class="new-emp__header">
      <h3 class="new-emp__title">{{ sliderCardsInfo.name }}</h3>
      <div class="slider-controls" v-if="showControls">
        <template>
          <div
            @click="$refs.swiper.swiperInstance.slidePrev()"
            class="swiper-button-prev"
          >
            <UserIcons :iconName="'arrow-left'" />
          </div>
        </template>
        <template>
          <div
            @click="$refs.swiper.swiperInstance.slideNext()"
            class="swiper-button-next"
          >
            <UserIcons :iconName="'arrow-right'" />
          </div>
        </template>
      </div>
    </div>

    <!-- Карусель -->
    <swiper :options="swiperOption" ref="swiper" class="swiper">
      <swiper-slide
        v-for="(item, index) in cardItems"
        :key="index"
        class="swiper-slide"
      >
        <div class="new-emp__card-item card-item" @click="showModal(item.ID)">
          <p class="card-item__title" v-if="item.NAME.length < maxNameLength">
            <span :title="item.NAME">{{ item.NAME }}</span>
          </p>
          <p class="card-item__title" v-else>
            <span :title="item.NAME">{{
              item.NAME.substring(0, maxNameLength) + "..."
            }}</span>
          </p>
          <button class="card-item__button">
            <UserIcons :iconName="'arrow-right'" />
          </button>
        </div>
      </swiper-slide>
      <div
        class="swiper-pagination"
        slot="pagination"
        v-show="showControls"
      ></div>
    </swiper>

    <!-- Модалка -->
    <transition name="fade">
      <NewEmployeeModal
        :recordId="recordId"
        :isVisible="isModalVisible"
        @onClose="isModalVisible = false"
        :detailUrl="sliderCardsInfo.detailUrl"
      />
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import NewEmployeeModal from "@/components/modals/NewEmployeeModal.vue";
import { mapGetters } from "vuex";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "ForNewEmployee",
  props: {
    sliderCardsInfo: Object,
  },
  components: {
    Swiper,
    SwiperSlide,
    NewEmployeeModal,
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      maxNameLength: 41,
      recordId: "",
      isModalVisible: false,
      cardItems: [],
      swiperOption: {
        slidesPerView: 0,
        spaceBetween: 18,
        notNextTick: true,
        loop: false,
        initialSlide: 0,
        speed: 800,
        direction: "horizontal",
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          type: "bullets",
        },
      },
    };
  },
  mounted() {
    if (this.browserWindowWidth < 450) {
      this.maxNameLength = 80;
    }
    axios.get(this.sliderCardsInfo.url).then((response) => {
      this.cardItems = response.data;
      this.scrollToWidget();
    });
    this.swiperOption.slidesPerView = this.slidesCount;
    //this.$refs.swiper.initSwiper();
  },
  computed: {
    showControls() {
      return this.cardItems.length > this.swiperOption.slidesPerView;
    },
    slidesCount() {
      if (this.browserWindowWidth > 1224) {
        return 5;
      } else if (this.browserWindowWidth > 1024) {
        return 4;
      } else if (this.browserWindowWidth > 700) {
        return 3;
      } else if (this.browserWindowWidth > 450) {
        return 2;
      } else {
        return 1;
      }
    },

    ...mapGetters(["browserWindowWidth"]),
  },
  methods: {
    showModal(taskId) {
      this.recordId = taskId;
      this.isModalVisible = true;
    },

    scrollToWidget() {
      if (this.$route.hash === "#new_employee") {
        setTimeout(() => {
          let position = this.$refs.new_employee.getBoundingClientRect().top;
          window.scrollTo({
            top: position - window.innerHeight / 3,
            behavior: "smooth",
          });
        }, 400);
      }
    },
  },
  watch: {
    slidesCount(newValue) {
      this.swiperOption.slidesPerView = newValue;
      this.$refs.swiper.destroySwiper();
      setTimeout(() => {
        this.$refs.swiper.initSwiper();
      }, 0);
    },
    browserWindowWidth(newValue) {
      if (newValue < 450) {
        this.maxNameLength = 80;
      } else {
        this.maxNameLength = 40;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.new-emp {
  margin-bottom: var(--v-rhythm-8);

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    @extend .h3;
    color: var(--gray500);
    margin-bottom: var(--v-rhythm-6);
  }
}

.slider-controls {
  display: flex;
  gap: var(--v-rhythm-2);

  .swiper-button-prev,
  .swiper-button-next {
    left: 0;
    right: 0;
    top: 0;
    margin: 0;
    cursor: pointer;
    position: relative;
    width: 32px;
    height: 32px;
    background-color: var(--gray500);
    border-radius: 100%;
    fill: var(--white900);
    transition: background-color 0.3s;

    .user-icons {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &:hover {
      background-color: var(--red900);
    }
  }
}

.swiper-pagination {
  --swiper-theme-color: var(--red900);
  position: relative;
  bottom: 0;
  margin-top: 16px;
}

.swiper-slide {
  height: auto;
}

.card-item {
  height: 100%;
  cursor: pointer;
  padding: 16px 20px;
  background-color: var(--red100);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 1px 1px 4px 0 rgba(9, 0, 109, 0.1);
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--red300);

    .card-item__button {
      background-color: var(--red700);
      border: 1px solid var(--red700);
      fill: var(--white900);
    }
  }

  &__title {
    @extend .subtitle-2;
    color: var(--gray900);
    word-break: break-word;
  }

  &__button {
    width: 38px;
    height: 38px;
    margin-left: 20px;
    fill: var(--red900);
    border-radius: 100%;
    border: 1px solid var(--red900);
    position: relative;
    transition: 0.3s;
    flex-shrink: 0;

    .user-icons {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>