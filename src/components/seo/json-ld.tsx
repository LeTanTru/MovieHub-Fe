import { safeJsonLd } from './json-ld.util';

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
