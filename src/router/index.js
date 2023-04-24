import Vue from "vue";
import VueRouter from "vue-router";
import VueScrollTo from "vue-scrollto";
import { eventBus } from "@utils";

// !Название страниц должно начинаться с Page
import PageMain from "@views/PageMain.vue";
import PageLk from "@views/PageLk.vue";
import PageNews from "@views/PageNews.vue";
import PageSingleNews from "@views/PageSingleNews.vue";
import PageRatings from "@views/PageRatings.vue";
import PageNewStopCard from "@views/PageNewStopCard.vue";
import PagePolls from "@views/PagePolls.vue";
import PageKit from "@views/PageKit.vue";
import PageNotFound from "@views/PageNotFound.vue";
import PageSearch from "@views/PageSearch.vue";
import PageOrgstructure from "@views/PageOrgstructure.vue";
import PageBirthdays from "@views/PageBirthdays.vue";
import PageStopCards from "@views/PageStopCards.vue";
import PageStopCard from "@views/PageStopCard.vue";
import PageStopCardPrint from "@views/PageStopCardPrint.vue";
import PageMyTasks from "@views/PageMyTasks.vue";
import PageMyTask from "@views/PageMyTask.vue";
import PageAllDocuments from "@views/PageAllDocuments.vue";
import PageDivisions from "@views/PageDivisions.vue";
import PageProjectsShowcase from "@views/PageProjectsShowcase.vue";
import PageProject from "@views/PageProject.vue";
import PageEventCalendar from "@views/PageEventCalendar.vue";
import PagePhotoContest from "@views/PagePhotoContest.vue";
import PagePhotoContests from "@views/PagePhotoContests.vue";
import PageCommunities from "@views/PageCommunities.vue";
import PageCommunity from "@views/PageCommunity.vue";
import PageMessageCommunity from "@views/PageMessageCommunity.vue";
import PageManagerQuestion from "@views/PageManagerQuestion.vue";
import PageManagerQuestions from "@views/PageManagerQuestions.vue";
import PageEvent from "@views/PageEvent.vue";
import PageAdvertisements from "@views/PageAdvertisements.vue";
import PageAdvertisement from "@views/PageAdvertisement.vue";
import PageHotline from "@views/PageHotline.vue";
import PageAllServices from "@views/PageAllServices.vue";
import PageMyServices from "@views/PageMyServices.vue";
import PageTraining from "@views/PageTraining.vue";
import PageSelfTest from "@views/PageSelfTest.vue";
import PageFinishTest from "@views/PageFinishTest.vue";
import PageBooking from "@views/PageBooking.vue";
import PageTrainingСourse from "@views/PageTrainingCourse.vue";
import PageTrainingLesson from "@views/PageTrainingLesson.vue";
import PageNoAccess from "@views/PageNoAccess.vue";
import PageAbout from "@views/PageAbout.vue";

// Вложенные компоненты
import AppOrgstructure from "@components/pages/orgstructure/AppOrgstructure.vue";
import AppPhonebook from "@components/pages/orgstructure/AppPhonebook.vue";

Vue.use(VueRouter);

