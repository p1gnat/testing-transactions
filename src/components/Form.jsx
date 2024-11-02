import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import HalfFormInput from "./HalfFormInput";
import { useState } from "react";
import { schema } from "./logic/myschema";
import { onSubmit } from "./logic/onsubmit";

const Form = ({ actions }) => {
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((data) =>
          onSubmit(data, setSubmittedData, actions)
        )}
        className="card-form"
      >
        <FormInput register={register} errors={errors} id={"cardNumber"}>
          Номер карты
        </FormInput>
        <div className="card-divided">
          <HalfFormInput register={register} errors={errors} id={"expiryDate"}>
            Срок действия
          </HalfFormInput>
          <HalfFormInput register={register} errors={errors} id={"cvv"}>
            CVV
          </HalfFormInput>
        </div>
        <FormInput register={register} errors={errors} id={"amount"}>
          Сумма перевода
        </FormInput>
        <FormInput register={register} errors={errors} id={"name"}>
          Ваше имя
        </FormInput>
        <FormInput register={register} errors={errors} id={"message"}>
          Сообщение покупателю
        </FormInput>

        {submittedData && (
          <div className="submitted-data">
            <h2>Данные для отправки: (не будут видны у пользователя)</h2>
            <pre style={{ fontSize: 10 }}>
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </>
  );
};

export default Form;
