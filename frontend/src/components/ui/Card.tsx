import React, { ReactNode, useState, useEffect } from 'react';
import {
  Box,
  BoxProps,
  useStyleConfig,
  chakra,
  forwardRef,
  ThemingProps,
  Flex,
  Text,
  Heading,
  Icon,
  FlexProps,
  StyleProps,
  Badge,
  useColorModeValue,
  Card as ChakraCard,
  CardProps as ChakraCardProps,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FiExternalLink } from 'react-icons/fi';

export interface CardProps extends BoxProps, ThemingProps {
  /**
   * Card title
   */
  title?: string;
  /**
   * Card subtitle
   */
  subtitle?: string;
  /**
   * Card description
   */
  description?: string;
  /**
   * Card image
   */
  image?: string;
  /**
   * Card footer
   */
  footer?: ReactNode;
  /**
   * If `true`, card will have glass morphism effect
   */
  isGlass?: boolean;
  /**
   * Card elevation
   */
  elevation?: 'flat' | 'raised' | 'floating';
  /**
   * Card status
   */
  status?: {
    label: string;
    colorScheme?: string;
  };
  /**
   * Card action
   */
  onClick?: () => void;
  /**
   * Card href
   */
  href?: string;
  /**
   * If `true`, card will have hover animation
   */
  isHoverable?: boolean;
  /**
   * Card content
   */
  children?: ReactNode;
  /**
   * Additional props for the header container
   */
  headerProps?: FlexProps;
}

export const Card = forwardRef<CardProps, 'div'>((props, ref) => {
  const {
    variant = 'elevated',
    size,
    colorScheme,
    title,
    subtitle,
    description,
    image,
    footer,
    isGlass = false,
    elevation = 'raised',
    status,
    onClick,
    href,
    isHoverable = false,
    children,
    headerProps,
    ...rest
  } = props;

  const styles = useStyleConfig('Card', { variant, size, colorScheme }) as any;
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  
  // Different elevation styles
  const elevationStyles = {
    flat: {
      boxShadow: 'none',
      border: '1px solid',
      borderColor,
    },
    raised: {
      boxShadow: useColorModeValue('sm', 'dark-lg'),
      border: '1px solid',
      borderColor,
    },
    floating: {
      boxShadow: useColorModeValue('lg', 'dark-lg'),
      border: '1px solid',
      borderColor: 'transparent',
      _hover: isHoverable 
        ? { transform: 'translateY(-4px)', boxShadow: useColorModeValue('xl', 'dark-lg') } 
        : {},
    },
  };
  
  // Glass morphism styles
  const glassStyles = isGlass ? {
    bg: useColorModeValue(
      'rgba(255, 255, 255, 0.7)', 
      'rgba(26, 32, 44, 0.7)'
    ),
    backdropFilter: 'blur(10px)',
    border: '1px solid',
    borderColor: useColorModeValue(
      'rgba(255, 255, 255, 0.5)', 
      'rgba(255, 255, 255, 0.1)'
    ),
  } : { bg: bgColor };
  
  // Interactive styles
  const interactiveStyles = (onClick || href) ? {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    _hover: {
      transform: isHoverable ? 'translateY(-4px)' : undefined,
      boxShadow: isHoverable ? useColorModeValue('lg', 'dark-lg') : undefined,
    },
  } : {};
  
  const handleClick = () => {
    if (onClick) onClick();
    if (href) window.open(href, '_blank');
  };

  // Using Chakra's Card component to provide proper context 
  // for CardHeader and CardBody
  return (
    <ChakraCard
      ref={ref}
      variant={variant}
      boxShadow={!elevation ? 'none' : elevationStyles[elevation].boxShadow}
      border={!elevation ? 'none' : elevationStyles[elevation].border}
      borderColor={!elevation ? 'transparent' : elevationStyles[elevation].borderColor}
      onClick={handleClick}
      {...glassStyles}
      {...interactiveStyles}
      transition="all 0.2s"
      _hover={isHoverable ? {
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
      } : undefined}
      {...rest}
    >
      {image && (
        <Box
          height="200px"
          bgImage={`url(${image})`}
          bgSize="cover"
          bgPosition="center"
          borderRadius="md"
          mb={4}
        />
      )}
      
      {status && (
        <Badge
          position="absolute"
          top={4}
          right={4}
          colorScheme={status.colorScheme || 'blue'}
          borderRadius="full"
          px={3}
          py={1}
        >
          {status.label}
        </Badge>
      )}
      
      {(title || subtitle || description) ? (
        <Flex direction="column" gap={2} p={4}>
          {title && (
            <Heading 
              as="h3" 
              size="md" 
              color={textColor}
              display="flex"
              alignItems="center"
            >
              {title}
              {href && (
                <Icon 
                  as={FiExternalLink} 
                  ml={2} 
                  boxSize={4} 
                  color="blue.500" 
                />
              )}
            </Heading>
          )}
          
          {subtitle && (
            <Text 
              fontSize="sm" 
              color={subtitleColor}
              fontWeight="medium"
            >
              {subtitle}
            </Text>
          )}
          
          {description && (
            <Text color={textColor} fontSize="md" mt={2}>
              {description}
            </Text>
          )}
        </Flex>
      ) : null}
      
      {children}
      
      {footer && (
        <Box mt={4} pt={4} borderTop="1px solid" borderColor={borderColor}>
          {footer}
        </Box>
      )}
    </ChakraCard>
  );
});

Card.displayName = 'Card';

export default Card; 