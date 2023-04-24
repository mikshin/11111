<template>
  <AppConventions
    class="booking-conventions"
    :title="'Условные обозначения'"
    :conventionsList="conventionsList"
  />
</template>

<script>
import AppConventions from "@/components/conventions/AppConventions.vue";
export default {
  name: "BookingConventions",

  components: {
    AppConventions,
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
      conventionsList: [
        {
          color: "var(--gray300)",
          title: "Время свободно",
          description: "можно бронировать",
        },
        {
          color: "var(--chatPrimary)",
          title: "Моё бронирование",
          description: "можно отменить и редактировать",
        },
        {
          color: "var(--red500)",
          title: "Бронирование другого пользователя",
          description: "админ может отменить и редактировать",
        },
      ],
    };
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>