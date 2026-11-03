import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacidad y Cookies | Cundo Marchi",
  description: "Información sobre privacidad, cookies y analítica del portfolio de murales de Cundo Marchi.",
  robots: "noindex, follow",
  alternates: { canonical: "/es/privacy.html", languages: { en: "/privacy.html", es: "/es/privacy.html" } },
};

const email = <a href="mailto:cundomarchi@gmail.com">cundomarchi@gmail.com</a>;

export default function PrivacyPageEs() {
  return (
    <LegalPage
      backHref="/es/"
      backLabel="Volver al inicio"
      eyebrow="Información del sitio"
      title="Privacidad y Cookies"
      updated="Última actualización: 27 de octubre de 2026"
      note="Esta página describe el funcionamiento técnico actual del sitio y no constituye asesoramiento legal."
      sections={[
        {
          title: "Qué recopila este sitio",
          body: (
            <>
              Este portfolio recopila la información que decidís enviar mediante el formulario de cotización: nombre,
              datos de contacto, información del proyecto y cualquier fotografía de la pared que adjuntes. FormSubmit
              procesa el formulario y lo entrega a {email} para que Cundo Marchi pueda responder tu consulta.
            </>
          ),
        },
        {
          title: "Google Analytics",
          body: "Se usa Google Analytics 4 para entender visitas, páginas vistas, murales consultados, cambios de idioma y cotizaciones completadas. La publicidad personalizada y las señales publicitarias de Google permanecen desactivadas. Antes de que elijas, y si elegís Solo necesarias, Google puede recibir señales de medición sin cookies mediante Consent Mode. No equivalen a la medición de visitantes y sesiones con cookies aceptadas. Las cookies analíticas se habilitan únicamente si elegís Aceptar todas.",
        },
        {
          title: "Cookies y almacenamiento local",
          body: (
            <>
              Si aceptás, Google Analytics puede utilizar las cookies propias <code>_ga</code> y{" "}
              <code>_ga_&lt;measurement-id&gt;</code> para distinguir visitantes y sesiones. Google documenta una
              duración predeterminada de hasta dos años. Este sitio también guarda tu elección en el navegador con la
              clave <code>cmz_analytics_consent_v1</code>. Podés cambiarla en cualquier momento desde el botón Cookies.
            </>
          ),
        },
        {
          title: "Servicios externos",
          body: "Los enlaces a Instagram, Facebook y YouTube abren esos servicios, que aplican sus propias políticas de privacidad. El formulario usa FormSubmit para transmitir los datos que enviás. No incluyas información sensible que no sea necesaria para una consulta de mural.",
        },
        {
          title: "Tus opciones",
          body: (
            <>
              Podés rechazar las cookies analíticas opcionales sin perder acceso al sitio. También podés borrar las
              cookies y el almacenamiento local desde tu navegador. Para consultas o solicitudes sobre información
              enviada por el formulario, escribí a {email}.
            </>
          ),
        },
      ]}
    />
  );
}
