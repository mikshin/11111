<template>
  <WidgetWrapper
    :iconName="'question-mark'"
    :title="'Вопрос руководителю'"
    :textBtn="'Все вопросы'"
    @clickWidgetBtn="goToAll"
  >
    <div class="questions-widget__wrapper" :class="{ loading: isLoading }">
      <Swiper
        :options="swiperOption"
        class="swiper questions-widget__item"
        style="margin: 10px 0px"
      >
        <!-- <swiper-slide></swiper-slide> -->
        <SwiperSlide
          v-for="item in fetchedQuestions"
          :key="item.ID"
          class="swiper-slide"
        >
          <QuestionCard :card="item" />
        </SwiperSlide>
      </Swiper>
      <div
        class="questions-widget__btn-wrapper"
        v-show="fetchedQuestions.length > 1"
      >
        <CarouselBtn
          :prevNext="'prev'"
          :id="'questions-widget-prev'"
          :transparent="true"
          @onClick="decrease"
        />

        <div
          class="questions-widget__counter"
          :id="`q_widget_pagination`"
          ref="pagination"
        ></div>
        <CarouselBtn
          :prevNext="'next'"
          :id="'questions-widget-next'"
          :transparent="true"
          @onClick="increase"
        />
      </div>
      <div class="questions-widget__modal_btn_wrapper">
        <AskQuestionButton
          @openModalDialog="toggleModal"
          :title="'Задать свой вопрос'"
        />
      </div>
    </div>
    <transition name="fade">
      <AskQuestionModal v-if="isModalVisible" @closeModal="toggleModal" />
    </transition>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";
import AskQuestionModal from "@/components/modals/AskQuestionModal.vue";
import AskQuestionButton from "@/components/pages/AskManager/AskQuestionButton.vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import CarouselBtn from "@/components/UI/CarouselBtn.vue";
import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import QuestionCard from "@/components/widgets/question-list-widget/QuestionCard.vue";
export default {
  name: "QuestionListWidget",

  components: {
    WidgetWrapper,
    CarouselBtn,
    Swiper,
    SwiperSlide,
    QuestionCard,
    AskQuestionModal,
    AskQuestionButton,
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
      isModalVisible: false,
      swiperOption: {
        allowTouchMove: false,
        slidesPerView: 1,
        spaceBetween: 16,
        loop: false,
        observer: true,
        pagination: {
          el: `#q_widget_pagination`,
          type: "fraction",
        },
        navigation: {
          nextEl: "#questions-widget-next",
          prevEl: "#questions-widget-prev",
        },
      },
      fetchedQuestions: [],
      isLoading: true,
      counter: 1,
    };
  },

  computed: {
    totalItems() {
      return this.fetchedQuestions.length;
    },
  },

  methods: {
    goToAll() {
      this.$router.push("/questions");
    },

    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    },

    async getQuestionList() {
      try {
        this.isLoading = true;
        const response = await axios.get("/mobileapp/api/question/listWidget");
        if (response.data.data) {
          this.fetchedQuestions = response.data.data;
          this.isLoading = false;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    increase() {
      this.counter < this.totalItems
        ? (this.counter += 1)
        : (this.coutner = this.totalItems);
    },
    decrease() {
      this.counter > 1 ? (this.counter -= 1) : (this.coutner = 1);
    },
  },

  watch: {},

  mounted() {
    this.getQuestionList();
  },
};
</script>

<style scoped lang="scss">
.questions-widget {
  &__wrapper {
    padding: var(--v-rhythm-4);
  }
  &__btn-wrapper {
    margin-top: var(--v-rhythm-3);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__modal_btn_wrapper {
    margin-top: var(--v-rhythm-4);
  }
  &__counter {
    @extend .body-1;
    color: var(--red900);
    width: 80%;
    display: flex;
    justify-content: center;
  }
}
</style>