"use client";

import { signIn } from 'next-auth/react';

export default function Page() {

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/'} )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <h1>Sign In</h1>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        {/* Add more buttons for other providers if needed */}
        </div>
  );
};
