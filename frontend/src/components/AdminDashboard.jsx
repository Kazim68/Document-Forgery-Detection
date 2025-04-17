import React, { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import { toast } from "react-toastify";
import { logout } from '../redux/authSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleSignOut = () => {
        dispatch(logout());
        toast.success("Signed out successfully");
        navigate("/signin", { replace: true });
    };


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminApi.getAllUsers();
                setUsers(data);
            } catch (err) {
                toast.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-[#0d1117] text-white px-6 py-10">
            <h1 className="text-3xl font-bold text-[#c9d1d9] mb-6">Admin Dashboard</h1>
            <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
                Sign Out
            </button>

            {loading ? (
                <p className="text-[#8b949e]">Loading users...</p>
            ) : users.length === 0 ? (
                <p className="text-[#8b949e]">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow">
                        <thead className="bg-[#21262d] text-[#c9d1d9] text-left">
                            <tr>
                                <th className="py-3 px-4 border-b border-[#30363d]">Name</th>
                                <th className="py-3 px-4 border-b border-[#30363d]">Email</th>
                                <th className="py-3 px-4 border-b border-[#30363d]">Verified</th>
                                <th className="py-3 px-4 border-b border-[#30363d]">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-[#21262d]">
                                    <td className="py-3 px-4 border-b border-[#30363d]">{user.name}</td>
                                    <td className="py-3 px-4 border-b border-[#30363d]">{user.email}</td>
                                    <td className="py-3 px-4 border-b border-[#30363d]">
                                        {user.is_verified ? "✅ Yes" : "❌ No"}
                                    </td>
                                    <td className="py-3 px-4 border-b border-[#30363d]">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
