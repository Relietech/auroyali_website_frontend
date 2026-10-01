import React from 'react';
import { Button } from '../components/common/Button';
import { Compass } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-earth-50 px-4 text-center py-32">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 bg-earth-200 text-clay rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Compass size={40} className="animate-spin" style={{ animationDuration: '12s' }} />
        </div>
        <span className="text-xs uppercase tracking-widest text-clay font-mono block">
          Error 404 &bull; Page Not Located
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-earth-900">
          Spatial Pathway Uncharted
        </h1>
        <p className="body-text text-stone-600 font-light">
          The architectural blueprint or page you requested does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Button to="/" variant="clay">
            Return to Sanctuary Home
          </Button>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
