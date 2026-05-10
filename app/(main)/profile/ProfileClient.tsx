"use client";

import { useProfile } from "@/src/hooks/profile/useProfile";
import { useProfileAction } from "@/src/hooks/profile/useProfileAction";

import {
  User,
  Mail,
  Shield,
  Lock,
  Edit3,
  ChevronRight,
  Save,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import FormShell from "@/src/components/FormShell";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";

export default function ProfilePage() {
  const { user } = useAuth();
  const {
    form,
    setForm,
    passwordForm,
    setPasswordForm,
    isLoading,
    isInfoModalOpen,
    setIsInfoModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    serverErrors,
    setServerErrors,
    handleOpenEditProfile: handleOpenEditInfo,
    handleOpenChangePassword,
    handleUpdateInfo,
    handleChangePassword,
    resetForms,
  } = useProfileAction();

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 mb-12">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            User <span className="text-blue-600">Profile</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
            Personal Information & Security Settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
                <User size={50} className="text-blue-600/50" />
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
            </div>

            <div>
              <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tight leading-none">
                {user?.fullName || "Administrator"}
              </h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">
                {user?.email}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-gray-50">
              <span className="inline-block px-6 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full tracking-[0.2em]">
                {user?.roles?.[0] || "ADMIN"}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-10 py-7 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <User size={18} className="text-blue-600" />
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Informasi Detail
                </h3>
              </div>

              <button
                onClick={() => handleOpenEditInfo()}
                className="p-2.5 text-blue-400 hover:bg-blue-50 rounded-full transition-all hover:scale-110 active:scale-95"
                title="Edit Profile"
              >
                <Edit3 size={18} />
              </button>
            </div>

            <div className="p-10 space-y-10">
              {/* Row Nama */}
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors border border-gray-100">
                  <User className="text-blue-500" size={20} />
                </div>
                <div className="flex-1 border-b border-gray-50 pb-4">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Full Name
                  </p>
                  <p className="text-lg font-bold text-gray-900 tracking-tight">
                    {user?.fullName || "Administrator"}
                  </p>
                </div>
              </div>

              {/* Row Email */}
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors border border-gray-100">
                  <Mail className="text-blue-500" size={20} />
                </div>
                <div className="flex-1 border-b border-gray-50 pb-4">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Email Address
                  </p>
                  <p className="text-lg font-bold text-gray-900 tracking-tight lowercase">
                    {user?.email || "admin@vending.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Shield size={18} className="text-blue-600" />
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Keamanan & Akses
                </h3>
              </div>

              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="p-2.5 text-blue-400 hover:bg-blue-50 rounded-full transition-all hover:scale-110 active:scale-95"
                title="Ubah Password"
              >
                <Edit3 size={18} />
              </button>
            </div>

            <button className="w-full flex items-center gap-6 p-6 bg-slate-50/50 hover:bg-slate-50 border border-gray-100 rounded-[2rem] transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-red-500 transition-all shadow-sm border border-gray-100">
                <Lock className="text-blue-500" size={24} />
              </div>
              <div className="text-left">
                <p className="font-black text-gray-900 uppercase italic tracking-tight">
                  Change Password
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Update your access credentials
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <FormShell
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Edit Profile Information"
      >
        <form onSubmit={handleUpdateInfo} className="space-y-8 py-2">
          <Input
            label="Full Name"
            placeholder="Masukkan Nama Lengkap"
            value={form.fullName}
            error={serverErrors.FullName?.[0]}
            onChange={(e) => {
              setForm({ ...form, fullName: e.target.value });
              if (serverErrors.FullName)
                setServerErrors({ ...serverErrors, FullName: [] });
            }}
          />

          <Input
            label="Email Address"
            placeholder="nama@contoh.com"
            value={form.email}
            error={serverErrors.Email?.[0]}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (serverErrors.Email)
                setServerErrors({ ...serverErrors, Email: [] });
            }}
          />

          <div className="pt-6 flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isLoading}
              onClick={() => setIsInfoModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1"
              icon={<Save size={18} />}
              isLoading={isLoading}
            >
              Simpan Profil
            </Button>
          </div>
        </form>
      </FormShell>

      <FormShell
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Account Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-8 py-2">
          <Input
            label="Password Lama"
            type="password"
            placeholder="••••••••"
            value={passwordForm.oldPassword}
            error={serverErrors.OldPassword?.[0]}
            onChange={(e) => {
              setPasswordForm({ ...passwordForm, oldPassword: e.target.value });
              if (serverErrors.OldPassword)
                setServerErrors({ ...serverErrors, OldPassword: [] });
            }}
          />

          <Input
            label="Password Baru"
            type="password"
            placeholder="••••••••"
            value={passwordForm.newPassword}
            error={serverErrors.NewPassword?.[0]}
            onChange={(e) => {
              setPasswordForm({ ...passwordForm, newPassword: e.target.value });
              if (serverErrors.NewPassword)
                setServerErrors({ ...serverErrors, NewPassword: [] });
            }}
          />

          <Input
            label="Konfirmasi Password Baru"
            type="password"
            placeholder="••••••••"
            value={passwordForm.confirmPassword}
            error={serverErrors.confirmPassword?.[0]}
            onChange={(e) => {
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              });
              if (serverErrors.confirmPassword)
                setServerErrors({ ...serverErrors, confirmPassword: [] });
            }}
          />

          <div className="pt-6 flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isLoading}
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1"
              icon={<Lock size={18} />}
              isLoading={isLoading}
            >
              Ganti Password
            </Button>
          </div>
        </form>
      </FormShell>
    </div>
  );
}
