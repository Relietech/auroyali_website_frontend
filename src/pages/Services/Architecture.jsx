import React from 'react';
import { servicesData } from '../../data/services';
import { ServiceTemplate } from '../../components/services/ServiceTemplate';

export function Architecture() {
  const service = servicesData.find((s) => s.slug === 'architecture') || servicesData[0];
  return <ServiceTemplate service={service} />;
}
export default Architecture;
