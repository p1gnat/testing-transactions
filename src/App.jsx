import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CryptoJS from "crypto-js";
import axios from "axios";

const schema = yup.object().shape({
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

const App = () => {
  const [name, setName] = useState("Иван.К");
  const [actions, setActions] = useState("Экскурсия");
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const validateCardNumber = (number) => {
    let sum = 0;
    let shouldDouble = false;

    // Перебираем цифры справа налево
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const onSubmit = async (data) => {
    if (!validateCardNumber(data.cardNumber)) {
      alert("Номер карты некорректен");
      return;
    }

    const transactionId = Date.now().toString();
    const api_key = "316b2be8-3475-4462-bd57-c7794d4bdb53";
    const secret = "1234567890";
    const amountInKopeycks = data.amount * 100;

    const hash_sum = CryptoJS.SHA256(
      `${api_key}${transactionId}${amountInKopeycks}${secret}`
    ).toString();

    const requestBody = {
      hash_sum,
      transaction: transactionId,
      description: `Оплата за ${actions}`,
      api_key,
      amount: amountInKopeycks,
      custom_data: {
        initiator: name,
        action: actions,
        message: data.message,
      },
    };

    console.log("Request Body:", requestBody);

    try {
      const response = await axios.post(
        "https://your-api-endpoint.com",
        requestBody
      );
      console.log("Ответ сервера:", response.data);
    } catch (error) {
      console.error("Ошибка отправления:", error);
    }

    setSubmittedData(requestBody);
  };

  return (
    <div className="card-main">
      <h1 className="card-h1">
        {name} собирает на {actions}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card-form">
        {/* Инпуты для формы */}
        <div className="card-input-box">
          <label htmlFor="cardNumber" className="card-label">
            Номер карты
          </label>
          <input
            type="text"
            id="cardNumber"
            className={`card-full-input ${
              errors.cardNumber ? "input-error" : ""
            }`}
            {...register("cardNumber")}
          />
          {errors.cardNumber && (
            <p className="error-message">{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="card-divided">
          <div className="card-input-part-box">
            <label htmlFor="expiryDate" className="card-label">
              Срок действия
            </label>
            <input
              type="text"
              id="expiryDate"
              className={`card-part-input ${
                errors.expiryDate ? "input-error" : ""
              }`}
              {...register("expiryDate")}
            />
            {errors.expiryDate && (
              <p className="error-message">{errors.expiryDate.message}</p>
            )}
          </div>

          <div className="card-input-part-box">
            <label htmlFor="cvv" className="card-label">
              CVV
            </label>
            <input
              type="password"
              id="cvv"
              className={`card-part-input ${errors.cvv ? "input-error" : ""}`}
              {...register("cvv")}
            />
            {errors.cvv && (
              <p className="error-message">{errors.cvv.message}</p>
            )}
          </div>
        </div>

        <div className="card-input-box">
          <label htmlFor="amount" className="card-label">
            Сумма перевода
          </label>
          <input
            type="number"
            id="amount"
            className={`card-full-input ${errors.amount ? "input-error" : ""}`}
            {...register("amount")}
          />
          {errors.amount && (
            <p className="error-message">{errors.amount.message}</p>
          )}
        </div>

        <div className="card-input-box">
          <label htmlFor="name" className="card-label">
            Ваше имя
          </label>
          <input
            type="text"
            id="name"
            className={`card-full-input ${errors.name ? "input-error" : ""}`}
            {...register("name")}
          />
          {errors.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
        </div>

        <div className="card-input-box">
          <label htmlFor="message" className="card-label">
            Сообщение покупателю
          </label>
          <input
            type="text"
            id="message"
            className={`card-full-input ${errors.message ? "input-error" : ""}`}
            {...register("message")}
          />
          {errors.message && (
            <p className="error-message">{errors.message.message}</p>
          )}
        </div>

        <div className="card-buttons">
          <button type="submit" className="card-button blue">
            Перевести
          </button>
          <button type="button" className="card-button white">
            Вернуться
          </button>
        </div>
      </form>

      {submittedData && (
        <div className="submitted-data">
          <h2>Данные для отправки:</h2>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
