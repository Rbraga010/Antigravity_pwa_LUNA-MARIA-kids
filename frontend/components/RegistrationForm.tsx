
import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Baby, Calendar, Check, ChevronRight, Loader2 } from 'lucide-react';

interface RegistrationFormProps {
    onSubmit: (data: any) => Promise<boolean>;
    loading?: boolean;
    isModal?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, loading = false, isModal = false }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [numChildren, setNumChildren] = useState(0);
    const [childrenDetails, setChildrenDetails] = useState<{ name: string; birthDate: string }[]>([]);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            setErrorMsg('Preencha os campos obrigatórios!');
            return;
        }

        const success = await onSubmit({
            name,
            email,
            password,
            phone,
            numChildren,
            childrenDetails
        });

        if (!success) {
            // Error handled by parent usually, but we can clear or shaake here
        }
    };

    const handleNumChildrenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = parseInt(e.target.value) || 0;
        setNumChildren(val);
        setChildrenDetails(Array.from({ length: val }, (_, i) => childrenDetails[i] || { name: '', birthDate: '' }));
    };

    const handleChildChange = (idx: number, field: 'name' | 'birthDate', value: string) => {
        const newDetails = [...childrenDetails];
        newDetails[idx] = { ...newDetails[idx], [field]: value };
        setChildrenDetails(newDetails);
    };

    return (
        <div className={`w-full ${isModal ? '' : 'lg:max-w-md'} bg-white/80 backdrop-blur-xl p-8 lg:p-10 rounded-[48px] shadow-2xl border border-pink-100/50 relative overflow-hidden transition-all duration-300 hover:shadow-pink-100/50`}>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl -ml-10 -mb-10"></div>

            <div className="relative space-y-6">
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic leading-tight">
                        {isModal ? 'Junte-se à Família' : 'Faça seu cadastro'}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        e acesse uma Lua de Ofertas todos os dias.
                    </p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                    {/* Name */}
                    <div className="group relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-pink-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Seu Nome Completo"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/50 border border-gray-100 text-sm font-bold text-[#6B5A53] focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all placeholder:text-gray-300"
                        />
                    </div>

                    {/* Email */}
                    <div className="group relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-pink-400 transition-colors" size={18} />
                        <input
                            type="email"
                            placeholder="Seu Melhor E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/50 border border-gray-100 text-sm font-bold text-[#6B5A53] focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all placeholder:text-gray-300"
                        />
                    </div>

                    {/* Phone */}
                    <div className="group relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-pink-400 transition-colors" size={18} />
                        <input
                            type="tel"
                            placeholder="Telefone / WhatsApp"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/50 border border-gray-100 text-sm font-bold text-[#6B5A53] focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all placeholder:text-gray-300"
                        />
                    </div>

                    {/* Password */}
                    <div className="group relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-pink-400 transition-colors" size={18} />
                        <input
                            type="password"
                            placeholder="Criar Senha Mágica"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/50 border border-gray-100 text-sm font-bold text-[#6B5A53] focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all placeholder:text-gray-300"
                        />
                    </div>

                    {/* Children Selector */}
                    <div className="bg-pink-50/30 p-4 rounded-3xl border border-pink-100/50 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-pink-100 p-2 rounded-xl text-pink-500"><Baby size={20} /></div>
                            <label className="text-xs font-black text-[#6B5A53] uppercase tracking-widest">Tem Filhos?</label>
                        </div>
                        <select
                            value={numChildren}
                            onChange={handleNumChildrenChange}
                            className="w-full px-6 py-3 rounded-2xl bg-white border border-pink-100 text-sm font-bold text-[#6B5A53] focus:outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer appearance-none"
                            style={{ backgroundImage: 'none' }}
                        >
                            <option value="0">Ainda não / Prefiro não informar</option>
                            <option value="1">Tenho 1 Filho(a)</option>
                            <option value="2">Tenho 2 Filhos(as)</option>
                            <option value="3">Tenho 3 Filhos(as)</option>
                            <option value="4">4 ou mais</option>
                        </select>

                        {/* Children Inputs */}
                        <div className="space-y-3">
                            {childrenDetails.map((child, idx) => (
                                <div key={idx} className="space-y-3 p-4 bg-white/80 rounded-2xl border border-pink-50 animate-in slide-in-from-top-2 duration-300 shadow-sm">
                                    <div className="flex items-center gap-2 text-pink-300">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Criança {idx + 1}</span>
                                        <div className="h-px bg-pink-100 flex-1"></div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={`Nome do ${idx + 1}º filho(a)`}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                                        value={child.name}
                                        onChange={(e) => handleChildChange(idx, 'name', e.target.value)}
                                    />
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                            value={child.birthDate}
                                            onChange={(e) => handleChildChange(idx, 'birthDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-400 text-xs font-bold rounded-xl text-center animate-in fade-in">
                            {errorMsg}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-5 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-[28px] font-black uppercase text-xs tracking-widest shadow-xl shadow-pink-200/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                        <span>{loading ? 'Criando Mágica...' : 'Finalizar Cadastro'}</span>
                        {!loading && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
