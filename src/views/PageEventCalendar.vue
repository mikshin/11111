<template>
  <AppPage class="page-event-calendar">
    <MainSidebar class="page-event-calendar__main-sidebar">
      <template #main>
        <div class="page-event-calendar__main" id="calendar">
          <div class="page-event-calendar__main-header">
            <TabsNav
              class="page-event-calendar__main-tabs-nav"
              :tabs="tabsNav"
              :activeTabObj="activeTab"
              @changeTab="tabSwitch"
            />

            <CalendarDateControl
              class="page-event-calendar__main-date-control"
              @emitToggleDateByDay="toggleDateByDay"
              @emitToggleDateByMonth="toggleDateByMonth"
              :activeTab="activeTab"
              :todayFullDate="todayFullDate"
            />
          </div>

          <div class="page-event-calendar__main-wrapper">
            <transition name="fade">
              <div
                v-if="activeTab.name === 'Месяц'"
                class="page-event-calendar__main-month"
              >
                <div
                  class="
                    page-event-calendar__main-month-timeline
                    month-timeline
                  "
                >
                  <div
                    v-for="day in claendarDays"
                    :key="day"
                    class="month-timeline__item"
                  >
                    {{ day }}
                  </div>
                </div>

                <div
                  class="calendar__day__item fake"
                  v-for="f in fake"
                  :key="`${f}fakes`"
                ></div>

                <MonthCalendarItem
                  :loadingModalIsDone="loadingModalIsDone"
                  @emitShowModal="showDaysModal"
                  @emitGoToSingleDay="goToSingleDay"
                  v-for="day in daysInAMonth"
                  :class="{ 'calendar__day-tmpl__active': dayActive === day }"
                  :key="day"
                  :data="day"
                  :fakeEventList="fakeEventList"
                  :dayInfo="setDaysInfo(day)"
                  :loadingIsDone="loadingIsDone"
                />
              </div>

              <EventCalendarDay
                v-else
                class="page-event-calendar__main-day"
                :loadingDayIsDone="loadingDayIsDone"
                :data="dataForSingleDay"
                :date="todayFullDate"
                @updateTask="updateTask"
                @updataTaskList="update"
                @emmitEventClick="openEventModal"
              />
            </transition>
          </div>
        </div>
      </template>

      <template #sidebar>
        <div class="page-event-calendar__sidebar">
          <div class="page-event-calendar__sidebar-btns">
            <button
              class="page-event-calendar__sidebar-btn primary-btn"
              @click="addModalIsOpen = true"
            >
              Создать событие
            </button>

            <router-link
              class="page-event-calendar__sidebar-btn secondary-btn"
              :to="'/calendar/booking'"
              >Забронировать переговорную</router-link
            >
          </div>

          <FilterTemplate
            class="page-event-calendar__sidebar-filter"
            ref="filter"
            :filter="filter"
            @onUpdate="updateFilter"
            @onChange="changeFilter"
          />
        </div>
      </template>
    </MainSidebar>

    <transition name="fade">
      <AddEvent
        class="page-event-calendar__add-event"
        :isVisible="addModalIsOpen"
        @onClose="addModalIsOpen = false"
        @updataEventList="updataEventList"
      />
    </transition>

    <transition name="fade">
      <EventModal
        class="page-event-calendar__modal"
        :isVisible="eventModalIsOpen"
        :eventId="currentEvent.id || ''"
        :isBooking="currentEvent.isBooking || false"
        @onClose="eventModalIsOpen = false"
        @updataEventList="updataEventList"
      />
    </transition>
  </AppPage>
</template>

<script>
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import FilterTemplate from "@/components/UI/filter/FilterTemplate.vue";
import MonthCalendarItem from "../components/calendar/monthCalendarItem.vue";
import EventCalendarDay from "@/components/calendar/EventCalendarDay.vue";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import CalendarDateControl from "../components/calendar/calendarDateControl.vue";

