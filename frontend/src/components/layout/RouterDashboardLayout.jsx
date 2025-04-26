import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  Text,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Button,
  IconButton,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider,
  Spinner,
  InputGroup,
  InputLeftElement,
  Input,
  useToast,
} from '@chakra-ui/react';
import {
  FiHome,
  FiBarChart2,
  FiShield,
  FiDatabase,
  FiSettings,
  FiMenu,
  FiUser,
  FiBell,
  FiSearch,
  FiLogOut,
  FiTrendingUp,
  FiUsers,
  FiMail,
  FiTarget,
  FiSend,
  FiPlus,
  FiEdit,
  FiZap,
  FiChevronRight,
  FiPieChart,
  FiTrello,
  FiShare2,
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const RouterDashboardLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, setIsPending] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // User profile data
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    email: 'user@example.com',
    role: 'user',
    department: 'Marketing',
    joinDate: 'January 2023',
    bio: 'Marketing professional with expertise in digital campaigns and customer journey optimization.',
    profileImage: null
  });

  // Add state to track expanded menu items
  const [expandedItems, setExpandedItems] = useState([]);

  // Menu items for navigation
  const menuItems = [
    { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
    {
      icon: FiBarChart2,
      label: 'Analytics',
      href: '/analytics',
      children: [
        { icon: FiBarChart2, label: 'Marketing Dashboard', href: '/analytics' },
        { icon: FiTrello, label: 'Campaign Performance', href: '/analytics/campaigns' },
        { icon: FiUsers, label: 'Segment Analysis', href: '/analytics/segments' },
        { icon: FiShare2, label: 'Channel Effectiveness', href: '/analytics/channels' },
      ],
    },
    {
      icon: FiSend,
      label: 'Campaigns',
      href: '/campaigns',
      children: [
        { icon: FiBarChart2, label: 'Campaign Insights', href: '/campaigns/insights' },
        { icon: FiPlus, label: 'Build Campaigns', href: '/campaigns/build' },
        { icon: FiEdit, label: 'View/Edit Campaigns', href: '/campaigns/view' },
      ],
    },
    { icon: FiSettings, label: 'Settings', href: '/settings' },
  ];

  // Find the parent of a given path
  const findParentItem = (path) => {
    return menuItems.find(item => 
      item.children && item.children.some(child => child.href === path)
    );
  };

  // Initialize expanded items based on active path
  useEffect(() => {
    if (location.pathname) {
      const parentItem = findParentItem(location.pathname);
      if (parentItem) {
        setExpandedItems([parentItem.label]);
      }
    }
  }, [location.pathname]); // Only run on initial load and pathname changes

  // Toggle expanded state for a menu item
  const toggleExpand = (label, event) => {
    event.stopPropagation();
    setExpandedItems(prev => {
      if (prev.includes(label)) {
        return prev.filter(item => item !== label);
      }
      return [...prev, label];
    });
  };

  // Check if a menu item is expanded
  const isExpanded = (label) => expandedItems.includes(label);

  // Filter menu items based on search query
  const filteredMenuItems = searchQuery
    ? menuItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.children && item.children.some(child => 
          child.label.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    : menuItems;

  // Handle navigation
  const handleNavigation = (href) => {
    setIsPending(true);
    navigate(href);
    setTimeout(() => setIsPending(false), 300);
  };

  // Handle item click - navigate if no children, otherwise toggle expand
  const handleItemClick = (item, event) => {
    if (item.children && item.children.length > 0) {
      toggleExpand(item.label, event);
    } else {
      handleNavigation(item.href);
    }
  };

  // Check if a path is active
  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  // Generate flat list of pages for search
  const pagesList = React.useMemo(() => {
    const list = [];
    menuItems.forEach(item => {
      list.push({ label: item.label, href: item.href });
      item.children?.forEach(child => list.push({ label: child.label, href: child.href }));
    });
    return list;
  }, [menuItems]);
  
  const filteredPages = pagesList.filter(p =>
    p.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sign out
  const handleSignOut = () => {
    toast({
      title: 'Signed out successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/');
  };

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Mobile drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg="secondary.500" color="white">
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.15)">
            <Flex align="center">
              <Icon as={FiBarChart2} color="white" boxSize={6} mr={2} />
              <Text fontSize="xl" fontWeight="extrabold" color="white">
                Marketing Hub
              </Text>
            </Flex>
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              {filteredMenuItems.map((item) => (
                <Box key={item.label}>
                  <Flex
                    px={6}
                    py={3}
                    cursor="pointer"
                    alignItems="center"
                    justifyContent="space-between"
                    bg={isActive(item.href) ? 'brand.500' : 'transparent'}
                    color="white"
                    _hover={{ bg: 'primary.500' }}
                    onClick={(e) => item.children ? toggleExpand(item.label, e) : handleNavigation(item.href)}
                  >
                    <Flex align="center">
                      <Icon as={item.icon} mr={4} boxSize={5} />
                      <Text fontSize="sm" fontWeight="medium">
                        {item.label}
                      </Text>
                    </Flex>
                    {item.children && (
                      <Icon
                        as={FiChevronRight}
                        transform={isExpanded(item.label) ? 'rotate(90deg)' : 'rotate(0deg)'}
                        transition="transform 0.2s"
                      />
                    )}
                  </Flex>
                  {item.children && isExpanded(item.label) && (
                    <VStack spacing={0} align="stretch" pl={6}>
                      {item.children.map((child) => (
                        <Flex
                          key={child.label}
                          px={6}
                          py={2}
                          cursor="pointer"
                          alignItems="center"
                          bg={isActive(child.href) ? 'brand.500' : 'transparent'}
                          color="white"
                          _hover={{ bg: 'primary.500' }}
                          onClick={() => handleNavigation(child.href)}
                        >
                          <Icon as={child.icon} mr={4} fontSize="sm" />
                          <Text fontSize="sm">{child.label}</Text>
                        </Flex>
                      ))}
                    </VStack>
                  )}
                </Box>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Sidebar - desktop */}
      <Box
        display={{ base: 'none', md: 'flex' }}
        flexDirection="column"
        w={{ base: 'full', md: 64 }}
        h="full"
        bg="secondary.500"
        color="white"
        position="fixed"
        zIndex={10}
      >
        <Flex
          h="20"
          alignItems="center"
          justifyContent="space-between"
          px={6}
          borderBottomWidth="1px"
          borderColor="rgba(255, 255, 255, 0.15)"
        >
          <Flex align="center">
            <Icon as={FiBarChart2} color="white" boxSize={6} mr={2} />
            <Text fontSize="xl" fontWeight="extrabold" color="white">
              Marketing Hub
            </Text>
          </Flex>
        </Flex>
        
        {/* Search box */}
        <Box px={4} py={4}>
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="whiteAlpha.700" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="whiteAlpha.200"
              border="none"
              _placeholder={{ color: 'whiteAlpha.500' }}
              color="white"
              rounded="md"
            />
          </InputGroup>
        </Box>
        
        {/* Navigation */}
        <VStack spacing={0} align="stretch" flex={1} overflowY="auto">
          {filteredMenuItems.map((item) => (
            <Box key={item.label}>
              <Flex
                px={6}
                py={3}
                cursor="pointer"
                alignItems="center"
                justifyContent="space-between"
                bg={isActive(item.href) ? 'brand.500' : 'transparent'}
                color="white"
                _hover={{ bg: 'primary.500' }}
                onClick={(e) => handleItemClick(item, e)}
                borderLeftWidth="4px"
                borderLeftColor={isActive(item.href) ? 'brand.500' : 'transparent'}
              >
                <Flex align="center">
                  <Icon as={item.icon} mr={4} boxSize={5} />
                  <Text fontSize="sm" fontWeight={isActive(item.href) ? "bold" : "medium"}>
                    {item.label}
                  </Text>
                </Flex>
                {item.children && (
                  <Icon
                    as={FiChevronRight}
                    transform={isExpanded(item.label) ? 'rotate(90deg)' : 'rotate(0deg)'}
                    transition="transform 0.2s"
                  />
                )}
              </Flex>
              {item.children && isExpanded(item.label) && (
                <VStack spacing={0} align="stretch" pl={6}>
                  {item.children.map((child) => (
                    <Flex
                      key={child.label}
                      px={6}
                      py={2}
                      cursor="pointer"
                      alignItems="center"
                      bg={isActive(child.href) ? 'brand.500' : 'transparent'}
                      color="white"
                      _hover={{ bg: 'primary.500' }}
                      onClick={() => handleNavigation(child.href)}
                      borderLeftWidth="4px"
                      borderLeftColor={isActive(child.href) ? 'brand.500' : 'transparent'}
                    >
                      <Icon as={child.icon} mr={4} fontSize="sm" />
                      <Text fontSize="sm" fontWeight={isActive(child.href) ? "bold" : "normal"}>
                        {child.label}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
        </VStack>
      
        {/* User profile menu */}
        <Flex
          p={4}
          borderTopWidth="1px"
          borderColor="rgba(255, 255, 255, 0.15)"
          justify="center"
        >
          <Menu placement="top-end">
            <MenuButton
              as={Button}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              <HStack spacing={2}>
                <Avatar size="sm" name={userProfile.name} src={userProfile.profileImage} />
                <Text fontSize="sm">{userProfile.name}</Text>
              </HStack>
            </MenuButton>
            <MenuList color="gray.800">
              <MenuItem icon={<Icon as={FiUser} />}>Profile</MenuItem>
              <MenuItem icon={<Icon as={FiSettings} />}>Settings</MenuItem>
              <MenuDivider />
              <MenuItem icon={<Icon as={FiLogOut} />} onClick={handleSignOut}>
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>

      {/* Main content area */}
      <Box
        ml={{ base: 0, md: 64 }}
        position="relative"
        w="full"
        maxW={{ base: '100%', md: 'calc(100% - 16rem)' }}
        h="100vh"
        overflow="auto"
      >
        {/* Top navigation for mobile */}
        <Flex
          as="header"
          bg={useColorModeValue('white', 'gray.900')}
          borderBottomWidth="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          h="16"
          alignItems="center"
          justifyContent="space-between"
          px={4}
          display={{ base: 'flex', md: 'none' }}
          position="sticky"
          top={0}
          zIndex={5}
        >
          <IconButton
            aria-label="Open menu"
            icon={<FiMenu />}
            onClick={onOpen}
            variant="ghost"
          />
          
          <Text fontSize="lg" fontWeight="bold">
            Marketing Hub
          </Text>
          
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiUser />}
              variant="ghost"
              aria-label="User menu"
            />
            <MenuList>
              <MenuItem icon={<Icon as={FiUser} />}>Profile</MenuItem>
              <MenuItem icon={<Icon as={FiSettings} />}>Settings</MenuItem>
              <MenuDivider />
              <MenuItem icon={<Icon as={FiLogOut} />} onClick={handleSignOut}>
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {/* Page content */}
        <Box p={4} position="relative">
          {isPending && (
            <Flex
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="rgba(255,255,255,0.8)"
              zIndex={10}
              align="center"
              justify="center"
            >
              <Spinner size="xl" color="blue.500" />
            </Flex>
          )}
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default RouterDashboardLayout; 