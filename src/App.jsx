import { Routes, Route } from "react-router-dom";
import EmployeeForm from "./pages/EmployeeForm";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EmployeeForm />} />
    </Routes>
  );
}
