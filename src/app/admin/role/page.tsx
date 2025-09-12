"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../utils/supabase/client";
import AdminSideBar from "@/components/AdminSideBar";
import AdminRouteGuard from "@/components/AdminRouteGuard"; // make sure you import it

interface User {
  id: string;
  username: string;
  role: string;
  email: string;
  created_at: string;
}

export default function RoleManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching users...");

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, username, role, created_at")
        .order("created_at", { ascending: false });

      console.log("Fetch result:", { data, error: fetchError });

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        setError("Failed to load users: " + fetchError.message);

        const { data: simpleData, error: simpleError } = await supabase
          .from("profiles")
          .select("*")
          .limit(5);

        console.log("Simple fetch result:", { simpleData, simpleError });

        if (simpleError) {
          setError("Database error: " + simpleError.message);
        } else {
          setUsers(simpleData as User[]);
        }
      } else {
        setUsers(data as User[]);
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("Unexpected error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        console.error("Update error:", error);
        setError("Failed to update user: " + error.message);
      } else {
        fetchUsers();
      }
    } catch (err: any) {
      console.error("Update unexpected error:", err);
      setError("Unexpected error: " + err.message);
    }
  };

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen">
        <AdminSideBar />
        <div className="flex-1 container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="text-lg mb-4">Loading users...</div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <button
                onClick={() => setLoading(false)}
                className="mt-4 text-blue-600 underline"
              >
                Cancel loading
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6">User Role Management</h1>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                  <button
                    onClick={fetchUsers}
                    className="ml-4 text-red-800 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              <div className="mb-4">
                <button
                  onClick={fetchUsers}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Refresh Users
                </button>
              </div>

              {users.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.role !== "admin" ? (
                              <button
                                onClick={() => updateUserRole(user.id, "admin")}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Make Admin
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  updateUserRole(user.id, "customer")
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Make Customer
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500">No users found in the database.</div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminRouteGuard>
  );
}
