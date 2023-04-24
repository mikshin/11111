<template>
  <AppPage class="my-services">
    <div class="my-services__widget-list">
      <template v-for="(widget, i) in widgets">
        <Payroll
          class="my-services__widget"
          :name="'Расчетный лист'"
          v-if="widget.type === 'payroll_lk'"
          :key="i"
        />
        <VacationWidget v-if="widget.type === 'vacation'" :key="i + 1" :userID="currentUser.ID"/>
        <ServicesWidget v-if="widget.type === 'popular_service'" :key="i + 2" />
        <WidgetBanners
          class="my-services__widget my-services__widget--banners"
          v-if="widget.type === 'banner_lk'"
          dataFetchPath="/mobileapp/api/banners/lkWidget"
          variant="narrow"
          :key="i + 3"
        ></WidgetBanners>
        <PPEWidget v-if="widget.type === 'siz'" :key="i + 4" />
      </template>
    </div>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import Payroll from "@/components/widgets/lkPayroll.vue";
import VacationWidget from "@/components/widgets/vacation-widget/VacationWidget.vue";
import ServicesWidget from "@/components/widgets/services-widget/ServicesWidget.vue";
import WidgetBanners from "@widgets/WidgetBanners.vue";
import PPEWidget from "@/components/widgets/ppe-widget/PPEWidget.vue";

export default {
  name: "PageMyServices",

  components: {
    AppPage,
    Payroll,
    VacationWidget,
    ServicesWidget,
    WidgetBanners,
    PPEWidget,
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
      widgets: [],
    };
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  methods: {
    loadWidgets() {
      axios.get("/mobileapp/api/widget/?type=lk").then((response) => {
        this.widgets = response.data;
        // console.log(response.data);
      });
    },
  },

  watch: {},

  mounted() {
    this.loadWidgets();
  },
};
</script>

<style scoped lang="scss">
.my-services {
  &__widget-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--v-rhythm-8);
  }

  &__widget {
    &--banners {
      min-height: 600px;
    }
  }

  @include laptop {
    &__widget-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--v-rhythm-6);
    }
  }

  @include phones {
    &__widget-list {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap: var(--v-rhythm-4);
    }
  }
}
</style>