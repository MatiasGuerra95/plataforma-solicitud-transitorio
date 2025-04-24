// frontend/src/validation/solicitud.schema.js
import * as Yup from "yup";

export const SolicitudSchema = Yup.object().shape({
  empresa: Yup.string()
    .trim()
    .required("La empresa es obligatoria"),
  cargo: Yup.string()
    .trim()
    .required("El cargo es obligatorio"),
});
