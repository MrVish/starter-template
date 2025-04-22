'use client';

import React from 'react';
import {
  Box,
  Flex,
  Icon,
  Text,
  Stack,
  VStack,
  Divider,
  Collapse,
  useDisclosure,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiChevronDown,
  FiUser,
  FiBarChart2,
  FiAlertCircle,
  FiDatabase,
  FiBriefcase,
  FiLogOut,
} from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface NavItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
  requireAdmin?: boolean;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NavItem = ({ icon, children, href, isActive, requireAdmin = false }: NavItemProps) => {
  const { data: session } = useSession();
  
  // Don't render admin-only items for non-admin users
  if (requireAdmin && !session?.user) {
    return null;
  }
  
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'primary.500' : 'transparent'}
        color={isActive ? 'white' : 'secondary.700'}
        _hover={{
          bg: isActive ? 'primary.600' : 'background.500',
          color: isActive ? 'white' : 'primary.500',
        }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
            color={isActive ? 'white' : 'secondary.500'}
            _groupHover={{
              color: isActive ? 'white' : 'primary.500',
            }}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const SubNav = ({ label, children, icon, href, isActive }: any) => {
  const { isOpen, onToggle } = useDisclosure();
  
  return (
    <Box>
      <Flex
        py={2}
        px={4}
        mx={4}
        borderRadius="lg"
        cursor="pointer"
        bg={isActive ? 'accent.500' : 'transparent'}
        color={isActive ? 'white' : 'secondary.700'}
        _hover={{
          bg: isActive ? 'accent.600' : 'background.500',
          color: isActive ? 'white' : 'accent.500',
        }}
        onClick={children ? onToggle : undefined}
        justify="space-between"
        align="center"
      >
        <Flex align="center">
          {icon && <Icon as={icon} mr={3} />}
          <Text fontWeight={500}>{label}</Text>
        </Flex>
        {children && (
          <Icon
            as={FiChevronDown}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Stack
          mt={2}
          pl={8}
          ml={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={'secondary.200'}
          align={'start'}
          spacing={1}
        >
          {children}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const NAV_ITEMS = [
    { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { name: 'Analytics', icon: FiBarChart2, href: '/analytics' },
    { name: 'Models', icon: FiBriefcase, href: '/models' },
    { 
      name: 'Risk Management', 
      icon: FiAlertCircle, 
      href: '/risk', 
      children: [
        { name: 'Risk Assessment', href: '/risk/assessment' },
        { name: 'Monitoring', href: '/risk/monitoring' },
      ]
    },
    { name: 'Data Explorer', icon: FiDatabase, href: '/data' },
    { name: 'Settings', icon: FiSettings, href: '/settings' },
  ];
  
  const isPathActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    if (path !== '/dashboard' && pathname?.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  return (
    <Box
      transition="0.3s ease"
      bg={useColorModeValue('white', 'secondary.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'secondary.800')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      zIndex={10}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="primary.500"
        >
          Modular
        </Text>
      </Flex>
      
      <Divider borderColor="gray.200" mb={4} />
      
      <VStack align="stretch" spacing={1}>
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            return (
              <SubNav
                key={item.name}
                label={item.name}
                icon={item.icon}
                href={item.href}
                isActive={isPathActive(item.href)}
              >
                {item.children.map((child) => (
                  <NavItem
                    key={child.name}
                    href={child.href}
                    icon={FiStar}
                    isActive={isPathActive(child.href)}
                  >
                    {child.name}
                  </NavItem>
                ))}
              </SubNav>
            );
          }
          
          return (
            <NavItem
              key={item.name}
              href={item.href}
              icon={item.icon}
              isActive={isPathActive(item.href)}
            >
              {item.name}
            </NavItem>
          );
        })}
      </VStack>
      
      {session && (
        <Box position="absolute" bottom="5" left="0" right="0" px={6}>
          <Divider mb={4} />
          <Button 
            variant="outline" 
            colorScheme="red" 
            size="sm" 
            width="full" 
            leftIcon={<Icon as={FiLogOut} />}
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </Box>
      )}
    </Box>
  );
} 