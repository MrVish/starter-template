import React from 'react';
import {
  Box,
  BoxProps,
  useColorModeValue,
  forwardRef,
} from '@chakra-ui/react';

export interface GlassMorphismCardProps extends BoxProps {
  blurStrength?: number;
  opacity?: number;
  hasBorder?: boolean;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  glowColor?: string;
  textColorLight?: string;
  textColorDark?: string;
}

export const GlassMorphismCard = forwardRef<GlassMorphismCardProps, 'div'>(
  (
    {
      children,
      blurStrength = 8,
      opacity = 0.7,
      hasBorder = true,
      hoverEffect = false,
      glowEffect = false,
      glowColor,
      textColorLight,
      textColorDark,
      ...rest
    },
    ref
  ) => {
    // Determine color mode dependent values
    const bgColor = useColorModeValue(
      `rgba(255, 255, 255, ${opacity})`,
      `rgba(26, 32, 44, ${opacity})`
    );
    
    const borderColor = useColorModeValue(
      'rgba(255, 255, 255, 0.3)',
      'rgba(255, 255, 255, 0.1)'
    );
    
    const shadowColor = useColorModeValue(
      'rgba(0, 0, 0, 0.1)',
      'rgba(0, 0, 0, 0.4)'
    );
    
    // Default text colors with better contrast
    const defaultTextColor = useColorModeValue(
      textColorLight || 'gray.800',
      textColorDark || 'white'
    );
    
    // Default glow color if not provided
    const defaultGlowColor = useColorModeValue(
      'blue.200',
      'blue.700'
    );
    
    const actualGlowColor = glowColor || defaultGlowColor;
    
    // Add text shadow for better readability in dark modes or with glow effects
    const textShadow = useColorModeValue(
      'none',
      '0 1px 2px rgba(0, 0, 0, 0.4)'
    );
    
    // Build hover styles conditionally
    const hoverStyles = hoverEffect ? {
      transform: 'translateY(-5px)',
      boxShadow: glowEffect 
        ? `0 20px 25px -5px ${shadowColor}, 0 0 15px ${actualGlowColor}`
        : `0 20px 25px -5px ${shadowColor}`,
    } : {};
    
    // Build glow effect styles conditionally
    const glowStyles = glowEffect ? {
      _after: {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        filter: 'blur(15px)',
        opacity: 0.7,
        bg: actualGlowColor,
        borderRadius: 'inherit',
      }
    } : {};

    return (
      <Box
        ref={ref}
        position="relative"
        bg={bgColor}
        backdropFilter={`blur(${blurStrength}px)`}
        borderRadius="xl"
        boxShadow={`0 8px 32px 0 ${shadowColor}`}
        borderWidth={hasBorder ? '1px' : 0}
        borderColor={hasBorder ? borderColor : 'transparent'}
        transition="all 0.3s ease"
        overflow="hidden"
        color={defaultTextColor}
        textShadow={textShadow}
        _hover={hoverStyles}
        {...glowStyles}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);

GlassMorphismCard.displayName = 'GlassMorphismCard';

export default GlassMorphismCard; 