"use client";

import { 
  Box,
  Typography, 
  Button,
  Chip,
  Grid,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import MenuList from "@/components/table/MenuList";
import { useList } from "@/hooks/useList";
import { apiWrapper } from "@/utils/api/apiWrapper";
import Table from "@/components/table/Table";
import { api, columnsTable, User, views, labels } from "@/models/User";

import { useAppContext } from "@/context/AppContext";
import { ModalType } from "@/types/app";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Role, api as roleApi } from "@/models/Role";
import { useScrollPosition } from '@/hooks/useScrollPosition';

const fetchUsers = async ({ page, perPage, sortBy, sortType, filters }: any) => {
  const response = await apiWrapper.get(api.list, {
    page,
    perPage,
    sortBy,
    sortType,
    ...filters,
  });

  return {
    data: response.data,
    total: response.total,
  };
};

export default function UsersPageList() {
  const {
    loading,
    error,
    data: users,
    pagination,
    setPagination,
    sorting,
    setSorting,
    filters,
    setFilters,
    handleSearching,
    refetch
  } = useList({
    fetchData: fetchUsers,
    defaultSorting: { by: "name", type: "asc" },
    defaultPagination: { page: 1, perPage: 10 },
  });

  const router = useRouter();
  const { openModal, showToast } = useAppContext();
  const [filtersList, setFiltersList] = useState<Array<{
    label: string;
    name: string;
    info?: string;
    options: Array<{ id: number; name: string }>;
  }>>([]);

  const fetchRoles = async () => {
    const response = await apiWrapper.get(roleApi.list);
    setFiltersList([{
      label: 'Rol',
      name: 'role_id',
      info: 'Filtrar por rol de usuario',
      options: response.data.map((role: Role) => ({
        id: role.id,
        name: role.name
      }))
    }]);
  };

  const { saveScrollPosition } = useScrollPosition({
    key: 'usersListScrollPosition',
    dependencies: [loading, users],
    isReady: !loading && users.length > 0
  });

  const handleEdit = (userId: string) => {
    saveScrollPosition();
    router.push(views.update.replace(":id", userId));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (user: User) => {

    const userId = user.id.toString()

    openModal(
      ModalType.CONFIRM,
      "Eliminar Usuario",
      `¿Está seguro que desea eliminar a ${user.name}?`,
      async () => {
        try {
          await apiWrapper.delete(api.delete.replace(':id', userId));
          showToast("Usuario eliminado correctamente");
          refetch();
        } catch (error) {
          console.error("Error al eliminar:", error);
        }
      }
    );
  };

  const columns = columnsTable;

  const transformedData = users.map((user: User) => ({
    name: user.name,
    email: user.email,
    rol: (<Chip color="primary" label={user.rol} />),
    actions: (
      <MenuList
      listItems={[
        {
          title: "Editar",
          onClick: () => handleEdit(user.id.toString()),
        },
        {
          title: "Eliminar",
          onClick: () => handleDelete(user),
        },
      ]}
    />
    ),
  }));

  return (
    <Box>
    
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" gap={4} mb={2} margin={'0 auto'}>
        <Typography variant="h3" sx={{ fontSize: "2rem"}}>{labels.plural}</Typography>
        <Button variant="contained" color="primary" onClick={() => router.push(views.create)} startIcon={<AddIcon />}>Crear {labels.singular}</Button>
      </Box>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
    
        <Table
          loading={loading}
          data={transformedData}
          columns={columns}
          total={pagination.total}
          page={pagination.page}
          perPage={pagination.perPage}
          sortBy={sorting.by}
          sortType={sorting.type}
          onChangePage={(page) => setPagination({ ...pagination, page })}
          onChangePerPage={(perPage) => setPagination({ ...pagination, perPage })}
          headerCellClicked={(sortBy) =>
            setSorting({ by: sortBy, type: sorting.type === "asc" ? "desc" : "asc" })
          }
          onFilter={(filter) => setFilters({ ...filters, [filter.name]: filter.value })}
          onFilterRemove={(key) => {
            const newFilters = { ...filters };
            delete newFilters[key];
            setFilters(newFilters);
          }}
          hasSearch={true}
          onSearch={handleSearching}
          searchTextDefault={filters.search}
          filteredList={filtersList}
          filters={filters}
        />
    </Box>
  );
}
