import axios from "axios";
import { validateCardNumber } from "./validatecardnumber";
import CryptoJS from "crypto-js";

export const onSubmit = async (data, setSubmittedData, actions) => {
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
