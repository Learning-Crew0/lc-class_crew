"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
    redirectTo?: string;
}

export default function ProtectedRoute({
    children,
    requireAuth = true,
    requireAdmin = false,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const { user, isLoggedIn } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            // Check authentication
            if (requireAuth && !isLoggedIn) {
                router.push(redirectTo);
                return;
            }

            // Check admin access (assuming admin check based on memberType)
            if (requireAdmin && (!user || user.memberType !== 'admin')) {
                router.push('/unauthorized');
                return;
            }

            setIsAuthorized(true);
            setIsChecking(false);
        };

        // Small delay to ensure localStorage is loaded
        const timer = setTimeout(checkAuth, 100);
        return () => clearTimeout(timer);
    }, [isLoggedIn, user, requireAuth, requireAdmin, router, redirectTo]);

    // Show loading while checking auth
    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}