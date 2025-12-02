
import React, { useState } from 'react';
import { signInWithGoogle, loginWithEmail, registerWithEmail } from '../firebase';
import { Loader2, Globe, ShieldCheck, Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                if (!name) throw new Error("Name is required");
                await registerWithEmail(name, email, password);
            }
        } catch (err: any) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogle = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex overflow-hidden min-h-[600px]">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white z-10 relative">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <span className="text-white font-bold text-xl">W</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">WTConnect</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                        <p className="text-gray-500">{isLogin ? 'Enter your details to access your account.' : 'Join millions of professionals today.'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                    required={!isLogin}
                                />
                            </div>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <input 
                                type="email" 
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <input 
                                type="password" 
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or continue with</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                     <button 
                        onClick={handleGoogle}
                        type="button"
                        disabled={isLoading}
                        className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                        <span>Google</span>
                    </button>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-bold hover:underline">
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>

                {/* Right Side - Visuals */}
                <div className="hidden md:flex md:w-1/2 bg-indigo-600 relative items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90 z-10"></div>
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1742&q=80" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" />
                    
                    <div className="relative z-20 text-white p-12 max-w-lg">
                         <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                            <Globe size={32} className="text-white" />
                         </div>
                         <h2 className="text-4xl font-bold mb-6 leading-tight">Connect, Share, and Build the Future.</h2>
                         <p className="text-indigo-100 text-lg leading-relaxed mb-8">
                             Experience the next generation of social networking with AI-powered tools, real-time collaboration, and a global community.
                         </p>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                <ShieldCheck className="text-green-400" size={24} />
                                <div>
                                    <p className="font-bold">Secure</p>
                                    <p className="text-xs text-indigo-200">End-to-end encryption</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                <Zap className="text-yellow-400" size={24} />
                                <div>
                                    <p className="font-bold">Fast AI</p>
                                    <p className="text-xs text-indigo-200">Gemini Integrated</p>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
