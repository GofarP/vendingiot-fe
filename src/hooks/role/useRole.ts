import { useState, useEffect, useCallback } from "react";
import { roleService, Role } from "@/src/services/roleServices";
import { refresh } from "next/cache";


export function useRole(searchQuery: string) {
  const [role, setRole] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [meta, setMeta] = useState({ currentPage: 1, pageSize: 10, totalCount: 0, totalPages: 1 });


  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roleService.getAll(page, pageSize, searchQuery);
      setRole(res.data || []);
      setMeta(res.pagination || meta);
    } catch (err: any) {
      console.error(err)
    } finally { setLoading(false) }
  }, [page, pageSize, searchQuery]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  return { role, loading, meta, setPage, setPageSize, refresh: fetchRoles };


}