<template>
  <div class="lk" :key="ID">
    <div class="lk__container container">
      <Breadcrumbs />
      <div class="main-title">
        {{ this.$route.name }}
        <button class="secondary-btn" @click="logout">
          <span>Выйти</span>
        </button>
      </div>

      <LkCard class="lk__lk-card" :isMine="myProfile" :id="ID" />

      <span ref="test"></span>
      <ForNewEmployee
        v-if="currentUser.IS_NEW_EMPLOYEE && myProfile"
        :sliderCardsInfo="sliderCardsInfo"
      />

      <div class="lk__widgets">
        <template v-for="(widget, i) in widgets">
          <ThanksWidgetTabs
            class="lk__widgets-thanks"
            v-if="widget.type === 'graduate_lk' && myProfile"
            :key="i"
            :name="widget.name"
          />
          <Payroll
            v-else-if="widget.type === 'payroll_lk' && myProfile"
            :key="i"
            :name="widget.name"
          />
          <BirthdaysWidgetTabs
            v-else-if="widget.type === 'birthday_lk' && myProfile"
            :key="i"
            :name="widget.name"
          />
          <MyCalendarWidget
            v-else-if="widget.type === 'calendar_lk' && myProfile"
            :key="i"
            :name="widget.name"
          />
          <Structure
            v-else-if="widget.type === 'orgstructure_lk'"
            :key="i"
            :name="widget.name"
            :ID="ID"
          />
          <Polls
            v-else-if="widget.type === 'vote_lk' && myProfile"
            :name="widget.name"
            :key="i"
          />
          <ServicesWidget
            v-if="widget.type === 'popular_service' && myProfile"
            :key="i"
          />
          <WidgetBanners
            class="lk__widgets-banners"
            v-if="widget.type === 'banner_lk' && myProfile"
            dataFetchPath="/mobileapp/api/banners/lkWidget"
            variant="narrow"
            :key="i"
          ></WidgetBanners>
          <VacationWidget
            v-if="widget.type === 'vacation'"
            :userID="ID"
            :key="i"
          />
          <PPEWidget v-if="widget.type === 'siz' && myProfile" :key="i" />
          <DocumentsWidget
            v-if="widget.type === 'my_document' && myProfile"
            :key="i"
          ></DocumentsWidget>
        </template>
      </div>
    </div>

    <ToTop />
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { db } from "../db";

import Breadcrumbs from "@UI/breadcrumbs.vue";
import ToTop from "@UI/ToTop.vue";

import LkCard from "@components/person-cards/LkCard.vue";
import WidgetBanners from "@widgets/WidgetBanners.vue";
import ThanksWidgetTabs from "@widgets/ThanksWidgetTabs.vue";
import Payroll from "@widgets/lkPayroll.vue";
import Structure from "@widgets/lkStructure.vue";
import Polls from "@widgets/sPoll.vue";
import ForNewEmployee from "@widgets/ForNewEmployee.vue";
import BirthdaysWidgetTabs from "@widgets/BirthdaysWidgetTabs.vue";
import MyCalendarWidget from "@widgets/my-calendar-widget/MyCalendarWidget.vue";
import ServicesWidget from "@widgets/services-widget/ServicesWidget.vue";
import VacationWidget from "@widgets/vacation-widget/VacationWidget.vue";
import PPEWidget from "@widgets/ppe-widget/PPEWidget.vue";
import DocumentsWidget from "@widgets/DocumentsWidget.vue";

export default {
  name: "PageLk",

  components: {
    ThanksWidgetTabs,
    Breadcrumbs,
    Payroll,
    Structure,
    MyCalendarWidget,
    Polls,
    LkCard,
    BirthdaysWidgetTabs,
    ForNewEmployee,
    ToTop,
    ServicesWidget,
    VacationWidget,
    PPEWidget,
    DocumentsWidget,
    WidgetBanners,
  },

  data() {
    return {
      sliderCardsInfo: {
        name: "Новому сотруднику",
        url: "/mobileapp/api/newEmployee/linkLk",
        detailUrl: "/mobileapp/api/new_employee/getDetailInfoLink?id=",
      },
      myProfile: false,
      profile: {},
      contact: {},
      widgets: [],
      department: {},
    };
  },

  computed: {
    ID() {
      return this.$route.fullPath.split("#")[0].slice(5);
    },

    ...mapGetters(["isAuth"]),

    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  methods: {
    ...mapActions(["fetchAuth"]),

    logout() {
      this.$router.push("/");
      db.user.where("id").equals(this.currentUser.ID).delete();
      this.fetchAuth(false);

      localStorage.removeItem("currentUser");
    },

    chechMyProfile() {
      if (this.ID === this.currentUser.ID) return true;

      return false;
    },
    loadWidgets() {
      axios
        .get(`/mobileapp/api/widget/?type=lk&userId=${this.ID}`)
        .then((response) => {
          this.widgets = response.data;
        });
    },

    getData() {
      this.myProfile = this.chechMyProfile();
      this.loadWidgets();
    },
  },

  watch: {
    ID() {
      this.getData();
    },
  },

  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.lk {
  &__lk-card {
    margin-bottom: var(--v-rhythm-8);
  }

  &__profile {
    display: grid;
    grid-template-columns: auto 437px;
    margin-bottom: var(--v-rhythm-8);
  }

  &__widgets {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--v-rhythm-8);
  }

  &__widgets-banners {
    min-height: 600px;
  }

  &__widgets-thanks {
    // Выравниваем виджеты по высоте
    @media screen and (max-width: 1272px) {
      ::v-deep {
        .thanks-widget-tabs__main {
          max-height: 452px;
        }
      }
    }

    @include laptop {
      ::v-deep {
        .thanks-widget-tabs__main {
          max-height: 476px;
        }
      }
    }

    @media screen and (max-width: 810px) {
      ::v-deep {
        .thanks-widget-tabs__main {
          max-height: 452px;
        }
      }
    }

    @include phones {
      ::v-deep {
        .thanks-widget-tabs__main {
          max-height: 476px;
        }
      }
    }
  }

  @include desktop {
    &__profile {
      grid-template-columns: 1fr;
      margin-bottom: var(--v-rhythm-4);
    }

    &__widgets {
      gap: var(--v-rhythm-4);
    }
  }

  @include laptop {
    &__widgets {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @include phones {
    &__widgets {
      grid-template-columns: 100%;
    }
  }
}
.profile + .profile {
  border-left: 0;
}

// TODO: удалить
.main-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
