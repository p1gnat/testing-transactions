import { useState } from "react";
import Form from "./components/Form";
import Header from "./components/Header";

const App = () => {
  const [actions, setActions] = useState("Экскурсия");

  return (
    <div className="card-main">
      <Header actions={actions} />
      <Form actions={actions} />
    </div>
  );
};

export default App;
