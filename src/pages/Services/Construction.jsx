import React from 'react';
import { servicesData } from '../../data/services';
import { ServiceTemplate } from '../../components/services/ServiceTemplate';

export function Construction() {
  const service = servicesData.find((s) => s.slug === 'construction') || servicesData[1];
  return <ServiceTemplate service={service} />;
}
export default Construction;
