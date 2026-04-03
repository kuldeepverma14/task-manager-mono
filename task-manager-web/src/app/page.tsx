'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { 
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskMutation, 
  useDeleteTaskMutation, 
  useToggleTaskMutation 
} from '@/store/services/taskApi';
import { useLogoutMutation } from '@/store/services/authApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Trash2, CheckCircle, Circle, 
  LogOut, ChevronLeft, ChevronRight, Menu, 
  LayoutDashboard, CheckSquare, Clock, Filter, X
} from 'lucide-react';

export default function Dashboard() {
  const { user, refreshToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const { data, isLoading, isFetching } = useGetTasksQuery(
    { search, status, page, limit: 1 }, 
    { skip: !user }
  );
  
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [toggleTask] = useToggleTaskMutation();
  const [serverLogout] = useLogoutMutation();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await serverLogout(refreshToken).unwrap();
    } catch (e) {}
    dispatch(logout());
    router.push('/login');
    toast.success('Logged out successfully.');
  };

  const handleCreateOrUpdate = async (e: any) => {
    e.preventDefault();
    const taskData = {
      title: e.target.title.value,
      description: e.target.description.value,
    };

    try {
      if (editingTask) {
        await updateTask({ id: editingTask.id, ...taskData }).unwrap();
        toast.success('Task updated');
      } else {
        await createTask(taskData).unwrap();
        toast.success('Task created');
      }
      setShowModal(false);
      setEditingTask(null);
    } catch (error: any) {
      toast.error(error.data?.message || 'Operation failed');
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  const tasks = data?.data.tasks || [];
  const totalPages = data?.data.totalPages || 1;
  const totalCount = data?.data.total || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
       {/* High-Impact Header */}
       <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 shadow-sm shadow-slate-200/50">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
                <LayoutDashboard className="text-white w-5 h-5" />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">TaskFlow</h1>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Productivity Platform</span>
             </div>
          </div>
          <div className="flex items-center gap-5">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">{user.name || 'User'}</p>
                <div className="flex items-center gap-1.5 justify-end mt-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] text-slate-400 font-bold uppercase">Online</span>
                </div>
             </div>
             <button 
                onClick={handleLogout} 
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-100 bg-slate-50 rounded-xl transition-all group"
                title="Logout"
             >
                <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
             </button>
          </div>
       </header>

       <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-10 space-y-10">
          
          {/* Dashboard Hero & Stats */}
          <section className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
             <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-4">
                   <h2 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
                      Master your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">daily objectives.</span>
                   </h2>
                   <p className="text-slate-400 font-medium max-w-xs">Maximize your workflow efficiency with real-time task synchronization.</p>
                </div>
                
                <div className="flex gap-4 sm:gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-6 rounded-3xl">
                   <div className="text-center px-4">
                      <p className="text-2xl font-black text-white">{totalCount}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total</p>
                   </div>
                   <div className="w-[1px] h-10 bg-white/10 self-center"></div>
                   <div className="text-center px-4">
                      <p className="text-2xl font-black text-emerald-400">
                         {tasks.filter((t: any) => t.status === 'COMPLETED').length}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Done</p>
                   </div>
                </div>
             </div>
          </section>

          {/* Action Bar - Highly Interactive */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row items-center gap-5">
             <div className="relative flex-1 w-full group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-indigo-500 group-focus-within:scale-110 transition-all duration-300" />
                <input 
                   type="text" 
                   placeholder="Search tasks..." 
                   className="pl-14 pr-6 py-4 w-full bg-slate-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold placeholder:text-slate-300 text-slate-700"
                   value={search}
                   onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
             </div>
             <div className="flex w-full md:w-auto items-center gap-4">
                <div className="relative group/filter flex-1 md:flex-none">
                   <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                   <select 
                      className="bg-slate-50 border-none rounded-2xl pl-12 pr-10 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-600 appearance-none w-full cursor-pointer hover:bg-slate-100 transition-colors"
                      value={status}
                      onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                   >
                      <option value="">Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">Working</option>
                      <option value="COMPLETED">Completed</option>
                   </select>
                </div>
                <button 
                   onClick={() => { setEditingTask(null); setShowModal(true); }}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group/btn"
                >
                   <Plus className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-500" />
                   <span className="hidden sm:inline">Add Task</span>
                </button>
             </div>
          </div>

          {/* Dynamic Task Grid */}
          <div className="space-y-6">
             {isLoading || isFetching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[1,2,3,4].map(i => (
                      <div key={i} className="h-48 bg-white border border-slate-100 rounded-[2rem] animate-pulse"></div>
                   ))}
                </div>
             ) : tasks.length === 0 ? (
                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 py-32 px-10 text-center"
                >
                   <div className="max-w-sm mx-auto space-y-6">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
                        <Plus className="text-slate-200 w-12 h-12" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your plate is currently empty.</h3>
                      <p className="text-slate-400 font-medium leading-relaxed">It seems you have addressed all goals for now. Ready to set a new benchmark?</p>
                      <button 
                         onClick={() => { setEditingTask(null); setShowModal(true); }}
                         className="text-indigo-600 font-bold hover:underline underline-offset-8 transition-all"
                      >
                         Create your first mission →
                      </button>
                   </div>
                </motion.div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                   <AnimatePresence mode="popLayout">
                      {tasks.map((task: any) => (
                         <motion.div 
                            layout
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-500 group group cursor-default relative group"
                         >
                            {/* Animated Color Accent Indicator */}
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 rounded-r-full transition-all duration-500 group-hover:h-20 ${
                                task.status === 'COMPLETED' ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]' :
                                task.status === 'IN_PROGRESS' ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-200'
                            }`}></div>

                            <div className="flex items-start sm:items-center gap-6 flex-1 min-w-0">
                               <button 
                                  onClick={() => toggleTask(task.id)} 
                                  className="shrink-0 transition-transform hover:scale-110 active:scale-90 duration-300"
                               >
                                  {task.status === 'COMPLETED' ? (
                                     <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <CheckCircle className="text-white w-6 h-6" />
                                     </div>
                                  ) : (
                                     <div className="w-10 h-10 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center group-hover:border-indigo-400 shadow-inner group-hover:shadow-md transition-all duration-500">
                                        <div className="w-4 h-4 bg-slate-100 rounded-full group-hover:bg-indigo-500 transition-all duration-500"></div>
                                     </div>
                                  )}
                               </button>

                               <div className="flex-1 min-w-0" onClick={() => { setEditingTask(task); setShowModal(true); }}>
                                  <h3 className={`font-black text-xl text-slate-800 tracking-tight transition-all truncate ${task.status === 'COMPLETED' ? 'line-through opacity-30 italic' : 'group-hover:text-indigo-600'}`}>
                                     {task.title}
                                  </h3>
                                  <p className={`text-slate-400 text-sm mt-2 line-clamp-2 font-medium leading-relaxed ${task.status === 'COMPLETED' ? 'opacity-30' : ''}`}>
                                     {task.description || 'Strategically defined objective with no additional context provided.'}
                                  </p>
                               </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-8 pt-6 sm:pt-0 border-t sm:border-0 border-slate-50">
                               <div className="flex items-center gap-2">
                                  {task.status === 'PENDING' && (
                                     <span className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 text-slate-400 font-black text-[10px] tracking-widest border border-slate-100">
                                        <Clock className="w-3.5 h-3.5" /> PENDING
                                     </span>
                                  )}
                                  {task.status === 'IN_PROGRESS' && (
                                     <span className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-[10px] tracking-widest border border-indigo-100">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-sm"></div> RUNNING
                                     </span>
                                  )}
                                  {task.status === 'COMPLETED' && (
                                     <span className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-[10px] tracking-widest border border-emerald-100 uppercase">
                                        SUCCESS
                                     </span>
                                  )}
                               </div>
                               <button 
                                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); toast.success('Mission terminated'); }} 
                                  className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 hover:scale-110 active:rotate-12 shadow-sm border border-transparent hover:border-red-100"
                               >
                                  <Trash2 className="w-6 h-6" />
                               </button>
                            </div>
                         </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
             )}
          </div>

          {/* Strategic Pagination System */}
          {totalPages > 0 && (
             <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/20 mt-12 gap-6">
                <div className="flex flex-col text-center sm:text-left">
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Temporal Navigation</span>
                   <span className="text-sm font-bold text-slate-500 mt-1.5 flex items-center gap-2 justify-center sm:justify-start">
                     <LayoutDashboard className="w-4 h-4 text-slate-300" />
                     Execution Page <span className="text-indigo-600 font-black">{page}</span> of <span className="text-slate-900 font-black">{totalPages}</span>
                   </span>
                </div>

                <div className="flex items-center gap-3">
                   <button 
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="p-5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent shadow-sm group"
                   >
                       <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                   </button>

                   <div className="hidden md:flex items-center gap-2">
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-14 h-14 rounded-2xl font-black text-sm transition-all ${
                            page === p 
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-110 ring-4 ring-indigo-500/10' 
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                          }`}
                        >
                          {p}
                        </button>
                     ))}
                   </div>

                   <button 
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="p-5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent shadow-sm group"
                   >
                       <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
          )}
       </main>

       {/* Ultra-Premium Modal Component */}
       <AnimatePresence>
          {showModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   onClick={() => setShowModal(false)} 
                   className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                ></motion.div>
                
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: 30 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: 30 }}
                   className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-full"
                >
                   <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-slate-50">
                      <div>
                         <h2 className="text-slate-900 font-black text-3xl tracking-tight leading-none mb-2">
                           {editingTask ? 'Edit Task' : 'Define Goal'}
                         </h2>
                         <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Strategy Documentation</p>
                      </div>
                      <button onClick={() => setShowModal(false)} className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors">
                        <X className="w-6 h-6" />
                      </button>
                   </div>
                   
                   <form onSubmit={handleCreateOrUpdate} className="p-10 space-y-8 overflow-y-auto">
                      <div className="space-y-3">
                         <label htmlFor="title" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Objective</label>
                         <input 
                            id="title" 
                            name="title" 
                            autoFocus
                            defaultValue={editingTask?.title || ''}
                            placeholder="What are we accomplishing today?"
                            required
                            className="w-full bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-5 transition-all font-bold text-slate-800 text-lg placeholder:text-slate-300"
                         />
                      </div>
                      <div className="space-y-3">
                         <label htmlFor="description" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contextual Details</label>
                         <textarea 
                            id="description" 
                            name="description" 
                            rows={4}
                            defaultValue={editingTask?.description || ''}
                            placeholder="Briefly describe the requirements..."
                            className="w-full bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-5 transition-all font-semibold text-slate-700 resize-none min-h-[120px] placeholder:text-slate-300"
                         ></textarea>
                      </div>
                      
                      <div className="flex gap-4 pt-4">
                         <button 
                            type="button" 
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-8 py-5 rounded-2xl text-slate-400 font-black hover:text-slate-600 transition-all uppercase tracking-widest text-xs"
                         >
                            Abort
                         </button>
                         <button 
                            type="submit"
                            className="flex-[2] px-8 py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-black hover:shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-xs"
                         >
                            {editingTask ? 'Finalize Changes' : 'Initialize Mission'}
                         </button>
                      </div>
                   </form>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  );
}
