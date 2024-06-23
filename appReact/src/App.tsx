import Alert from "./components/Alert";
import Button from "./components/Button";
import { useState } from "react";
import ListGroup from "./components/ListGroup";

function App() {
  const [alerVisible, setAlertVisibility] = useState(false);

  return (
    <div>
      { alerVisible && <Alert onClose={() => setAlertVisibility(false)}>My Alert</Alert>}
      <Button color="danger" onClick={() => setAlertVisibility(true)}>My button</Button>
    </div>
  );
}

export default App;
