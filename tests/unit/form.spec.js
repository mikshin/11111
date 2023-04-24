import { mount } from "@vue/test-utils";
import Form from "@/components/UI/formTemplate.vue";

describe("Form.vue", () => {
  const inputs = [
    {
      type: "text",
      placeholder: "Имя",
      required: true,
      name: "testName",
    },
    {
      type: "tel",
      placeholder: "Телефон",
      name: "testPhone",
    },
    {
      type: "email",
      placeholder: "E-mail",
      required: true,
      name: "testMail",
    },
    {
      type: "date",
      placeholder: "Дата",
      name: "testDate",
    },
    {
      type: "radio",
      placeholder: "Пол",
      required: true,
      name: "testSex",
      radioValue: ["male", "female"],
    },
    {
      type: "checkbox",
      placeholder: "Чекбокс",
      required: true,
      name: "testCheckbox",
    },
    {
      type: "textarea",
      placeholder: "Комментарий",
      required: true,
      name: "testDescription",
    },
  ];
  it("Проверка заполнения инпутами", async () => {
    const wrapper = mount(Form, {
      propsData: {
        name: "Валидация",
        inputs: inputs,
        submitAdress: "/",
      },
    });

    // Если инпуты не заполнены, кнопка должна быть disabled
    expect(wrapper.find("button[type='submit']").props("disabled")).toBe(true);

    // Заполнение всех обязательных инпутов корректными данными. Проверка на валидацию инпутов будет производиться в инпутах
    await wrapper.find('input[name="testName"]').setValue("Автотестовый");
    await wrapper.find('input[name="testMail"]').setValue("test@test.ru");
    await wrapper.find('input[name="testSex"]').setChecked(true);
    await wrapper.find('input[name="testCheckbox"]').setChecked(true);
    await wrapper.find('[name="testDescription"]').setValue("Автотестовый");

    expect(wrapper.find("button[type='submit']").props("disabled")).toBe(false);

    // Удаление данных одного из обязательных инпутов
    await wrapper.find('input[name="testMail"]').setValue("");

    expect(wrapper.find("button[type='submit']").props("disabled")).toBe(true);
  });

  it("Показывает сообщение после отправки", async () => {
    const wrapper = mount(Form, {
      propsData: {
        name: "Test form",
        inputs: inputs,
        submitAdress: "/",
      },
    });

    await wrapper.find('input[name="testName"]').setValue("Автотестовый");
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.find(".sended").text()).toBe(
      "Произошла ошибка при отправке формы"
    );
  });
});
