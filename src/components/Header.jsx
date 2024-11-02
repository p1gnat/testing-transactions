import { useState } from "react";

const Header = ({ actions }) => {
  const [name, setName] = useState("Иван.К");

  return (
    <h1 className="card-h1">
      {name} собирает на {actions}
    </h1>
  );
};

export default Header;
