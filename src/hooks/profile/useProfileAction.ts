"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import profileService, { ChangePassword, UpdateProfile } from "@/src/services/profileServices";
import { toast } from "sonner";
import { LoginResponse } from "@/src/types/auth";

export const useProfileAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form States
  const [form, setForm] = useState<UpdateProfile>({ fullName: "", email: "",photoUrl:"",photo:null });
  const [passwordForm, setPasswordForm] = useState<ChangePassword>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const { user, setUser } = useAuth();

  const resetForms = () => {
    setServerErrors({});
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleOpenEditProfile = () => {
    resetForms();
    if (user) {
      setForm({
        photoUrl:user.photoUrl,
        fullName: user.fullName,
        email: user.email,
      });
    }
    setIsInfoModalOpen(true);
  };

  const handleOpenChangePassword = () => {
    resetForms();
    setIsPasswordModalOpen(true);
  };

  // 1. Update Profile Info Action
  const handleUpdateInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setServerErrors({});

    try {
      const response = await profileService.updateProfile(form);
      const token = sessionStorage.getItem("token");

      setUser({
        ...user,
        fullName: form.fullName,
        email: form.email,
        accessToken: token ?? "",
        tokenType: user?.tokenType ?? "Bearer",
        expiresIn: user?.expiresIn ?? 0,
        roles: user?.roles ?? [],
        permissions: user?.permissions ?? [],
      } as LoginResponse);

      toast.success("Profil berhasil diperbarui!");
      setIsInfoModalOpen(false);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setServerErrors(err.response.data.errors);
        toast.error("Gagal memperbarui: Periksa kembali isian Anda.");
      } else {
        toast.error(err.response?.data?.message || "Gagal memperbarui profil");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Change Password Action
  const handleChangePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setServerErrors({ confirmPassword: ["Konfirmasi password tidak cocok!"] });
      return;
    }

    setIsLoading(true);
    setServerErrors({});

    try {
      await profileService.changePassword(passwordForm);
      toast.success("Password berhasil diubah!");
      setIsPasswordModalOpen(false);
      resetForms();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setServerErrors(err.response.data.errors);
        toast.error("Gagal mengubah password: Periksa kembali data Anda.");
      } else {
        toast.error(err.response?.data?.message || "Gagal mengubah password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // States
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

    handleOpenEditProfile: handleOpenEditProfile,
    handleOpenChangePassword,
    handleUpdateInfo,
    handleChangePassword,
    resetForms
  };
};