import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { ShieldCheck, Loader2 } from 'lucide-react';
export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr('');
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            navigate('/');
        }
        catch (e) {
            setErr(e.message || 'Login failed.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "h-screen flex items-center justify-center bg-slate-950 p-4", children: _jsxs("form", { onSubmit: handleLogin, className: "w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl", children: [_jsxs("div", { className: "flex flex-col items-center mb-2", children: [_jsx(ShieldCheck, { className: "w-10 h-10 text-brand-500 mb-2" }), _jsx("h1", { className: "text-xl font-bold text-white", children: "Administrator Sign In" }), _jsx("p", { className: "text-xs text-slate-400", children: "Authorized personnel only" })] }), err && _jsx("div", { className: "text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20", children: err }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Email" }), _jsx("input", { type: "email", required: true, value: email, onChange: e => setEmail(e.target.value), className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Password" }), _jsx("input", { type: "password", required: true, value: password, onChange: e => setPassword(e.target.value), className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full p-3 bg-brand-600 hover:bg-brand-500 rounded-xl font-semibold text-sm text-white flex justify-center active:scale-95 transition", children: loading ? _jsx(Loader2, { className: "animate-spin w-4 h-4" }) : 'Sign In' })] }) }));
};
