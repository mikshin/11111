export default {
  name: "intersection",

  inserted: function (el, binding) {
    // Высота нужна, т.к. без нее в телефонном справочнике в какой то момент функция перестает срабатывать
    el.style.height = "10px";
    const options = {
      rootMargin: "0px",
      threshold: 0.5,
    };
    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        binding.value();
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(el);
  },
};
