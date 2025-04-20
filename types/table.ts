export interface FilterModalProps {
    open: boolean;
    onClose: () => void;
    filteredList?: Array<{
        label: string;
        name: string;
        info?: string;
        options: Array<{ id: number; name: string }>;
    }>;
    filters: Record<string, any>;
    onFilter: (filterData: { name: string; value: any }) => void;
}

export interface InputSearchProps {
    handleSearch: (value: string) => void;
    searchTextDefault: string;
}

export interface TableToolbarProps {
    exportButton?: string;
    filters?: Record<string, any> | undefined;
    onFilter?: (filter: { name: string; value: any }) => void;
    onFilterRemove?: (filter: string) => void;
    onSearch?: (text: string) => void;
    filteredList?: Array<{
        label: string;
        name: string;
        info?: string;
        options: Array<{ id: number; name: string }>;
    }>;
    hasSearch?: boolean;
    searchTextDefault?: string;
    title?: string;
}

export interface ActiveFilter {
    key: string;
    label: string;
    optionName: string;
}

export interface MenuListProps {
    idItem?: string | number;
    path?: string;
    history?: any;
    listItems: Array<{
      title: string;
      icon?: React.ReactNode;
      onClick: () => void;
    }>;
  }

export interface TableProps {
    exportButton?: boolean;
    columns: Array<{
        name: string;
        property: string;
        sort?: boolean;
        numeric?: boolean;
    }>;
    data: Array<any>;
    total: number;
    sortType?: 'asc' | 'desc';
    sortBy?: string;
    headerCellClicked: (property: string) => void;
    page: number;
    perPage: number;
    onChangePage: (page: number) => void;
    onChangePerPage: (perPage: number, page: number) => void;
    filters?: Record<string, any>;
    selectFilter?: Record<string, any>;
    onFilter?: (filter: any) => void;
    onFilterRemove?: (filter: string) => void;
    filteredList?: Array<any>;
    hasSearch?: boolean;
    onSearch?: (text: string) => void;
    searchTextDefault?: string;
    loading?: boolean;
}