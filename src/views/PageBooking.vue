<template>
  <AppPage class="page-booking">
    <MainSidebar class="page-booking__main-sidebar">
      <template #main>
        <div class="page-booking__main" :class="{ loading: isLoading }">
          <div class="page-booking__main-top">
            <InputSelectV2
              class="page-booking__select-office"
              v-if="selectOffice"
              :input="selectOffice"
              @onChange="officeChange"
              @getThisData="getOfficeDefault"
            />

            <SliderCalendar
              class="page-booking__slider-calendar"
              :showLabelToday="true"
              @emitDate="changeDate"
            />
          </div>

          <AppBooking
            class="page-booking__app-booking"
            :class="{ loading: appBookingIsLoading }"
            v-if="office && bookingList.length"
            :bookingList="bookingList"
            @onDelete="openDeleteModal"
            @onEdit="openEditModal"
          />

          <span
            class="page-booking__text-defult page-text-default"
            v-else-if="!office"
            >Выберите офис</span
          >

          <span
            class="page-booking__text-defult page-text-default"
            v-else-if="office && !bookingList.length"
            >В выбранном офисе нет переговорных</span
          >
        </div>
      </template>
      <template #sidebar>
        <div class="page-booking__sidebar">
          <button
            class="page-booking__sidebar-btn primary-btn"
            type="button"
            @click="openAddModal"
          >
            Бронировать переговорную
          </button>

          <BookingConventions class="page-booking__conventions" />
        </div>
      </template>
    </MainSidebar>

    <transition name="fade">
      <ConfirmModal
        :isVisible="сonfirmModalIsOpen"
        :confirmText="'Удалить бронирование?'"
        :confirmTextBtn="'Да, удалить'"
        :requestParameters="{
          method: 'post',
          url: `/mobileapp/api/calendar/booking/delete`,
          data: {
            eventId: currentItemId,
          },
        }"
        @closeConfirmModal="closeConfirmModal"
        @confirmSuccess="confirmSuccess"
        @confirmError="confirmError"
      />
    </transition>

    <transition name="fade">
      <SuccessModal
        v-if="successModalIsVisible"
        :successText="`Бронирование удалено`"
        @onClose="closeSuccessModal"
      />
    </transition>

    <transition name="fade">
      <ErrorModal
        v-if="errorModalIsVisible"
        :hasRepeatBtn="false"
        :btnBackText="`Закрыть`"
        @onClose="errorModalIsVisible = false"
      >
        <!-- Сюда можно выводить текст ошибки -->
        <template #error></template>
      </ErrorModal>
    </transition>

    <transition name="fade">
      <AddEvent
        :isVisible="addModalIsOpen"
        :isEdit="isEdit"
        :isBooking="true"
        :eventId="currentItemId"
        :eventData="eventData"
        :eventMembers="eventMembers"
        @onClose="closeAddModal"
        @updataEventList="updataEventList"
      />
    </transition>
  </AppPage>
</template>

<script>
import axios from "axios";

import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import InputSelectV2 from "@/components/UI/inputs/InputSelectV2";
import SliderCalendar from "@/components/UI/SliderCalendar.vue";
import BookingConventions from "@/components/booking/BookingConventions.vue";
import AppBooking from "@/components/booking/app-booking/AppBooking.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";
import AddEvent from "@/components/calendar/add-event-modal/AddEvent.vue";

