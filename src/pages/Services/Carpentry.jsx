import React from 'react';
import { servicesData } from '../../data/services';
import { ServiceTemplate } from '../../components/services/ServiceTemplate';

export function Carpentry() {
  const service = servicesData.find((s) => s.slug === 'carpentry') || servicesData[2];
  return <ServiceTemplate service={service} />;
}
export default Carpentry;