import axios from "axios";

import AddEvent from "@/components/calendar/add-event-modal/AddEvent.vue";
import EventModal from "@/components/calendar/event-modal/EventModal.vue";

import VueScrollTo from "vue-scrollto";

export default {
  name: "PageEventCalendar",

  components: {
    AppPage,
    MainSidebar,
    MonthCalendarItem,
    EventCalendarDay,
    CalendarDateControl,
    FilterTemplate,
    TabsNav,

    AddEvent,
    EventModal,
  },

  data() {
    return {
      addModalIsOpen: false,
      eventModalIsOpen: false,
      currentEvent: {},
      eventModalIsBooking: false,

      activeUserID: null,
      filterEmployeeLoading: false,
      filterCompanies: [],
      filterSettings: {},

      loadingTimeMin: 1000,
      dataForSingleDay: [],
      dayViaCalendar: false,
      loadingModalIsDone: false,
      loadingDayIsDone: false,
      fakeEventList: {},
      loadingIsDone: false,
      tabsNav: [
        {
          name: "Месяц",
        },
        {
          name: "День",
        },
      ],
      activeTab: {
        name: "Месяц",
      },
      filter: [
        {
          type: "radio",
          placeholder: "Отображать Дни рождения",
          required: false,
          name: "birthdayShow",
          placeholderShown: true,
          radioValue: [
            {
              name: "Да",
              code: "Y",
              checked: true,
            },
            {
              name: "Нет",
              code: "N",
            },
          ],
        },
        {
          type: "radio",
          placeholder: "Отображать События компании",
          required: false,
          name: "CompanyShow",
          placeholderShown: true,
          radioValue: [
            {
              name: "Да",
              code: "Y",
            },
            {
              name: "Нет",
              code: "N",
            },
          ],
        },
        {
          name: "COMPANY",
          placeholder: "Компания",
          type: "select",
          multiple: true,
          selectValue: [],
        },
        {
          name: "EMPLOYEE",
          placeholder: "Сотрудник",
          type: "search-persons",
          multiple: false,
        },
      ],
      filterAPI: [],
      daysInAMonth: null,
      fake: 0,
      claendarDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      dayActive: null,
      todayFullDate: new Date(),
      dataFullMonth: [],
    };
  },

  async created() {
    const companies = await axios({
      method: "post",
      url: "/mobileapp/api/search/filter/",
      data: {
        ENTITY: "users",
      },
    });
    const mappedCompanies = companies.data[0].selectValue;

    const filterCompaniesNames = this.filter.find((i) => i.name === "COMPANY");
    filterCompaniesNames.selectValue = mappedCompanies;

    const initialDate = new Date();
    const postData = this.setPostData(initialDate);
    this.todayFullDate.setDate(1);
    this.todayFullDate = new Date(this.todayFullDate);
    this.controlDate();
    this.dataFullMonth = await this.fetchData(
      "post",
      "/mobileapp/api/calendar/eventListMonth",
      postData,
      "loadingIsDone"
    );
    const newFilterApi = await axios.get(
      "/mobileapp/api/calendar/eventListFilter"
    );
    this.filterAPI = newFilterApi.data;
  },

  methods: {
    openEventModal(e) {
      this.currentEvent = e;
      this.eventModalIsOpen = true;
    },

    async updataEventList() {
      this.eventModalIsOpen = false;
      this.addModalIsOpen = false;

      if (this.activeTab.name === "День") {
        const postData = this.setPostData(this.todayFullDate, "day");
        this.dataForSingleDay = await this.fetchData(
          "post",
          "/mobileapp/api/calendar/eventListDay",
          postData,
          "loadingDayIsDone"
        );
      }
      if (this.activeTab.name === "Месяц") {
        const postData = this.setPostData(this.todayFullDate);

        this.dataFullMonth = await this.fetchData(
          "post",
          "/mobileapp/api/calendar/eventListMonth",
          postData,
          "loadingIsDone"
        );
      }
    },

    updateTask(obj) {
      let task = this.dataForSingleDay.taskList.find(
        (item) => item.id === obj.taskId
      );

      task.status = obj.status;
    },

    async update() {
      const postData = this.setPostData(this.todayFullDate, "day");
      this.dataForSingleDay = await this.fetchData(
        "post",
        "/mobileapp/api/calendar/eventListDay",
        postData,
        "loadingDayIsDone"
      );
    },

    getTodaysDay(today, activeDate) {
      const todayMY = today.toLocaleString("ru-RU", {
        month: "long",
        year: "numeric",
      });
      const activeDayMY = activeDate.toLocaleString("ru-RU", {
        month: "long",
        year: "numeric",
      });
      if (todayMY === activeDayMY) {
        return today.getDate();
      }
    },

    controlDate() {
      const today = new Date();
      const lastDayOfMonth = new Date(
        this.todayFullDate.getFullYear(),
        this.todayFullDate.getMonth() + 1,
        0
      );
      this.dayActive = this.getTodaysDay(today, this.todayFullDate);
      this.fake = new Date(this.todayFullDate);
      this.fake.setDate(1);
      this.fake = this.fake.getDay() === 0 ? 6 : this.fake.getDay() - 1;
      this.daysInAMonth = lastDayOfMonth.getDate();
    },

    async toggleDateByMonth(direction) {
      const dr = direction === "prev" ? -1 : 1;
      this.todayFullDate.setMonth(this.todayFullDate.getMonth() + dr);
      this.todayFullDate = new Date(this.todayFullDate);
      this.controlDate();
      const postData = this.setPostData(this.todayFullDate);
      this.dataFullMonth = await this.fetchData(
        "post",
        "/mobileapp/api/calendar/eventListMonth",
        postData,
        "loadingIsDone"
      );
    },

    async toggleDateByDay(direction) {
      const dr = direction === "prev" ? -1 : 1;
      this.todayFullDate.setDate(this.todayFullDate.getDate() + dr);
      this.todayFullDate = new Date(this.todayFullDate);
      this.controlDate();
      const postData = this.setPostData(this.todayFullDate, "day");
      this.dataForSingleDay = await this.fetchData(
        "post",
        "/mobileapp/api/calendar/eventListDay",
        postData,
        "loadingDayIsDone"
      );
    },

    async showDaysModal(e) {
      this.modalId = this.data;
      const postData = {
        birthdayShow: this.filterSettings.birthdayShow,
        CompanyShow: this.filterSettings.CompanyShow,
        userId: this.currentUser,
        day: this.setModalFullDate(e).date,
        month: this.setModalFullDate(e).month,
        year: this.setModalFullDate(e).year,
      };
      this.filterSettings.companyID &&
        (postData.companyID = this.filterSettings.companyID);
      this.fakeEventList = await this.fetchData(
        "post",
        "/mobileapp/api/calendar/eventListDay",
        postData,
        "loadingModalIsDone"
      );
    },

    goToSingleDay(data) {
      this.todayFullDate.setDate(data);
      this.todayFullDate = new Date(this.todayFullDate);
      this.dayViaCalendar = true;
      this.activeTab = { name: "День" };
      VueScrollTo.scrollTo(`#calendar`, { offset: -150 });
    },

    async tabSwitch(e) {
      if (e.name === "День" && !this.dayViaCalendar) {
        const postData = this.setPostData(this.todayFullDate, "day");
        this.todayFullDate = new Date();
        this.dataForSingleDay = await this.fetchData(
          "post",
          "/mobileapp/api/calendar/eventListDay",
          postData,
          "loadingDayIsDone"
        );
      }
      if (e.name === "День" && this.dayViaCalendar) {
        const postData = this.setPostData(this.todayFullDate, "day");
        this.dataForSingleDay = await this.fetchData(
          "post",
          "/mobileapp/api/calendar/eventListDay",
          postData,
          "loadingDayIsDone"
        );
      }
      if (e.name === "Месяц") {
        const postData = this.setPostData(this.todayFullDate);
        this.todayFullDate = new Date();
        this.dataFullMonth = await this.fetchData(
          "post",
          "/mobileapp/api/calendar/eventListMonth",
          postData,
          "loadingIsDone"
        );
        this.dayViaCalendar = false;
      }
      this.activeTab = e;
      this.controlDate();
    },

    async fetchData(method, url, data, loader) {
      this.loaderName(loader, false);
      const loadingStart = Date.now();
      const res = await axios({
        method: method,
        url: url,
        data: data,
      });
      const loadingEnd = Date.now();
      const timeout =
        loadingEnd - loadingStart <= this.loadingTimeMin
          ? this.loadingTimeMin
          : 0;
      setTimeout(() => {
        this.loaderName(loader, true);
      }, timeout);
      return res.data;
    },

    loaderName(name, done) {
      if (name == "loadingIsDone") {
        this.loadingIsDone = done;
      }
      if (name == "loadingDayIsDone") {
        this.loadingDayIsDone = done;
      }
      if (name == "loadingModalIsDone") {
        this.loadingModalIsDone = done;
      }
    },

    setPostData(data, period = "month") {
      if (period === "day") {
        const postData = {
          birthdayShow: this.filterSettings.birthdayShow,
          CompanyShow: this.filterSettings.CompanyShow,
          userId: this.currentUser,
          day: data.getDate(),
          month: Number(data.getMonth()) + 1,
          year: data.getFullYear(),
        };
        this.filterSettings.companyID &&
          (postData.companyID = this.filterSettings.companyID);
        return postData;
      } else {
        const postData = {
          birthdayShow: this.filterSettings.birthdayShow,
          CompanyShow: this.filterSettings.CompanyShow,
          userId: this.currentUser,
          day: data.getDate(),
          month: Number(data.getMonth()) + 1,
          year: data.getFullYear(),
        };
        this.filterSettings.companyID &&
          (postData.companyID = this.filterSettings.companyID);
        return postData;
      }
    },

    changeFilter(data) {
      const filterSettings = {};
      // передаем просмотр др
      if (data.data.birthdayShow === "Y") {
        filterSettings.birthdayShow = data.data.birthdayShow;
      } else {
        filterSettings.birthdayShow = undefined;
      }

      // передаем события компании
      if (data.data.CompanyShow === "Y") {
        filterSettings.CompanyShow = data.data.CompanyShow;
      } else if (data.data.CompanyShow === "N") {
        filterSettings.CompanyShow = data.data.CompanyShow;
      } else {
        filterSettings.CompanyShow = undefined;
      }

      // проверка на заполненность компании
      if (data.data.COMPANY) {
        filterSettings.companyID = data.data.COMPANY;
      } else {
        filterSettings.companyID = undefined;
      }

      // добавление сотрудника
      if (data.data.EMPLOYEE) {
        if (data.data.EMPLOYEE[0]) {
          this.activeUserID = data.data.EMPLOYEE[0].ID;
        } else {
          this.activeUserID = JSON.parse(localStorage.currentUser).ID;
        }
      } else {
        this.activeUserID = JSON.parse(localStorage.currentUser).ID;
      }
      this.filterSettings = filterSettings;
      // this.filterCompanies = data.data.COMPANY;
      // filterSettings.birthdayShow = data.data.birthdayShow ?? "Y";
      // filterSettings.CompanyShow = data.data.CompanyShow ?? "Y";
      // const compID = this.filterCompanies && Object.assign({}, this.filterCompanies);
      // compID && (filterSettings.companyID = compID);
      // const { companyID, ...rest } = filterSettings;
      // if (companyID) {
      //   this.filterSettings = filterSettings;
      // } else {
      //   this.filterSettings = rest;
      // }
    },

    async updateFilter(data) {
      this.changeFilter(data);
      if (this.activeTab.name === "День") {
        const postData = this.setPostData(this.todayFullDate, "day");
        this.dataForSingleDay = await this.fetchData(
          "post",
          "/mobileapp/api/calendar/eventListDay",
          postData,
          "loadingDayIsDone"
        );
      }
      if (this.activeTab.name === "Месяц") {
        const postData = this.setPostData(this.todayFullDate);
        this.dataFullMonth = await this.fetchData(
          "post",
          "/mobileapp/api/calendar/eventListMonth",
          postData,
          "loadingIsDone"
        );
      }
    },

    async fetchMembersToFilter(arr) {
      this.filterEmployeeLoading = true;
      if (!arr) {
        this.employee.selectValue = [];
      } else {
        const comps = arr.map((i) => `company[]=${i}`).join("&");
        const members = await axios(
          `/mobileapp/api/user/findByFIOCompany?query=""&${comps}`
        );
        const mappedMembers = members.data.employee.map((i) => {
          return {
            code: i.ID,
            label: `${i.LAST_NAME} ${i.NAME} ${i.SECOND_NAME}`,
          };
        });
        this.employee.selectValue = mappedMembers;
      }
      this.filterEmployeeLoading = false;
    },
  },

  computed: {
    currentUser() {
      return this.activeUserID ?? JSON.parse(localStorage.currentUser).ID;
    },
    setDaysInfo() {
      return (e) => {
        const day = e < 10 ? `0${e}` : e;
        return this.dataFullMonth[day];
      };
    },
    setModalFullDate() {
      return (day) => {
        const fulldate = new Date(this.todayFullDate);
        fulldate.setDate(day);
        return {
          date: fulldate.getDate(),
          month: fulldate.getMonth() + 1,
          year: fulldate.getFullYear(),
        };
      };
    },
  },

  watch: {
    filterCompanies(newVal, oldVal) {
      if (!Array.isArray(newVal) || !Array.isArray(oldVal)) {
        this.fetchMembersToFilter(newVal);
        return;
      }
      const qwe = newVal.every((item, indx) => item === oldVal[indx]);
      if (!qwe) {
        this.fetchMembersToFilter(newVal);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-event-calendar {
  &__main-sidebar {
  }

  &__main {
  }

  &__main-header {
    width: 100%;
    margin-bottom: var(--v-rhythm-6);

    display: flex;
    align-items: flex-end;
    gap: var(--v-rhythm-6);
  }

  &__main-tabs-nav {
    flex-grow: 1;
  }

  &__main-date-control {
    flex-shrink: 0;
  }

  &__main-wrapper {
    width: 100%;
    overflow-y: auto;
  }

  &__main-month {
    width: 100%;

    display: flex;
    flex-wrap: wrap;
  }

  &__main-month-timeline {
    margin-bottom: var(--v-rhythm-2);
  }

  &__main-day {
  }

  &__sidebar {
  }

  &__sidebar-btns {
    width: 100%;
    margin-bottom: var(--v-rhythm-8);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__sidebar-btn {
    width: 100%;
  }

  &__sidebar-filter {
    width: 100%;
  }

  @include phones {
    &__main-month {
      min-width: 767px;
    }
  }
}

.calendar__day__item {
  position: relative;
  padding: 8px 10px;
  width: calc(100% / 7);
  height: 220px;
  background-color: #fff;
  border: 1px solid var(--gray100);
  &.fake {
    background-color: var(--gray100);
    pointer-events: none;
  }
}

.month-timeline {
  width: 100%;
  display: flex;

  &__item {
    width: calc(100% / 7);
    padding: 0 10px;

    @extend .caption-2;
    color: var(--gray500);
  }
}
</style>