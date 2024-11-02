import * as yup from "yup";

export const schema = yup.object().shape({
  cardNumber: yup
    .string()
    .required("Введите номер карты")
    .matches(/^\d{16}$/, "Должно быть 16 цифр"),

  expiryDate: yup
    .string()
    .required("Введите срок")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Формат MM/YY"),
  cvv: yup
    .number()
    .typeError("CVV должен быть числом")
    .required("Введите CVV")
    .test(
      "len",
      "Должно быть 3 цифры",
      (val) => val && val.toString().length === 3
    ),
  amount: yup
    .number()
    .typeError("Сумма должна быть числом")
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value
    )
    .nullable()
    .required("Сумма перевода обязательна")
    .positive("Сумма должна быть положительной"),
  name: yup.string().required("Введите имя"),
  message: yup.string().optional(),
});
