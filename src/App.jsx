import { useState } from "react";
import Buttons from "./components/Buttons";
import Form from "./components/Form";
import Header from "./components/Header";

const App = () => {
  const [actions, setActions] = useState("Экскурсия");

  return (
    <div className="card-main">
      <Header actions={actions} />
      <Form actions={actions} />
      <Buttons />
    </div>
  );
};

export default App;
