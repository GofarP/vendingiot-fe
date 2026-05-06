import { useState, useMemo } from "react";
import { PermissionGroup } from "../role/useRole";
import { group } from "console";

export function usePermissionFilter(initialGroups: PermissionGroup[]) {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredGroups = useMemo(() => {
        if (!searchTerm.trim()) return initialGroups;
        const lowerSearch = searchTerm.toLowerCase();

        return initialGroups
            .map((group) => ({
                ...group,
                permissions: group.permissions.filter((p) =>
                    p.name.toLowerCase().includes(lowerSearch)
                ),
            }))
            .filter((group) => group.permissions.length > 0);
        ;
    },[searchTerm, initialGroups]);

    return {searchTerm, setSearchTerm, filteredGroups};
}