export default {
  name: "PageBooking",

  components: {
    AppPage,
    MainSidebar,
    InputSelectV2,
    SliderCalendar,
    BookingConventions,
    AppBooking,
    ConfirmModal,
    SuccessModal,
    ErrorModal,
    AddEvent,
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
      isLoading: false,
      appBookingIsLoading: false,
      eventData: {},
      eventMembers: [],
      eventMembersEnd: true,

      selectOffice: null,
      office: null,

      date: null,
      bookingList: [],

      currentItemId: "",
      сonfirmModalIsOpen: false,
      successModalIsVisible: false,
      errorModalIsVisible: false,

      addModalIsOpen: false,

      isEdit: false,
    };
  },

  computed: {},

  methods: {
    closeAddModal() {
      if (this.isEdit) {
        this.eventData = {};
        this.eventMembers = [];
        this.eventMembersEnd = true;
      }

      this.addModalIsOpen = false;
    },

    updataEventList() {
      this.getBookingList();
      this.closeAddModal();
    },

    openAddModal() {
      this.currentItemId = "";
      this.isEdit = false;
      this.addModalIsOpen = true;
    },

    // Получаем данные для селекта с офисами
    async getSelectOffice() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/calendar/booking/offices`,
        });
        this.selectOffice = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    // Срабатывает, когда появляется селект с офисом
    getOfficeDefault(data) {
      if (data.newValue[0]) {
        this.office = data.newValue[0];
        this.getBookingList();
      }
    },

    // Срабатывает при изменении селекта с офисом
    officeChange(data) {
      if (data.newValue[0]) {
        this.office = data.newValue[0];
        this.getBookingList();
      } else {
        this.office = null;
      }
    },

    // Срабатывает при изменении даты
    changeDate(date) {
      this.date = date.toLocaleDateString("ru-RU");

      this.getBookingList();
    },

    // Получаем данные для бронирования
    async getBookingList() {
      if (this.date && this.office) {
        try {
          this.isLoading = true;
          const response = await axios({
            method: "post",
            url: `/mobileapp/api/calendar/booking`,
            data: {
              filter: {
                OFFICE: this.office.code,
                DATE: this.date,
              },
            },
          });

          this.bookingList = response.data.data || [];
          this.isDisabledSubmit = true;
        } catch (error) {
          console.log(error);
        } finally {
          this.isLoading = false;
        }
      }
    },

    openDeleteModal(id) {
      this.currentItemId = id;
      this.сonfirmModalIsOpen = true;
    },

    closeConfirmModal() {
      this.сonfirmModalIsOpen = false;
    },

    confirmSuccess() {
      this.closeConfirmModal();
      this.successModalIsVisible = true;

      setTimeout(() => {
        if (this.successModalIsVisible) {
          this.closeSuccessModal();
        }
      }, 3000);
    },

    confirmError() {
      this.closeConfirmModal();
      this.errorModalIsVisible = true;
    },

    closeSuccessModal() {
      this.successModalIsVisible = false;
      this.getBookingList();
    },

    async openEditModal(id) {
      try {
        this.appBookingIsLoading = true;
        this.isEdit = true;
        this.currentItemId = id;

        await this.getEventData();
        await this.getEventMembers();

        this.addModalIsOpen = true;
      } catch (error) {
        alert(
          "При получении данных произошла ошибка. Повторите попытку через некоторое время или обратитесь к администратору."
        );
      } finally {
        this.appBookingIsLoading = false;
      }
    },

    async getEventData() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/calendar/eventInfo?eventId=${this.currentItemId}`,
        });
        this.eventData = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getEventMembers() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/calendar/eventMemberList?eventId=${this.currentItemId}&startFrom=${this.eventMembers.length}&count=100`,
        });
        if (response.data) {
          this.eventMembers = response.data.data;
          this.eventMembersEnd = response.data.end;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },

  watch: {},

  mounted() {
    this.getSelectOffice();
  },
};
</script>

<style scoped lang="scss">
.page-booking {
  &__main-sidebar {
  }

  &__main {
  }

  &__main-top {
    width: 100%;
    margin-bottom: var(--v-rhythm-5);

    display: flex;
    gap: var(--v-rhythm-8);
    align-items: center;
  }

  &__select-office {
    width: calc(320 * 100% / 1024);
  }

  &__slider-calendar {
    margin-left: auto;
  }

  &__app-booking {
  }

  &__sidebar {
  }

  &__sidebar-btn {
    margin-bottom: var(--v-rhythm-8);
  }

  &__conventions {
    margin-top: var(--v-rhythm-8);
  }

  @include phones {
    &__main-top {
      flex-direction: column-reverse;
      align-items: center;
      gap: var(--v-rhythm-5);
    }

    &__select-office {
      width: 100%;
    }

    &__slider-calendar {
      margin-left: unset;
    }
  }
}
</style>