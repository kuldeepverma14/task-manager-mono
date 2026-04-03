'use client';

import React, { useState } from 'react';
import { useRegisterMutation } from '@/store/services/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, LayoutDashboard, Fingerprint, LucideUserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating your profile...');
    try {
      const response = await register({ name, email, password }).unwrap();
      const { user, accessToken, refreshToken } = response.data;

      dispatch(setCredentials({ user, accessToken, refreshToken }));
      toast.success('Strategy Account Created!', { id: loadingToast });
      router.push('/');
    } catch (err: any) {
      toast.error(err.data?.message || 'Verification failed. This account may already exist.', { id: loadingToast });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 selection:bg-teal-100 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[35rem] h-[35rem] bg-indigo-100 rounded-full blur-[120px] opacity-70 animate-pulse transition-duration-5000"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[25rem] h-[25rem] bg-teal-100 rounded-full blur-[120px] opacity-70"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white rounded-[3.5rem] p-10 sm:p-14 shadow-2xl border border-white relative overflow-hidden shadow-indigo-200/50">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-teal-500/30">
               <LucideUserPlus className="text-white w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Onboard</h2>
            <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Platform Registration Routine</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2 group">
                <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-teal-600 transition-colors">Nominal Identifier</label>
                <div className="relative">
                   <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-teal-500 transition-all duration-300" />
                   <input
                     id="name"
                     type="text"
                     required
                     className="block w-full rounded-2xl bg-slate-50 border-none px-14 py-4 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-200"
                     placeholder="Your full name"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     autoFocus
                   />
                </div>
              </div>

              <div className="space-y-2 group">
                <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-teal-600 transition-colors">Communication Link</label>
                <div className="relative">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-teal-500 transition-all duration-300" />
                   <input
                     id="email"
                     type="email"
                     required
                     className="block w-full rounded-2xl bg-slate-50 border-none px-14 py-4 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-200"
                     placeholder="you@domain.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                   />
                </div>
              </div>

              <div className="space-y-2 group">
                <label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-teal-600 transition-colors">Security Anchor</label>
                <div className="relative">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-teal-500 transition-all duration-300" />
                   <input
                     id="password"
                     type="password"
                     required
                     className="block w-full rounded-2xl bg-slate-50 border-none px-14 py-4 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-200"
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
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 border border-slate-900 px-6 py-5 text-sm font-black text-white shadow-xl shadow-slate-900/10 hover:bg-black hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-50 group"
              >
                {isLoading ? (
                   <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                   <>
                      <span className="uppercase tracking-[0.2em] text-[10px]">Initialize Identity</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Existing Authorized Member?{' '}
              <Link href="/login" className="text-teal-600 hover:text-teal-700 ml-2 border-b-2 border-transparent hover:border-teal-600 transition-all pb-0.5">
                Log In
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