// ! имена страниц (name) используются для сбора статистики на странице поиска. При их изменении поправить там
const routes = [
  {
    path: "/",
    name: "Главная",
    component: PageMain,
  },
  {
    path: "/lk",
    name: "Личный кабинет",
    component: PageLk,
  },
  {
    path: "/news",
    name: "Все новости",
    component: PageNews,
  },
  {
    path: "/news/:catchAll(.*)*",
    name: "Новость",
    component: PageSingleNews,
  },
  {
    path: "/orgstructure",
    name: "Структура",
    component: PageOrgstructure,
    props: true,
    children: [
      {
        path: "phonebook",
        component: AppPhonebook,
        name: "Телефонный справочник",
      },
      {
        path: "/orgstructure/:catchAll(.*)*",
        component: AppOrgstructure,
        name: "Оргструктура",
      },
    ],
  },
  {
    path: "/divisions/*",
    name: "Подразделения",
    component: PageDivisions,
  },
  {
    path: "/stop_cards",
    name: "Стоп-карты",
    component: PageStopCards,
  },
  {
    path: "/stop_cards/new",
    name: "Новая Стоп-карта",
    component: PageNewStopCard,
  },
  {
    path: "/stop_cards/:stopCardId",
    name: "Стоп-карта",
    component: PageStopCard,
  },
  {
    path: "/stop_cards/:stopCardId/print",
    name: "Печать стоп-карты",
    component: PageStopCardPrint,
  },
  {
    path: "/photo_contests",
    name: "Конкурсы",
    component: PagePhotoContests,
  },
  {
    path: "/photo_contests/:id",
    name: "Конкурс",
    component: PagePhotoContest,
  },
  {
    path: "/communities",
    name: "Сообщества",
    component: PageCommunities,
  },
  {
    path: "/communities/:id",
    name: "Сообщество",
    component: PageCommunity,
  },
  {
    path: "/communities/:id/:idMessage",
    name: "Сообщение",
    component: PageMessageCommunity,
  },
  {
    path: "/kit",
    name: "Кит",
    component: PageKit,
  },
  {
    path: "/polls",
    name: "Все опросы",
    component: PagePolls,
  },
  {
    path: "/rating",
    name: "Рейтинги",
    component: PageRatings,
  },
  {
    path: "/birthdays",
    name: "Все дни рождения",
    component: PageBirthdays,
  },
  {
    path: "/calendar",
    name: "Календарь мероприятий",
    component: PageEventCalendar,
  },
  {
    path: "/calendar/booking",
    name: "Бронирование переговорных",
    component: PageBooking,
  },
  {
    path: "/calendar/:id",
    name: "Событие",
    component: PageEvent,
  },
  {
    path: "/page-search",
    name: "Поиск",
    component: PageSearch,
  },
  {
    path: "/my_tasks",
    name: "Мои задачи",
    component: PageMyTasks,
  },
  {
    path: "/my_tasks/:id",
    name: "Моя задача",
    component: PageMyTask,
  },
  {
    path: "/projects",
    name: "Витрина проектов",
    component: PageProjectsShowcase,
  },
  {
    path: "/projects/:catchAll(.*)*",
    name: "Проект",
    component: PageProject,
  },
  {
    path: "/all_documents",
    name: "Документы",
    component: PageAllDocuments,
  },
  {
    path: "/questions/:id",
    name: "Вопрос руководителю",
    component: PageManagerQuestion,
  },
  {
    path: "/questions",
    name: "Вопросы руководителю",
    component: PageManagerQuestions,
  },
  {
    path: "/advertisements",
    name: "Объявления",
    component: PageAdvertisements,
  },
  {
    path: "/advertisements/:id",
    name: "Объявление",
    component: PageAdvertisement,
  },
  {
    path: "/hotline",
    name: "Горячая линия",
    component: PageHotline,
  },
  {
    path: "/services",
    name: "Сервисы",
    component: PageAllServices,
  },
  {
    path: "/my_services",
    name: "Мои сервисы",
    component: PageMyServices,
  },
  {
    path: "/training",
    name: "Обучение",
    component: PageTraining,
  },
  {
    path: "/training/:coursId",
    name: "Курс",
    component: PageTrainingСourse,
  },
  {
    path: "/training/:coursId/:lessonId(e_[0-9]+)*",
    name: "Урок",
    component: PageTrainingLesson,
  },
  {
    path: "/training/:coursId/:testId(t_[0-9]+)",
    name: "Финальный тест",
    component: PageFinishTest,
  },
  {
    path: "/training/:coursId/:lessonId(e_[0-9]+)*/self_test",
    name: "Тест для самопроверки",
    component: PageSelfTest,
  },
  {
    path: "/about",
    name: "О компании",
    component: PageAbout,
  },
  {
    path: "/no_access",
    name: "Нет доступа",
    component: PageNoAccess,
    props: true,
  },
  {
    path: "/:catchAll(.*)*",
    name: "404",
    component: PageNotFound,
  },
];

let isFirstPageLoad = true;

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  // !TODO проблема - скролл отрабатывает раньше, чем прогружаются компоненты на странице
  scrollBehavior(to, from) {
    if (to.hash) {
      if (to.path === from.path && !isFirstPageLoad) {
        VueScrollTo.scrollTo(to.hash, { offset: -92, lazy: false });
      } else {
        eventBus.$once(`${to.hash}-mounted`, () => {
          VueScrollTo.scrollTo(to.hash, { offset: -92, lazy: false });
        });
      }
    }
    // else if (savedPosition) {
    //   console.log(savedPosition);
    //   VueScrollTo.scrollTo("#app", 500, {
    //     offset: savedPosition.y,
    //   });
    //   return savedPosition;
    // }
    else {
      VueScrollTo.scrollTo("#app");
    }

    if (isFirstPageLoad) {
      isFirstPageLoad = false;
    }
  },
});
export default router;
