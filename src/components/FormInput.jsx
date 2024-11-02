const FormInput = ({ children, id, errors, register }) => {
  return (
    <div className="card-input-box">
      <label htmlFor={id} className="card-label">
        {children}
      </label>
      <input
        type="text"
        id={id}
        className={`card-full-input ${errors[id] ? "input-error" : ""}`}
        {...register(id)}
      />
      {errors[id] && <p className="error-message">{errors[id].message}</p>}
    </div>
  );
};

export default FormInput;
