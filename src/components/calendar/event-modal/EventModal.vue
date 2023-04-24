<template>
  <AppModal
    class="event-modal"
    v-if="isVisible && !isLoading"
    @onClose="onClose"
    :maxWidth="'900'"
  >
    <div class="event-modal__conent" :class="{ loading: isUpdata }">
      <template v-if="eventData">
        <transition name="fade" v-if="isEditMode">
          <EventEditing
            class="event-modal__event-editing"
            @sendForm="sendForm"
            @cancel="isEditMode = false"
            :modalTitle="`Редактировать событие`"
            :eventData="eventData"
            :eventMembers="eventMembers"
            :isBooking="eventData.isBooking"
            :defaultFiles="eventData.file ? eventData.file : []"
          />
        </transition>
        <transition name="fade" v-else>
          <EventModalViewing
            class="event-modal__viewing"
            :eventData="eventData"
            :eventMembers="eventMembers"
            :eventMembersEnd="eventMembersEnd"
            :isLoadingMembers="isLoadingMembers"
            @uploadMembers="uploadMembers"
            @updateStatus="updateStatus"
            @deleteEvent="deleteModalIsVisible = true"
            @editEvent="isEditMode = true"
          />
        </transition>
      </template>
      <span class="event-modal__text-default" v-else
        >Нет доступа к просмотру события</span
      >
    </div>

    <transition name="fade">
      <EventModalDeleteModal
        class="event-modal__delete-modal"
        v-if="deleteModalIsVisible"
        :eventId="eventId"
        :eventName="eventData.name"
        @onClose="deleteModalIsVisible = false"
        @deleteEvent="deleteEvent"
      />
    </transition>
  </AppModal>
</template>

<script>
import axios from "axios";
import AppModal from "@/components/modals/AppModal.vue";
import EventModalViewing from "@/components/calendar/event-modal/EventModalViewing.vue";
import EventModalDeleteModal from "@/components/calendar/event-modal/EventModalDeleteModal.vue";
import EventEditing from "@/components/calendar/event-editing/EventEditing.vue";

export default {
  name: "EventModal",

  components: {
    AppModal,
    EventModalViewing,
    EventModalDeleteModal,
    EventEditing,
  },

  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },

    eventId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      isUpdata: false,

      eventData: null,
      eventMembers: [],
      eventMembersEnd: true,
      isEditMode: false,

      isLoadingMembers: false,

      deleteModalIsVisible: false,
    };
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  methods: {
    // Получаем данные
    async downloadData() {
      try {
        this.isLoading = true;
        this.clearMembers();
        await this.writeData();
      } finally {
        this.isLoading = false;
      }
    },

    async writeData() {
      const responseData = await this.getData();
      this.eventData = responseData;

      const responseMembers = await this.getMembers();
      if (responseMembers) {
        this.eventMembers = responseMembers.data;
        this.eventMembersEnd = responseMembers.end;
      } else {
        this.eventMembers = [];
        this.eventMembersEnd = true;
      }
    },

    async getData() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/calendar/eventInfo?eventId=${this.eventId}`,
        });
        return response.data;
      } catch (error) {
        return null;
      }
    },

    async getMembers() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/calendar/eventMemberList?eventId=${this.eventId}&startFrom=${this.eventMembers.length}&count=100`,
        });
        return response.data;
      } catch (error) {
        return null;
      }
    },

    async uploadMembers() {
      try {
        this.isLoadingMembers = true;
        const responseMembers = await this.getMembers();
        if (responseMembers) {
          this.eventMembers = [...this.eventMembers, ...responseMembers.data];
          this.eventMembersEnd = responseMembers.end;
        }
      } finally {
        this.isLoadingMembers = false;
      }
    },

    async updateStatus(status) {
      try {
        this.isLoadingMembers = true;
        await axios({
          method: "post",
          url: `/mobileapp/api/calendar/eventUpdateMemberStatus`,
          data: {
            eventId: this.eventId,
            status: status,
          },
        });

        const currentMember = this.eventMembers.find(
          (member) => member.ID === this.currentUser.ID
        );
        if (status === "Y") {
          currentMember.status = "подтверждено";
        } else if (status === "N") {
          currentMember.status = "отклонено";
        }
        const responseData = await this.getData();
        this.eventData = responseData;
      } catch (error) {
        alert(
          "Произошла ошибка! Попробуйте еще раз через некоторое время или обратитесь к администратору портала."
        );
      } finally {
        this.isLoadingMembers = false;
      }
    },

    clearMembers() {
      this.eventMembers = [];
      this.eventMembersEnd = true;
    },

    deleteEvent() {
      this.$emit("updataEventList");
    },

    // Обновляем событие
    async sendForm(dataForm) {
      try {
        this.isLoading = true;
        await axios({
          method: "post",
          url: `/mobileapp/api/calendar/eventUpdate?eventId=${this.eventId}`,
          data: dataForm,
        });
        this.isEditMode = false;
        this.downloadData();
        this.$emit("updataEventList");
      } catch (error) {
        alert("Произошла ошибка");
      } finally {
        this.isLoading = false;
      }
    },

    onClose() {
      this.isEditMode = false;
      this.$emit("onClose");
    },
  },

  watch: {
    eventId() {
      this.downloadData();
    },
  },

  mounted() {},
};
</script>

<style scoped lang="scss">
.event-modal {
  &__conent {
  }

  &__text-default {
    @extend .body-2;
    color: var(--gray900);
  }
}
</style>