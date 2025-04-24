'use client';

import React, { useState } from 'react';
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
  chakra,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Badge,
  MenuDivider,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  ModalFooter,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from '@chakra-ui/react';
import {
  FiHome,
  FiBarChart2,
  FiShield,
  FiDatabase,
  FiSettings,
  FiMenu,
  FiX,
  FiUser,
  FiBell,
  FiSearch,
  FiLogOut,
  FiAlertCircle,
  FiTrendingUp,
  FiUsers,
  FiMail,
  FiTarget,
  FiSend,
  FiPlus,
  FiEdit,
  FiZap,
  FiLock,
} from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Search dropdown state
  const [searchQuery, setSearchQuery] = useState('');

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  // Profile modal state
  const { 
    isOpen: isProfileOpen, 
    onOpen: onProfileOpen, 
    onClose: onProfileClose 
  } = useDisclosure();

  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New campaign results',
      message: 'Your Q2 Marketing campaign results are ready to view',
      time: '10 min ago',
      isRead: false,
    },
    {
      id: 2,
      title: 'Strategy update',
      message: 'Customer segment analysis has been updated',
      time: '1 hour ago',
      isRead: false,
    },
    {
      id: 3,
      title: 'System maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM UTC',
      time: '3 hours ago',
      isRead: true,
    },
  ]);

  // User profile data (in a real app, this would come from the backend)
  const [userProfile, setUserProfile] = useState({
    name: session?.user?.name || 'User',
    email: session?.user?.email || 'user@example.com',
    role: 'Administrator',
    department: 'Marketing',
    joinDate: 'January 2023',
    bio: 'Marketing professional with expertise in digital campaigns and customer journey optimization.',
    profileImage: session?.user?.image || null
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast({
      title: "All notifications marked as read",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile({...userProfile, ...updatedProfile});
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onProfileClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
      toast({
        title: 'Signed out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: 'There was a problem signing out. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
    {
      icon: FiBarChart2,
      label: 'Strategy Management',
      href: '/strategy',
      children: [
        { icon: FiTrendingUp, label: 'Strategy Insights', href: '/strategy/insights' },
        { icon: FiUsers, label: 'Customer Segments', href: '/strategy/segments' },
        { icon: FiMail, label: 'Contact Strategy', href: '/strategy/contact' },
        { icon: FiTarget, label: 'Strategy Planning', href: '/strategy/planning' },
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
        { icon: FiZap, label: 'AI Driven Plans', href: '/campaigns/ai-plans' },
      ],
    },
    {
      icon: FiDatabase,
      label: 'Data Explorer',
      href: '/data',
      children: [
        { icon: FiDatabase, label: 'Connect Data', href: '/data/connect' },
        { icon: FiBarChart2, label: 'Data Lineage', href: '/data/lineage' },
        { icon: FiZap, label: 'Capabilities', href: '/data/capabilities' },
      ],
    },
    { icon: FiSettings, label: 'Settings', href: '/settings' },
    {
      icon: FiShield,
      label: 'Administration',
      href: '/admin',
      children: [
        { icon: FiUsers, label: 'Users', href: '/admin/users' },
        { icon: FiBarChart2, label: 'Roles', href: '/admin/roles' },
        { icon: FiLock, label: 'Permissions', href: '/admin/permissions' },
      ],
    },
  ];

  const filteredMenuItems = React.useMemo(() => {
    return menuItems.filter(item => {
      // Only show Data Explorer if user is logged in
      if (item.label === 'Data Explorer') return !!session;
      return true;
    });
  }, [menuItems, session]);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  // Generate flat list of pages for search
  const pagesList = React.useMemo(() => {
    const list: {label:string; href:string}[] = [];
    menuItems.forEach(item => {
      list.push({ label: item.label, href: item.href });
      item.children?.forEach(child => list.push({ label: child.label, href: child.href }));
    });
    return list;
  }, [menuItems]);
  const filteredPages = pagesList.filter(p =>
    p.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box
        display={{ base: 'none', md: 'flex' }}
        flexDirection="column"
        w={{ base: 'full', md: 64 }}
        position="fixed"
        h="full"
        overflowY="auto"
        zIndex={20}
        className="sidebar-container"
        sx={{
          '&::-webkit-scrollbar': {
            width: '8px',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
          },
          '&:before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '16rem',
            height: '100vh',
            bgGradient: 'linear(to-br, blue.700, purple.800)',
            opacity: 0.95,
            zIndex: -1,
          },
        }}
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
            <Text 
              fontSize="xl" 
              fontWeight="extrabold" 
              color="white"
              textShadow="0px 2px 4px rgba(0, 0, 0, 0.6)"
              letterSpacing="wide"
            >
              <chakra.span color="brand.500" fontSize="2xl">EXL</chakra.span>Marketing
            </Text>
          </Flex>
        </Flex>
        <VStack spacing={0} align="stretch" mt={4}>
          {filteredMenuItems.map((item) => (
            <Box key={item.label}>
              <Flex
                px={6}
                py={3}
                cursor="pointer"
                alignItems="center"
                color={isActive(item.href) ? 'white' : 'whiteAlpha.800'}
                bg={isActive(item.href) ? 'whiteAlpha.300' : 'transparent'}
                _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
                onClick={() => handleNavigation(item.href)}
                borderLeftWidth={isActive(item.href) ? "4px" : "0px"}
                borderLeftColor="blue.300"
              >
                <Icon as={item.icon} mr={4} boxSize={5} color={isActive(item.href) ? 'white' : 'whiteAlpha.800'} />
                <Text 
                  fontSize="sm" 
                  fontWeight={isActive(item.href) ? "extrabold" : "medium"}
                  letterSpacing="0.2px"
                  color={isActive(item.href) ? 'white' : 'whiteAlpha.800'}
                >
                  {item.label}
                </Text>
              </Flex>
              {item.children && (
                <VStack spacing={0} align="stretch" pl={10}>
                  {item.children.map((child) => (
                    <Flex
                      key={child.label}
                      px={6}
                      py={2}
                      cursor="pointer"
                      alignItems="center"
                      color={isActive(child.href) ? 'white' : 'whiteAlpha.800'}
                      bg={isActive(child.href) ? 'whiteAlpha.300' : 'transparent'}
                      _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
                      onClick={() => handleNavigation(child.href)}
                      borderLeftWidth={isActive(child.href) ? "4px" : "0px"}
                      borderLeftColor="blue.300"
                    >
                      <Icon as={child.icon} mr={4} fontSize="sm" color={isActive(child.href) ? 'white' : 'whiteAlpha.800'} />
                      <Text 
                        fontSize="sm" 
                        fontWeight={isActive(child.href) ? "bold" : "medium"}
                        letterSpacing="0.2px"
                        color={isActive(child.href) ? 'white' : 'whiteAlpha.800'}
                      >
                        {child.label}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
        </VStack>
        <Box mt="auto" p={4}>
          <Button
            variant="ghost"
            leftIcon={<Icon as={FiLogOut} color="white" />}
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
            onClick={handleSignOut}
            width="full"
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent
          sx={{
            '&:before': {
              content: '""',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              bgGradient: 'linear(to-br, blue.700, purple.800)',
              opacity: 0.95,
              zIndex: -1,
            },
            '&::-webkit-scrollbar': {
              width: '8px',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
            },
          }}
        >
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.15)" color="white" pb={4}>
            <Flex align="center" mb={4}>
              <Icon as={FiBarChart2} color="white" boxSize={6} mr={2} />
              <Text 
                fontSize="lg" 
                fontWeight="extrabold"
                textShadow="0px 2px 4px rgba(0, 0, 0, 0.6)"
                letterSpacing="wide"
                color="white"
              >
                <chakra.span color="brand.500" fontSize="xl">EXL</chakra.span>Marketing
              </Text>
            </Flex>
            
            {/* Mobile search input */}
            <Popover isLazy placement="bottom">
              <PopoverTrigger>
                <Flex
                  align="center"
                  bg="whiteAlpha.200"
                  borderRadius="md"
                  px={3}
                  py={2}
                  width="100%"
                  mt={2}
                  _hover={{ bg: 'whiteAlpha.300' }}
                  cursor="pointer"
                >
                  <Icon as={FiSearch} color="white" boxSize={4} mr={2} />
                  <Text color="whiteAlpha.700" fontSize="sm">Search...</Text>
                </Flex>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                  <Input
                    placeholder="Search pages..."
                    mb={2}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <VStack spacing={1} align="stretch" maxH="200px" overflowY="auto">
                    {filteredPages.map(page => (
                      <Flex
                        key={page.href}
                        p={2}
                        cursor="pointer"
                        _hover={{ bg: 'gray.100' }}
                        onClick={() => {
                          router.push(page.href);
                          setSearchQuery('');
                        }}
                      >
                        <Text fontSize="sm">{page.label}</Text>
                      </Flex>
                    ))}
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
                    color={isActive(item.href) ? 'white' : 'whiteAlpha.800'}
                    bg={isActive(item.href) ? 'whiteAlpha.300' : 'transparent'}
                    _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
                    onClick={() => {
                      handleNavigation(item.href);
                      onClose();
                    }}
                    borderLeftWidth={isActive(item.href) ? "4px" : "0px"}
                    borderLeftColor="blue.300"
                  >
                    <Icon as={item.icon} mr={4} boxSize={5} color={isActive(item.href) ? 'white' : 'whiteAlpha.800'} />
                    <Text 
                      fontSize="md" 
                      fontWeight={isActive(item.href) ? "extrabold" : "medium"}
                      letterSpacing="0.2px"
                      color={isActive(item.href) ? 'white' : 'whiteAlpha.800'}
                    >
                      {item.label}
                    </Text>
                  </Flex>
                  {item.children && (
                    <VStack spacing={0} align="stretch" pl={10}>
                      {item.children.map((child) => (
                        <Flex
                          key={child.label}
                          px={6}
                          py={2}
                          cursor="pointer"
                          alignItems="center"
                          color={isActive(child.href) ? 'white' : 'whiteAlpha.800'}
                          bg={isActive(child.href) ? 'whiteAlpha.300' : 'transparent'}
                          _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
                          onClick={() => {
                            handleNavigation(child.href);
                            onClose();
                          }}
                          borderLeftWidth={isActive(child.href) ? "4px" : "0px"}
                          borderLeftColor="blue.300"
                        >
                          <Icon as={child.icon} mr={4} fontSize="sm" color={isActive(child.href) ? 'white' : 'whiteAlpha.800'} />
                          <Text 
                            fontSize="sm" 
                            fontWeight={isActive(child.href) ? "bold" : "medium"}
                            letterSpacing="0.2px"
                            color={isActive(child.href) ? 'white' : 'whiteAlpha.800'}
                          >
                            {child.label}
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  )}
                </Box>
              ))}
            </VStack>
            <Box p={4} borderTopWidth="1px" borderColor="rgba(255, 255, 255, 0.15)">
              <Button
                variant="ghost"
                leftIcon={<Icon as={FiLogOut} color="white" />}
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() => { handleSignOut(); onClose(); }}
                width="full"
              >
                Sign Out
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box
        ml={{ base: 0, md: 64 }}
        flex={1}
        bg="gray.50"
        minH="100vh"
        position="relative"
      >
        {/* Header */}
        <Box
          position="sticky"
          top={0}
          zIndex={10}
          bg="rgba(49, 130, 206, 0.4)"
          backdropFilter="blur(20px)"
          borderBottomWidth="1px"
          borderColor="rgba(255, 255, 255, 0.15)"
          boxShadow="0 8px 20px rgba(0, 0, 0, 0.1)"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgGradient="linear(to-br, blue.700, purple.800)"
            opacity="0.95"
            zIndex={-1}
          />
          <Flex
            justify="space-between"
            align="center"
            px={{ base: 4, md: 6 }}
            py={3}
            width="100%"
            h={{ md: "20" }}
          >
            <Flex align="center" width={{ base: 'auto', md: '320px' }}>
              <IconButton
                icon={<Icon as={FiMenu} />}
                variant="ghost"
                color="white"
                aria-label="Open Menu"
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                mr={2}
              />
              
              {/* Enhanced search input */}
              <Popover isLazy placement="bottom-start">
                <PopoverTrigger>
                  <Flex
                    align="center"
                    bg="whiteAlpha.200"
                    borderRadius="md"
                    px={3}
                    py={2}
                    display={{ base: 'none', md: 'flex' }}
                    width="100%"
                    _hover={{ bg: 'whiteAlpha.300' }}
                    cursor="pointer"
                  >
                    <Icon as={FiSearch} color="white" boxSize={4} mr={2} />
                    <Text color="whiteAlpha.700" fontSize="sm">Search...</Text>
                  </Flex>
                </PopoverTrigger>
                <PopoverContent w={{ md: '320px' }}>
                  <PopoverArrow />
                  <PopoverBody>
                    <Input
                      placeholder="Search pages..."
                      mb={2}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <VStack spacing={1} align="stretch" maxH="200px" overflowY="auto">
                      {filteredPages.map(page => (
                        <Flex
                          key={page.href}
                          p={2}
                          cursor="pointer"
                          _hover={{ bg: 'gray.100' }}
                          onClick={() => {
                            router.push(page.href);
                            setSearchQuery('');
                          }}
                        >
                          <Text fontSize="sm">{page.label}</Text>
                        </Flex>
                      ))}
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
            
            {/* Profile and notification buttons on the right side */}
            <HStack spacing={4} ml="auto">
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<Icon as={FiBell} />}
                  variant="ghost"
                  color="white"
                  aria-label="Notifications"
                  position="relative"
                >
                  {unreadCount > 0 && (
                    <Badge
                      position="absolute"
                      top="-5px"
                      right="-5px"
                      fontSize="xs"
                      colorScheme="red"
                      borderRadius="full"
                      boxSize="18px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </MenuButton>
                <MenuList maxH="300px" overflowY="auto" px={2}>
                  <HStack justify="space-between" px={3} py={2}>
                    <Text fontWeight="bold">Notifications</Text>
                    {unreadCount > 0 && (
                      <Button size="xs" variant="ghost" onClick={markAllAsRead}>
                        Mark all as read
                      </Button>
                    )}
                  </HStack>
                  <MenuDivider />
                  {notifications.length === 0 ? (
                    <Box py={4} textAlign="center">
                      <Text color="gray.500">No notifications</Text>
                    </Box>
                  ) : (
                    notifications.map((notification) => (
                      <MenuItem 
                        key={notification.id} 
                        onClick={() => markAsRead(notification.id)}
                        bg={notification.isRead ? "transparent" : "blue.50"}
                        _hover={{ bg: notification.isRead ? "gray.100" : "blue.100" }}
                        borderRadius="md"
                        mb={1}
                      >
                        <VStack align="start" spacing={1} width="100%">
                          <HStack justify="space-between" width="100%">
                            <Text fontWeight="bold" fontSize="sm">{notification.title}</Text>
                            <Text fontSize="xs" color="gray.500">{notification.time}</Text>
                          </HStack>
                          <Text fontSize="xs" noOfLines={2}>{notification.message}</Text>
                        </VStack>
                      </MenuItem>
                    ))
                  )}
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  px={2}
                >
                  <HStack spacing={2}>
                    <Avatar 
                      size="sm" 
                      name={userProfile.name} 
                      src={userProfile.profileImage}
                      bg="blue.300"
                    />
                    <Text 
                      display={{ base: 'none', md: 'block' }}
                      color="white"
                      fontWeight="bold"
                      textShadow="0px 1px 2px rgba(0, 0, 0, 0.5)"
                    >
                      {userProfile.name}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <VStack align="center" p={3}>
                    <Avatar
                      size="lg"
                      name={userProfile.name}
                      src={userProfile.profileImage}
                      mb={2}
                    />
                    <Text fontWeight="bold">{userProfile.name}</Text>
                    <Text fontSize="sm" color="gray.500">{userProfile.role}</Text>
                    <Text fontSize="xs" color="gray.500">{userProfile.email}</Text>
                  </VStack>
                  <MenuDivider />
                  <MenuItem icon={<Icon as={FiUser} />} onClick={onProfileOpen}>My Profile</MenuItem>
                  <MenuItem icon={<Icon as={FiSettings} />}>Settings</MenuItem>
                  <MenuItem icon={<Icon as={FiLogOut} />} onClick={handleSignOut}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>

        {/* Page Content */}
        <Box p={4}>
          {children}
        </Box>
      </Box>

      {/* Profile Modal */}
      <Modal isOpen={isProfileOpen} onClose={onProfileClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>My Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="start">
              <HStack width="full" spacing={8} align="start">
                <VStack>
                  <Avatar
                    size="2xl"
                    name={userProfile.name}
                    src={userProfile.profileImage}
                  />
                  <Button size="sm" colorScheme="blue">
                    Change Photo
                  </Button>
                </VStack>
                
                <VStack align="start" flex={1}>
                  <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input 
                      defaultValue={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      defaultValue={userProfile.email} 
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>
                </VStack>
              </HStack>

              <Divider />
              
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Input 
                  defaultValue={userProfile.role}
                  onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Department</FormLabel>
                <Input 
                  defaultValue={userProfile.department}
                  onChange={(e) => setUserProfile({...userProfile, department: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea 
                  defaultValue={userProfile.bio}
                  rows={3}
                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onProfileClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={() => handleProfileUpdate(userProfile)}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default DashboardLayout; 