<template>
  <div class="print__headline">
    <div class="print__headiline-left">
      <img src="@/assets/images/logo-sign.svg" alt="" />
      <h3>Стоп-карта</h3>
    </div>
    <span v-if="ID">ID {{ ID }}</span>
  </div>
</template>
<script>
export default {
  props: {
    ID: null,
  },
};
</script>

<style lang="scss" scoped>
.print {
  &__headline {
    -webkit-print-color-adjust: exact;
    padding: 15px 30px;
    background: var(--red900);
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      color: #fff;
      font-family: "HeliosC";
      font-style: normal;
      font-weight: 700;
      font-size: 30px;
      line-height: 30px;
    }
    span {
      font-family: "HeliosC";
      font-style: normal;
      font-weight: 700;
      font-size: 15px;
      line-height: 20px;
      color: #fff;
    }
  }
  &__headiline-left {
    display: flex;

    img {
      margin-right: 20px;
    }
  }
}
</style>

