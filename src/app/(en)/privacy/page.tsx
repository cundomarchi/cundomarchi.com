import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy & Cookies | Cundo Marchi",
  description: "Privacy, cookies and analytics information for the Cundo Marchi mural portfolio website.",
  robots: "noindex, follow",
  alternates: { canonical: "/privacy.html", languages: { en: "/privacy.html", es: "/es/privacy.html" } },
};

const email = <a href="mailto:cundomarchi@gmail.com">cundomarchi@gmail.com</a>;

export default function PrivacyPage() {
  return (
    <LegalPage
      backHref="/"
      backLabel="Back to home"
      eyebrow="Website information"
      title="Privacy & Cookies"
      updated="Last updated: 27 October 2026"
      note="This page describes the website's current technical behaviour and is not legal advice."
      sections={[
        {
          title: "What this website collects",
          body: (
            <>
              This portfolio collects the information you choose to send through the quote form: your name, contact
              details, project information and any wall photograph you attach. The form is processed by FormSubmit and
              delivered to {email} so Cundo Marchi can respond to your enquiry.
            </>
          ),
        },
        {
          title: "Google Analytics",
          body: "Google Analytics 4 is used to understand visits, page views, mural views, language changes and completed quote enquiries. Personalised advertising and Google advertising signals are disabled. Before you choose, and if you select Necessary only, Google may receive cookieless measurement signals through Consent Mode. These do not provide the same visitor and session measurement as accepted analytics cookies. Analytics cookies are enabled only if you select Accept all.",
        },
        {
          title: "Cookies and local storage",
          body: (
            <>
              If accepted, Google Analytics may use <code>_ga</code> and <code>_ga_&lt;measurement-id&gt;</code>{" "}
              first-party cookies to distinguish visitors and sessions. Google documents default retention of up to two
              years. This site also stores your analytics choice in your browser under{" "}
              <code>cmz_analytics_consent_v1</code>. You can change it at any time with the Cookies button.
            </>
          ),
        },
        {
          title: "External services",
          body: "Links to Instagram, Facebook and YouTube open those services, which apply their own privacy policies. The quote form uses FormSubmit to transmit the details you submit. Please do not include sensitive information that is unnecessary for a mural enquiry.",
        },
        {
          title: "Your choices",
          body: (
            <>
              You can reject optional analytics cookies without losing access to the website. You can also clear this
              site&apos;s cookies and local storage in your browser. For questions or requests concerning information
              sent through the quote form, email {email}.
            </>
          ),
        },
      ]}
    />
  );
}
