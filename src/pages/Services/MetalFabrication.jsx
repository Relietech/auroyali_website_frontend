import React from 'react';
import { servicesData } from '../../data/services';
import { ServiceTemplate } from '../../components/services/ServiceTemplate';

export function MetalFabrication() {
  const service = servicesData.find((s) => s.slug === 'metal-fabrication') || servicesData[3];
  return <ServiceTemplate service={service} />;
}
export default MetalFabrication;
