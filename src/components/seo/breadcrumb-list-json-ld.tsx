import { safeJsonLd } from './json-ld.util';

type BreadcrumbListItem = {
  name: string;
  item: string;
};

type BreadcrumbListProps = {
  items: BreadcrumbListItem[];
};

export function BreadcrumbListJsonLd({ items }: BreadcrumbListProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

type ItemListJsonLdItem = {
  position: number;
  url: string;
  name: string;
};

type ItemListJsonLdProps = {
  items: ItemListJsonLdItem[];
  itemListName?: string;
};

export function ItemListJsonLd({ items, itemListName }: ItemListJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(itemListName ? { name: itemListName } : {}),
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      url: item.url,
      name: item.name
    }))
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
