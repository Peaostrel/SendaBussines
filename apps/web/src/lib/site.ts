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

export function getBusinessMailto() {
  const subject = encodeURIComponent("Senda Business — lista de espera");
  return `${site.mailto}?subject=${subject}`;
}
