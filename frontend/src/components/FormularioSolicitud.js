import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { SOLICITUDES_API } from "../config";   // ← usamos solo esta constante

const validationSchema = Yup.object({
  empresa: Yup.string().trim().required("La empresa es obligatoria"),
  cargo:   Yup.string().trim().required("El cargo es obligatorio"),
});

export default function FormularioSolicitud({ onNuevaSolicitud }) {
  return (
    <Formik
      initialValues={{ empresa: "", cargo: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        setSubmitting(true);
        try {
          // POST a /solicitudes/  (con barra final)
          const res = await fetch(`${SOLICITUDES_API}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });

          const data = await res.json();
          if (!res.ok) {
            const msgs = Object.values(data).flat().join(" / ");
            throw new Error(msgs);
          }
          onNuevaSolicitud(data);
          resetForm();
          toast.success("Solicitud enviada correctamente.");
        } catch (err) {
          toast.error(err.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Field
              name="empresa"
              placeholder="Empresa"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="empresa"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div>
            <Field
              name="cargo"
              placeholder="Cargo"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="cargo"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando…" : "Enviar solicitud"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
