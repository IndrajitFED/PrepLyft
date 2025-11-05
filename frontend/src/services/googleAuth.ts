// Google OAuth Service
declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
    document.head.appendChild(script);
  });
};

interface GoogleAuthResponse {
  credential: string;
  client_id: string;
}

export const initializeGoogleAuth = async (clientId: string): Promise<void> => {
  await loadGoogleScript();

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleGoogleSignIn,
  });
};

const handleGoogleSignIn = async (response: GoogleAuthResponse) => {
  try {
    console.log('Google Sign-In Response:', response);
    // This will be handled by the calling component
    // The response.credential is the JWT token from Google
    return response;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const promptGoogleSignIn = () => {
  if (!window.google) {
    throw new Error('Google Sign-In not initialized');
  }

  window.google.accounts.id.prompt((notification: any) => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      // Auto sign-in not available, show sign-in button
      console.log('Auto sign-in not available');
    }
  });
};

export const renderGoogleButton = (elementId: string, onSuccess: (credential: string) => void) => {
  if (!window.google) {
    throw new Error('Google Sign-In not initialized');
  }

  window.google.accounts.id.renderButton(
    document.getElementById(elementId),
    {
      theme: 'outline',
      size: 'large',
      width: '100%',
      text: 'signin_with',
      locale: 'en'
    }
  );

  // Listen for successful sign-in
  window.google.accounts.id.initialize({
    client_id: '200758472259-97femlps6nncr7tvlqsrn0v7osa9oo71.apps.googleusercontent.com',
    callback: (response: any) => {
      onSuccess(response.credential);
    },
  });
};

