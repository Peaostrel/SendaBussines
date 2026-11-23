export const site = {
  name: "Senda",
  email: "hola@withsenda.site",
  mailto: "mailto:hola@withsenda.site",
  linkedin: "https://www.linkedin.com/company/senda-labs/posts/?feedView=all",
  instagram: "https://www.instagram.com/withsenda/",
  x: "https://x.com/withsenda_",
} as const;

export const BUSINESS_PATH = "/empresas";
export const BUSINESS_LOGIN_PATH = "/empresas/ingresar";
export const BUSINESS_DASHBOARD_PATH = "/empresas/panel";

// The waitlist does not have an in-app registration flow yet. Each CTA
// opens a separate, correctly described email request instead of sending
// visitors to the login page or silently claiming a completed sign-up.
function businessEmail(subject: string, body: string) {
  return `${site.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const BUSINESS_CTA = {
  contact: {
    label: "Contactar al equipo por correo",
    href: businessEmail(
      "Senda Business — consulta empresarial",
      "Hola, quisiera hacer una consulta sobre Senda Business.\n\n",
    ),
  },
  waitlist: {
    label: "Solicitar lista de espera por correo",
    href: businessEmail(
      "Senda Business — solicitud de lista de espera",
      "Hola, me gustaría solicitar un lugar en la lista de espera de Senda Business.\n\nEmpresa:\nNombre de contacto:\n",
    ),
    note: "Se abrirá tu aplicación de correo para enviar la solicitud. No es una inscripción automática.",
  },
  information: {
    label: "Solicitar información por correo",
    href: businessEmail(
      "Senda Business — solicitud de información",
      "Hola, quisiera recibir más información sobre el acceso a Senda Business.\n\n",
    ),
  },
} as const;
