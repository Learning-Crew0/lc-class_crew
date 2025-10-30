// Debug utilities for API troubleshooting

export const debugApiConfig = () => {
    console.log('=== API Configuration Debug ===');
    console.log('Environment Variables:');
    console.log('- NEXT_PUBLIC_BASE_API:', process.env.NEXT_PUBLIC_BASE_API);
    console.log('- NODE_ENV:', process.env.NODE_ENV);

    // Test if we're in browser or server
    console.log('- Running in:', typeof window !== 'undefined' ? 'Browser' : 'Server');

    // Check if API URL is accessible
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API || 'https://classcrew.onrender.com/api';
    console.log('- Base URL being used:', baseUrl);

    return {
        baseUrl,
        environment: process.env.NODE_ENV,
        isBrowser: typeof window !== 'undefined'
    };
};

export const testApiConnection = async () => {
    const config = debugApiConfig();

    try {
        console.log('Testing API connection...');
        const response = await fetch(`${config.baseUrl}/banner?isActive=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Test response status:', response.status);
        console.log('Test response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const data = await response.json();
            console.log('Test response data:', data);
            return { success: true, data };
        } else {
            const errorText = await response.text();
            console.error('Test response error:', errorText);
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error('Test connection failed:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};