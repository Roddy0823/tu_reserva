import { ReactNode, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileBookingOptimizerProps {
  children: ReactNode;
  currentStep: number;
}

const MobileBookingOptimizer = ({ children, currentStep }: MobileBookingOptimizerProps) => {
  const isMobile = useIsMobile();

  // Optimización móvil: scroll to top al cambiar de paso
  useEffect(() => {
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, isMobile]);

  // Prevenir zoom en inputs móviles
  useEffect(() => {
    if (isMobile) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }

      return () => {
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
      };
    }
  }, [isMobile]);

  return <>{children}</>;
};

export default MobileBookingOptimizer;