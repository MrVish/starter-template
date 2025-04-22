import React from 'react';
import {
  Box,
  BoxProps,
  useColorModeValue,
  Flex,
  Text,
  Icon,
  FlexProps,
  Heading,
  Badge,
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';

interface GlassCardProps extends BoxProps {
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
  };
  badge?: {
    text: string;
    variant?: 'subtle' | 'solid' | 'outline';
    colorScheme?: string;
  };
  isHoverable?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  icon,
  action,
  badge,
  isHoverable = false,
  ...rest
}) => {
  // Define color variations based on variant
  const variantStyles: Record<string, { bg: string; border: string; shadow: string; textColor: string; }> = {
    default: {
      bg: useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(23, 25, 35, 0.8)'),
      border: useColorModeValue('1px solid rgba(255, 255, 255, 0.2)', '1px solid rgba(255, 255, 255, 0.08)'),
      shadow: 'lg',
      textColor: useColorModeValue('gray.800', 'white'),
    },
    success: {
      bg: useColorModeValue('rgba(240, 255, 244, 0.8)', 'rgba(0, 60, 30, 0.7)'),
      border: useColorModeValue('1px solid rgba(72, 187, 120, 0.2)', '1px solid rgba(72, 187, 120, 0.2)'),
      shadow: '0 4px 12px rgba(72, 187, 120, 0.15)',
      textColor: useColorModeValue('green.800', 'green.100'),
    },
    warning: {
      bg: useColorModeValue('rgba(255, 250, 240, 0.8)', 'rgba(60, 45, 0, 0.7)'),
      border: useColorModeValue('1px solid rgba(237, 137, 54, 0.2)', '1px solid rgba(237, 137, 54, 0.2)'),
      shadow: '0 4px 12px rgba(237, 137, 54, 0.15)',
      textColor: useColorModeValue('orange.800', 'orange.100'),
    },
    error: {
      bg: useColorModeValue('rgba(255, 240, 245, 0.8)', 'rgba(60, 0, 20, 0.7)'),
      border: useColorModeValue('1px solid rgba(245, 101, 101, 0.2)', '1px solid rgba(245, 101, 101, 0.2)'),
      shadow: '0 4px 12px rgba(245, 101, 101, 0.15)',
      textColor: useColorModeValue('red.800', 'red.100'),
    },
    info: {
      bg: useColorModeValue('rgba(235, 248, 255, 0.8)', 'rgba(0, 30, 60, 0.7)'),
      border: useColorModeValue('1px solid rgba(66, 153, 225, 0.2)', '1px solid rgba(66, 153, 225, 0.2)'),
      shadow: '0 4px 12px rgba(66, 153, 225, 0.15)',
      textColor: useColorModeValue('blue.800', 'blue.100'),
    },
  };

  // Get current variant style
  const currentStyle = variantStyles[variant];

  // Text shadow for better readability on transparent backgrounds in dark mode
  const textShadow = useColorModeValue('none', '0 1px 2px rgba(0, 0, 0, 0.3)');

  // Color mode specific styles
  const hoverBg = useColorModeValue('rgba(250, 250, 250, 0.95)', 'rgba(32, 34, 45, 0.95)');
  const textColor = currentStyle.textColor;
  const subTextColor = useColorModeValue('gray.700', 'gray.300');
  const actionColor = variant === 'default' 
    ? useColorModeValue('blue.600', 'blue.300')
    : useColorModeValue(`${variant}.700`, `${variant}.300`);

  return (
    <Box
      borderRadius="xl"
      p={5}
      bg={currentStyle.bg}
      border={currentStyle.border}
      backdropFilter="blur(10px)"
      boxShadow={currentStyle.shadow}
      transition="all 0.3s ease"
      position="relative"
      color={textColor}
      textShadow={textShadow}
      _hover={
        isHoverable
          ? {
              bg: hoverBg,
              transform: 'translateY(-3px)',
              boxShadow: `${currentStyle.shadow}, 0 10px 20px rgba(0, 0, 0, 0.08)`,
            }
          : {}
      }
      {...rest}
    >
      {badge && (
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme={badge.colorScheme || variant === 'default' ? 'blue' : variant}
          variant={badge.variant || 'subtle'}
          borderRadius="full"
          px={3}
          py={1}
        >
          {badge.text}
        </Badge>
      )}

      {(title || icon) && (
        <Flex alignItems="center" mb={subtitle ? 1 : 3}>
          {icon && (
            <Box mr={3}>
              <Icon
                as={icon}
                boxSize={6}
                color={variant === 'default' ? 'blue.500' : `${variant}.500`}
              />
            </Box>
          )}
          {title && (
            <Heading size="md" fontWeight="600" color={textColor}>
              {title}
            </Heading>
          )}
        </Flex>
      )}

      {subtitle && (
        <Text color={subTextColor} mb={3} fontSize="sm">
          {subtitle}
        </Text>
      )}

      {children}

      {action && (
        <Flex
          mt={3}
          alignItems="center"
          cursor="pointer"
          onClick={action.onClick}
          color={actionColor}
          fontWeight="600"
          _hover={{ textDecoration: 'underline' }}
        >
          <Text mr={2}>{action.label}</Text>
          <Icon as={FiArrowRight} boxSize={4} />
        </Flex>
      )}
    </Box>
  );
};

export default GlassCard; 