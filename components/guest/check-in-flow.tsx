'use client';

import { useState } from 'react';
import type { Property, Reservation } from '@/lib/data';
import type { IdVerificationOutput } from '@/ai/flows/id-verification';
import { StepWelcome } from './step-welcome';
import { StepIdVerification } from './step-id-verification';
import { StepContract } from './step-contract';
import { StepInstructions } from './step-instructions';
import { StepCheckout } from './step-checkout';
import { useRouter } from 'next/navigation';

type Step = 'welcome' | 'verification' | 'contract' | 'instructions' | 'checkout';

type CheckInFlowProps = {
  property: Property;
  reservation: Reservation;
};

const getInitialStepFromStatus = (status: Reservation['status']): Step => {
  switch (status) {
    case 'pending':
    case 'failed':
      return 'verification';
    case 'verified':
    case 'checked-in':
      return 'instructions';
    case 'checked-out':
      return 'checkout';
    default:
      return 'welcome';
  }
};


export function CheckInFlow({ property, reservation }: CheckInFlowProps) {
  const [step, setStep] = useState<Step>(() => getInitialStepFromStatus(reservation.status));
  const [guestInfo, setGuestInfo] = useState({ 
      name: reservation.guestName || 'Guest', 
      verified: reservation.status === 'verified' || reservation.status === 'checked-in'
  });
  const router = useRouter();

  const handleVerificationSuccess = (result: IdVerificationOutput) => {
    if (result.verificationStatus === 'Verified' && result.guestName) {
        setGuestInfo({ name: result.guestName, verified: true });
        setStep('contract');
    }
  };

  const handleCheckout = () => {
    // In a real app, you would notify the backend that the guest has checked out.
    // For now, we'll just redirect to the homepage.
    router.push('/');
  }

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return <StepWelcome property={property} onNext={() => setStep('verification')} />;
      case 'verification':
        return <StepIdVerification onVerified={handleVerificationSuccess} />;
      case 'contract':
        return (
          <StepContract
            property={property}
            reservation={reservation}
            onSigned={() => setStep('instructions')}
          />
        );
      case 'instructions':
        return <StepInstructions property={property} reservation={reservation} onNext={() => setStep('checkout')} />;
      case 'checkout':
        return <StepCheckout onConfirm={handleCheckout} />;
      default:
        return <StepWelcome property={property} onNext={() => setStep('verification')} />;
    }
  };

  return <div className="w-full max-w-lg">{renderStep()}</div>;
}
