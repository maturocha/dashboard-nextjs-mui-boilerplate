"use client";

import { 
  Box, 
  Typography, 
  Button
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import MenuList from "@/components/table/MenuList";
import { useList } from "@/hooks/useList";
import { apiWrapper } from "@/utils/api/apiWrapper";
import Table from "@/components/table/Table";
import { api, columnsTable, Category, views, labels } from "@/models/Category";

import { useAppContext } from "@/context/AppContext";
import { ModalType } from "@/types/app";
import { useRouter } from "next/navigation";
import { useScrollPosition } from '@/hooks/useScrollPosition';

const fetchCategories = async ({ page, perPage, sortBy, sortType, filters }: any) => {
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
    fetchData: fetchCategories,
    defaultSorting: { by: "name", type: "asc" },
    defaultPagination: { page: 1, perPage: 10 },
  });

  const router = useRouter();
  const { openModal, showToast } = useAppContext();

  const { saveScrollPosition } = useScrollPosition({
    key: 'usersListScrollPosition',
    dependencies: [loading, users],
    isReady: !loading && users.length > 0
  });

  const handleEdit = (userId: string) => {
    saveScrollPosition();
    router.push(views.update.replace(":id", userId));
  };

const handleDelete = async (category: Category) => {

  const resourceId = category.id.toString()

    openModal(
      ModalType.CONFIRM,
      "Eliminar Categoría",
      `¿Está seguro que desea eliminar ${category.name}?`,
      async () => {
        try {
          await apiWrapper.delete(api.delete.replace(':id', resourceId));
          showToast("Categoría eliminada correctamente");
          refetch();
        } catch (error) {
          console.error("Error al eliminar:", error);
        }
      }
    );
  };

  const columns = columnsTable;

  const transformedData = users.map((category: Category) => ({
    name: (
      <Box sx={{ 
        minWidth: '150px',
        maxWidth: '250px',
        px: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {category.name}
      </Box>
    ),
    actions: (
      <Box sx={{ 
        minWidth: '80px',
        px: 1,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <MenuList
          listItems={[
            {
              title: "Editar",
              onClick: () => handleEdit(category.id.toString()),
            },
            {
              title: "Eliminar",
              onClick: () => handleDelete(category),
            },
          ]}
        />
      </Box>
    ),
  }));

  return (
    <Box sx={{ width: "100%", padding: { xs: 1, sm: 2 } }}>
     <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" gap={4} mb={2} margin={'0 auto'}>
        <Typography variant="h3" sx={{ fontSize: "2rem"}}>{labels.plural}</Typography>
        <Button variant="contained" color="primary" onClick={() => router.push(views.create)} startIcon={<AddIcon />}>Crear {labels.singular}</Button>
      </Box>
    {error && <Typography color="error" mb={2}>{error}</Typography>}
    <Box sx={{ width: "100%", overflowX: "auto" }}>
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
          
        />
      </Box>
    </Box>
  );
}
