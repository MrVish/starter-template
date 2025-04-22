'use client';

import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  HStack,
  Badge,
  VStack,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BellIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onOpenSidebar?: () => void;
}

export default function Navbar({ onOpenSidebar }: NavbarProps) {
  const { isOpen, onToggle } = useDisclosure();
  const { data: session } = useSession();
  const pathname = usePathname();
  
  return (
    <Box
      position="fixed"
      w="full"
      zIndex="sticky"
    >
      <Flex
        bg={useColorModeValue('white', 'secondary.800')}
        color={useColorModeValue('secondary.600', 'white')}
        h="60px"
        px={{ base: 4, md: 6 }}
        borderBottom="1px"
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'secondary.700')}
        align="center"
        justify="space-between"
        boxShadow="sm"
      >
        <Flex
          flex={{ base: 1, md: 0 }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onOpenSidebar}
            icon={<HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        
        {/* Brand */}
        <Flex align="center" flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            fontFamily="heading"
            color="primary.500"
            fontWeight="bold"
            fontSize="lg"
          >
            Modular Framework
          </Text>
        </Flex>

        <HStack spacing={3} align="center">
          {/* Notifications */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Notifications"
              icon={<BellIcon />}
              variant="ghost"
              position="relative"
            >
              <Badge
                position="absolute"
                top="-2px"
                right="-2px"
                colorScheme="red"
                variant="solid"
                fontSize="0.8em"
                borderRadius="full"
              >
                3
              </Badge>
            </MenuButton>
            <MenuList>
              <MenuItem>New Model Alert</MenuItem>
              <MenuItem>Risk Assessment Due</MenuItem>
              <MenuItem>System Update Available</MenuItem>
            </MenuList>
          </Menu>
          
          {/* Settings */}
          <IconButton
            as={Link}
            href="/settings"
            aria-label="Settings"
            icon={<SettingsIcon />}
            variant="ghost"
          />
          
          {/* User Menu */}
          {session ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={session.user?.image || ''}
                  name={session.user?.name || 'User'}
                  bg="primary.500"
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} href="/profile">Profile</MenuItem>
                <MenuItem as={Link} href="/dashboard">Dashboard</MenuItem>
                <MenuItem as={Link} href="/settings">Settings</MenuItem>
                <MenuDivider />
                <MenuItem 
                  onClick={() => signOut()}
                  icon={<ChevronRightIcon color="red.500" />}
                  fontWeight="medium"
                  color="red.500"
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'primary.500'}
              onClick={() => signIn()}
              _hover={{
                bg: 'primary.600',
              }}
            >
              Sign In
            </Button>
          )}
          {/* User Info */}
          {session?.user && (
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} noOfLines={1}>
              Signed in as{' '}
              <Box as="span" fontWeight="medium" color={useColorModeValue('gray.900', 'white')}>
                {session.user.name || session.user.email}
              </Box>
            </Text>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

const DesktopNav = ({ pathname }: { pathname: string }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <ChakraLink
                as={Link}
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={pathname === navItem.href ? 700 : 500}
                color={pathname === navItem.href ? 'blue.500' : linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </ChakraLink>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <ChakraLink
      as={Link}
      href={href ?? '#'}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'blue.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'blue.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </ChakraLink>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <ChakraLink as={Link} key={child.label} py={2} href={child.href ?? '#'}>
                {child.label}
              </ChakraLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Features',
    children: [
      {
        label: 'Analytics',
        subLabel: 'Data visualization and reporting',
        href: '/features/analytics',
      },
      {
        label: 'Risk Management',
        subLabel: 'Model risk management tools',
        href: '/features/risk-management',
      },
    ],
  },
  {
    label: 'Documentation',
    href: '/docs',
  },
]; 