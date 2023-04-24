<template>
  <div class="widget_container">
    <div class="widget_headline">
      <div class="icon"></div>
      <h3>{{ widgetInfo.name }}</h3>
      <router-link to="/events"></router-link>
    </div>
    <div class="widget_content" v-bind:class="{ loading: !isLoaded }">
      {{ data }}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: "Тут будет информация о виджете",
      isLoaded: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/sidebarWidgets";
</style>
