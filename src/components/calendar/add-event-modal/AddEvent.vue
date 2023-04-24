<template>
  <AppModal
    class="add-event"
    v-if="isVisible"
    @onClose="closePopup"
    :maxWidth="'600'"
  >
    <EventEditing
      class="add-event__conent"
      :class="{ loading: isLoading }"
      :modalTitle="modalTitle"
      :isBooking="isBooking"
      :creator="currentUser"
      :eventData="isEdit ? eventData : null"
      :eventMembers="isEdit ? eventMembers : null"
      :defaultFiles="isEdit && eventData.file ? eventData.file : []"
      @sendForm="sendForm"
      @cancel="closePopup"
    />

    <transition name="fade">
      <EventModalErrorModal
        class="add-event__error-modal"
        v-if="errorModalIsVisible"
        :errorMessage="errorMessage"
        @onClose="errorModalIsVisible = false"
        @repeatSave="sendForm"
      />
    </transition>
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
import axios from "axios";
import EventModalErrorModal from "@/components/calendar/add-event-modal/EventModalErrorModal.vue";
import EventEditing from "@/components/calendar/event-editing/EventEditing.vue";

export default {
  name: "AddEvent",

  components: {
    AppModal,
    EventModalErrorModal,
    EventEditing,
  },

  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },

    isEdit: {
      type: Boolean,
      required: false,
      default: false,
    },

    isBooking: {
      type: Boolean,
      required: false,
      default: false,
    },

    eventId: {
      type: String,
      required: false,
    },

    eventData: {
      type: Object,
      required: false,
    },

    eventMembers: {
      type: Array,
      required: false,
    },
  },

  data() {
    return {
      isLoading: false,
      errorModalIsVisible: false,
      errorMessage: "",
    };
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },

    modalTitle() {
      if (this.isEdit) {
        return "Редактировать событие";
      } else {
        return this.isBooking ? "Бронировать переговорную" : "Новое событие";
      }
    },

    pushEventUrl() {
      if (this.isEdit) {
        return this.isBooking
          ? `/mobileapp/api/calendar/booking/edit?eventId=${this.eventId}`
          : `/mobileapp/api/calendar/eventUpdate?eventId=${this.eventId}`;
      } else {
        return this.isBooking
          ? `/mobileapp/api/calendar/booking/add`
          : `/mobileapp/api/calendar/eventAdd`;
      }
    },
  },

  methods: {
    closePopup() {
      this.$emit("onClose");
    },

    async sendForm(formData) {
      try {
        this.isLoading = true;

        const response = await this.pushEvent(formData);
        if (response.status === "error") {
          this.errorMessage = response.errorMessage;
          this.errorModalIsVisible = true;
        } else {
          this.updataEventList();
        }
      } finally {
        this.isLoading = false;
      }
    },

    async pushEvent(data) {
      try {
        const response = await axios({
          method: "post",
          url: this.pushEventUrl,
          data: data,
        });
        return response.data;
      } catch (error) {
        this.errorModalIsVisible = true;
      }
    },

    updataEventList() {
      this.$emit("updataEventList");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.add-event {
  &__conent {
  }
}
</style>