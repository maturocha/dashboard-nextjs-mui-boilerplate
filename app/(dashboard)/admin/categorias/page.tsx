"use client";

import { 
  Box, 
  Typography
} from "@mui/material";

import MenuList from "@/components/table/MenuList";
import { useList } from "@/hooks/useList";
import { apiWrapper } from "@/utils/api/apiWrapper";
import Table from "@/components/table/Table";
import { api, columnsTable, Category, views, labels } from "@/models/Category";

import { useAppContext } from "@/context/AppContext";
import { ModalType } from "@/types/app";
import { useRouter } from "next/navigation";
import { useScrollPosition } from '@/hooks/useScrollPosition';
import PageHeader from "@/components/layout/page/PageHeader";

import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"

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

export default function CategoriesPageList() {
  const {
    loading,
    error,
    data: categories,
    pagination,
    setPagination,
    sorting,
    setSorting,
    filters,
    setFilters,
    handleSearching,
    forceRefetch
  } = useList({
    fetchData: fetchCategories,
    defaultSorting: { by: "name", type: "asc" },
    defaultPagination: { page: 1, perPage: 10 },
  });

  const router = useRouter();
  const { openModal, showToast } = useAppContext();

  const { saveScrollPosition } = useScrollPosition({
    key: 'categoriesListScrollPosition',
    dependencies: [loading, categories],
    isReady: !loading && categories.length > 0
  });

  const handleEdit = (categoryId: string) => {
    saveScrollPosition();
    router.push(views.update.replace(":id", categoryId));
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
          forceRefetch();
        } catch (error) {
          console.error("Error al eliminar:", error);
        }
      }
    );
  };

  const columns = columnsTable;

  const transformedData = categories.map((category: Category) => ({
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
    slug: (
      <Box sx={{ 
        minWidth: '150px',
        maxWidth: '250px',
        px: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        <a href={`${process.env.NEXT_PUBLIC_STORE_API}/categoria/${category.slug}`} target="_blank">
          /{category.slug}
        </a>
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
              icon: <EditIcon fontSize="small" />,
              onClick: () => handleEdit(category.id.toString()),
            },
            {
              title: "Eliminar",
              icon: <DeleteIcon fontSize="small"/>,
              onClick: () => handleDelete(category),
            },
          ]}
        />
      </Box>
    ),
  }));

  return (
    <Box sx={{ maxWidth: "100%" }}>
    {/* Header con título y botón de nuevo producto */}
    
     <PageHeader
      title={labels.plural}
      subtitle="Gestión de categorías"
      cta={{
        label: `Crear ${labels.singular}`,
        onClick: () => router.push(views.create),
        icon: <AddIcon fontSize="small" />
      }} />
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
