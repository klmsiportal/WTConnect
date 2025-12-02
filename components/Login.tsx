
import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase';
import { Loader2, Globe, ShieldCheck, Zap } from 'lucide-react';

export const Login: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error(error);
            alert("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex overflow-hidden">
                {/* Left Side - Content */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white z-10">
                    <div className="mb-10">
                        <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-6">
                            <span className="text-white font-bold text-2xl">W</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome to WTConnect</h1>
                        <p className="text-lg text-gray-500">The professional network for the AI era.</p>
                    </div>

                    <div className="space-y-6">
                        <button 
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin text-indigo-600" />
                            ) : (
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                            )}
                            <span className="text-lg">Continue with Google</span>
                        </button>
                        
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Trusted by 1M+ Users</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <ShieldCheck className="text-indigo-600 mb-2" size={24} />
                                <h3 className="font-bold text-gray-900">Secure</h3>
                                <p className="text-xs text-gray-500">Enterprise grade security</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Zap className="text-indigo-600 mb-2" size={24} />
                                <h3 className="font-bold text-gray-900">Fast AI</h3>
                                <p className="text-xs text-gray-500">Powered by Gemini 2.5</p>
                            </div>
                        </div>
                    </div>
                    
                    <p className="mt-8 text-xs text-gray-400 text-center">
                        By continuing, you agree to WTConnect's Terms of Service and Privacy Policy.
                    </p>
                </div>

                {/* Right Side - Visuals */}
                <div className="hidden md:flex md:w-1/2 bg-indigo-50 relative items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-600 opacity-90"></div>
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
                    
                    <div className="relative z-10 text-white p-12 text-center">
                         <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
                            <Globe size={40} className="text-white" />
                         </div>
                         <h2 className="text-3xl font-bold mb-4">Connect Globally</h2>
                         <p className="text-indigo-100 text-lg leading-relaxed">
                             Join a community where professionals, creators, and AI enthusiasts collaborate to build the future.
                         </p>
                         
                         <div className="mt-8 flex justify-center gap-2">
                             <div className="w-2 h-2 bg-white rounded-full"></div>
                             <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                             <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
