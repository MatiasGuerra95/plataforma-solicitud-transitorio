import { render, screen } from "@testing-library/react";
import ListadoSolicitudes from "../components/ListadoSolicitudes";

test("muestra filas", () => {
  const datos = [{ id: 1, empresa: "Acme", cargo: "Dev" }];
  render(<ListadoSolicitudes solicitudes={datos} />);
  expect(screen.getByText(/Acme/i)).toBeInTheDocument();
});
