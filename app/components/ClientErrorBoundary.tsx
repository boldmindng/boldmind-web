'use client';

import { ErrorBoundary } from '@boldmindng/ui';
import type { ReactNode, ComponentType } from 'react';

interface ClientErrorBoundaryProps {
    children: ReactNode;
}

// Type assertion to work around TypeScript strict checking across React versions
const ErrorBoundaryComponent = ErrorBoundary as unknown as ComponentType<{ children: ReactNode }>;

export function ClientErrorBoundary({ children }: ClientErrorBoundaryProps) {
    return <ErrorBoundaryComponent>{children}</ErrorBoundaryComponent>;
}
