import React from 'react';
import * as Lucide from 'lucide-react';

// Minimal export to satisfy AdminDashboard dependency.
export function renderMaterialIcon(iconName: string, size: number) {
  const Icon = (Lucide as any)[iconName] || Lucide.Truck;
  return <Icon size={size} />;
}

export default function HomeDashboard() {
  return <div />;
}

