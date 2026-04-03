'use client';

import React, { useState } from 'react';
import { useLoginMutation } from '@/store/services/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, LayoutDashboard, Fingerprint } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Authenticating...');
    try {
      const response = await login({ email, password }).unwrap();
      const { user, accessToken, refreshToken } = response.data;

      dispatch(setCredentials({ user, accessToken, refreshToken }));
      toast.success('Welcome back!', { id: loadingToast });
      router.push('/');
    } catch (err: any) {
      toast.error(err.data?.message || 'Verification failed. Please check your credentials.', { id: loadingToast });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 selection:bg-indigo-100 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 w-[40rem] h-[40rem] bg-indigo-100 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-[30rem] h-[30rem] bg-violet-100 rounded-full blur-[100px] opacity-60"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-[3rem] p-10 sm:p-14 shadow-2xl shadow-indigo-200/50 border border-white relative overflow-hidden ring-1 ring-slate-100/50">
          
          {/* Internal Accents */}
          <div className="absolute top-0 right-0 px-6 py-10 opacity-5 pointer-events-none">
             <Fingerprint className="w-48 h-48 text-slate-900" />
          </div>

          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-700 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-600/30">
               <LayoutDashboard className="text-white w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Login</h2>
            <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Authentication Protocol Required</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2 group">
                <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">Access Identifier</label>
                <div className="relative">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-indigo-500 transition-all duration-300 pointer-events-none" />
                   <input
                     id="email"
                     type="email"
                     required
                     className="block w-full rounded-2xl bg-slate-50 border-none px-14 py-5 focus:bg-white focus:outline-none focus:scale-[1.02] hover:scale-[1.01] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 font-bold text-slate-700 placeholder:text-slate-200"
                     placeholder="you@domain.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     autoFocus
                   />
                </div>
              </div>
              <div className="space-y-2 group">
                <label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">Security Key</label>
                <div className="relative">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-indigo-500 transition-all duration-300 pointer-events-none" />
                   <input
                     id="password"
                     type="password"
                     required
                     className="block w-full rounded-2xl bg-slate-50 border-none px-14 py-5 focus:bg-white focus:outline-none focus:scale-[1.02] hover:scale-[1.01] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 font-bold text-slate-700 placeholder:text-slate-200"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                   />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 border border-slate-900 px-6 py-6 text-sm font-black text-white shadow-xl shadow-slate-900/10 hover:bg-black hover:-translate-y-1 hover:scale-[1.02] active:scale-95 transition-all duration-500 disabled:opacity-50 group"
              >
                {isLoading ? (
                   <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                   <>
                      <span className="uppercase tracking-[0.2em] text-[10px]">Verify & Entry</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                   </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              New to the platform?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 ml-2 border-b-2 border-transparent hover:border-indigo-600 transition-all pb-0.5">
                Apply for Access
              </Link>
            </p>
          </div>
        </div>
        
        {/* Secondary Footer Info */}
        <p className="mt-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
           TaskFlow Unified OS v2.0
        </p>
      </motion.div>
    </div>
  );
}
