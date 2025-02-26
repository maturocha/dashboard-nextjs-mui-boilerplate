'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Table from '@/components/table/Table';

import { useAppContext } from "@/context/AppContext";
import { ModalType } from '@/types/app';

interface PageListProps {
  title: string;
  createPath?: string;
}

const PageList: React.FC<PageListProps> = ({
  title,
  createPath
}) => {
  const router = useRouter();

  return (
    <Box sx={{ height: '100%', p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h4">
          {title}
        </Typography>
        {createPath && (
          <IconButton 
            color="primary"
            onClick={() => router.push(createPath)}
          >
            <AddIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default DynamicPageList;