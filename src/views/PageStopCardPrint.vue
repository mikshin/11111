<template>
  <div class="page-stop-card">
    <AppPage
      class="page-stop-card__app-page"
      :class="{
        loading: isLoading,
      }"
      :pageTitle="pageTitle"
      :breadcrumbsDopName="breadcrumbsDopName"
    >
      <MainSidebar class="page-stop-card__main-sidebar">
        <template #main>
          <PrintIframe
            @afterprint="closePage"
            :src="stopCardBlobURL"
          ></PrintIframe>
        </template>
      </MainSidebar>
    </AppPage>
  </div>
</template>

<script>
import axios from "axios";

import { getBlobLinkFromFileLink } from "@utils";

import AppPage from "@UI/page/AppPage.vue";
import MainSidebar from "@UI/page/MainSidebar.vue";
import PrintIframe from "@UI/PrintFrame.vue";

export default {
  name: "PageStopCard",

  components: { AppPage, MainSidebar, PrintIframe },

  props: {},

  data() {
    return {
      id: null,
      isLoading: false,
      stopCardBlobURL: null,
    };
  },

  computed: {
    pageTitle() {
      return `${this.$route.name} №${this.id}`;
    },

    breadcrumbsDopName() {
      return ` №${this.$route.params.stopCardId}`;
    },
  },

  methods: {
    async printStopCard() {
      try {
        this.stopCardBlobURL = null;
        this.isLoading = true;
        const response = await axios.get(
          "/mobileapp/api/stopCardsDetail/export",
          {
            params: {
              stopCardId: this.id,
            },
          }
        );

        if (response.data) {
          this.stopCardBlobURL = await getBlobLinkFromFileLink(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    closePage() {
      // Событие afterprint или медиа-запрос просто не работают, когда window.print() вызывается из js
      let event = "mouseover";

      const handler = () => {
        // Make sure the event only happens once.
        window.removeEventListener(event, handler);

        window.close();
      };

      window.addEventListener(event, handler);
    },
  },

  mounted() {
    this.id = this.$route.params.stopCardId;

    this.printStopCard();
  },
};
</script>

<style scoped lang="scss"></style>
