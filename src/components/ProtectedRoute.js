import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
export const ProtectedRoute = () => {
    const { currentUser, isAuthorizedAdmin, isLoading, signOut } = useAuth();
    if (isLoading)
        return _jsx("div", { className: "h-screen flex items-center justify-center bg-slate-950 text-white", children: _jsx(Loader2, { className: "animate-spin w-8 h-8" }) });
    if (!currentUser)
        return _jsx(Navigate, { to: "/login", replace: true });
    if (!isAuthorizedAdmin)
        return (_jsxs("div", { className: "h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4 text-center", children: [_jsx(ShieldAlert, { className: "w-12 h-12 text-red-500 mb-2" }), _jsx("h1", { className: "text-xl font-bold", children: "Unauthorized Administrator" }), _jsx("p", { className: "text-sm text-slate-400 mt-1 max-w-sm", children: "Your account UID is not configured in /admins." }), _jsx("button", { onClick: signOut, className: "mt-4 px-4 py-2 bg-slate-800 rounded-xl text-sm", children: "Sign Out" })] }));
    return _jsx(Outlet, {});
};
