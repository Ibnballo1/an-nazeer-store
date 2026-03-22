export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "An-Nazeer Holistic Home Ltd",
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`,
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    sameAs: [
      "https://instagram.com/an-nazeer",
      "https://facebook.com/an-nazeer",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
