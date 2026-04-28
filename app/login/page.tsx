"use client";

import { useState } from "react";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import { useLogin } from "@/src/hooks/login/useLogin";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { performLogin, isLoading, error, fieldErrors } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performLogin({
      Email: formData.email,
      Password: formData.password,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 border border-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white text-2xl font-black">V</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Selamat Datang
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            Masukkan kredensial Anda untuk masuk
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center border border-red-100 animate-in fade-in zoom-in">
              {error}
            </div>
          )}

          <Input
            label="Alamat Email"
            description="Gunakan email kantor atau pribadi"
            type="email"
            placeholder="email@anda.com"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={fieldErrors.Email?.[0]}
          />

          <div className="space-y-1">
            <Input
              label="Kata Sandi"
              description="Silahkan Masukkan Password Akun Anda"
              type="password"
              placeholder="Masukkan Password Anda"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={fieldErrors.Password?.[0]}
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
              >
                Lupa Password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 mt-2 shadow-xl shadow-blue-100"
            isLoading={isLoading}
          >
            Masuk Sekarang
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-sm text-gray-500 font-medium">
            Belum punya akun?{" "}
            <button className="text-blue-600 font-bold hover:underline">
              Daftar Gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
