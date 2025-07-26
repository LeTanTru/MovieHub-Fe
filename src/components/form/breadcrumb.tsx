import Link from 'next/link';
import {
  Breadcrumb as OriginBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import React from 'react';

type BreadcrumbType = {
  label: string;
  href?: string;
};

type ReusableBreadcrumbProps = {
  items: BreadcrumbType[];
  separator?: React.ReactNode;
};

export default function Breadcrumb({
  items,
  separator = <BreadcrumbSeparator />
}: ReusableBreadcrumbProps) {
  return (
    <OriginBreadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && separator}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </OriginBreadcrumb>
  );
}
