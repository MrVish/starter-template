import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Flex
} from '@chakra-ui/react';

export const PageHeader = ({ 
  title, 
  subtitle,
  extra = null
}) => {
  return (
    <Box mb={6}>
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Heading as="h1" size="xl" mb={1}>{title}</Heading>
          {subtitle && <Text color="gray.600">{subtitle}</Text>}
        </Box>
        
        {extra && (
          <Box>
            {extra}
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default PageHeader; 