import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Flex,
  Input,
  Select,
  IconButton,
  Spinner,
  useColorModeValue,
  TableProps
} from '@chakra-ui/react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  isNumeric?: boolean;
  sortable?: boolean;
};

export interface DataTableProps<T extends Record<string, any>> extends Omit<TableProps, 'children'> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  emptyStateMessage?: string;
  variant?: 'simple' | 'striped' | 'glass';
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  searchable = false,
  sortable = false,
  pagination = false,
  pageSize = 10,
  onRowClick,
  emptyStateMessage = 'No data available',
  variant = 'simple',
  ...rest
}: DataTableProps<T>) {
  // State for pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState<{ column: keyof T | null; direction: 'asc' | 'desc' }>({
    column: null,
    direction: 'asc',
  });

  // Calculate table background based on variant
  const tableBg = useColorModeValue(
    variant === 'glass' ? 'whiteAlpha.800' : 'white',
    variant === 'glass' ? 'blackAlpha.400' : 'gray.800'
  );
  
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!search) return data;
    
    return data.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [data, search]);

  // Sort data based on column
  const sortedData = React.useMemo(() => {
    if (!sort.column) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sort.column];
      const bValue = b[sort.column];
      
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const compare = aValue > bValue ? 1 : -1;
      return sort.direction === 'asc' ? compare : -compare;
    });
  }, [filteredData, sort]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Calculate total pages
  const totalPages = React.useMemo(() => {
    return Math.ceil(sortedData.length / pageSize);
  }, [sortedData, pageSize]);

  // Handler for changing sort
  const handleSort = (column: keyof T) => {
    if (!sortable) return;
    
    setSort((prevSort) => {
      if (prevSort.column === column) {
        return {
          column,
          direction: prevSort.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { column, direction: 'asc' };
    });
  };

  // Handler for changing page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  // Render cell content
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor] as React.ReactNode;
  };

  // Glass effect styles when using the glass variant
  const glassStyles = variant === 'glass' ? {
    backdropFilter: 'blur(10px)',
    borderRadius: 'md', 
    borderWidth: '1px',
    boxShadow: 'sm'
  } : {};
  
  return (
    <Box width="100%">
      {searchable && (
        <Flex mb={4}>
          <Box position="relative" w="full" maxW="sm">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              pl={10}
            />
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
              <FiSearch />
            </Box>
          </Box>
        </Flex>
      )}

      <TableContainer
        {...glassStyles}
        bg={tableBg}
        borderColor={borderColor}
      >
        <Table variant={variant === 'glass' ? 'simple' : variant} {...rest}>
          <Thead>
            <Tr>
              {columns.map((column, i) => (
                <Th
                  key={i}
                  isNumeric={column.isNumeric}
                  cursor={sortable && column.sortable !== false ? 'pointer' : 'default'}
                  onClick={() => column.sortable !== false && handleSort(column.accessor as keyof T)}
                >
                  {column.header}
                  {sortable && column.sortable !== false && sort.column === column.accessor && (
                    <Text as="span" ml={1}>
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </Text>
                  )}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={columns.length} textAlign="center" py={10}>
                  <Spinner size="lg" />
                </Td>
              </Tr>
            ) : paginatedData.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} textAlign="center" py={10}>
                  {emptyStateMessage}
                </Td>
              </Tr>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <Tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(item)}
                  cursor={onRowClick ? 'pointer' : 'default'}
                  _hover={{ bg: onRowClick ? hoverBg : undefined }}
                >
                  {columns.map((column, colIndex) => (
                    <Td key={colIndex} isNumeric={column.isNumeric}>
                      {renderCell(item, column)}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {pagination && totalPages > 1 && (
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Text fontSize="sm">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </Text>
          <Flex alignItems="center">
            <IconButton
              aria-label="Previous page"
              icon={<FiChevronLeft />}
              isDisabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              size="sm"
              mr={2}
            />
            <Select
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              size="sm"
              width="auto"
              mx={2}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
            <Text fontSize="sm" mx={2}>
              of {totalPages}
            </Text>
            <IconButton
              aria-label="Next page"
              icon={<FiChevronRight />}
              isDisabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              size="sm"
              ml={2}
            />
          </Flex>
        </Flex>
      )}
    </Box>
  );
}

export default DataTable; 