import React from 'react';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  forwardRef,
  Box,
  BoxProps,
  useStyleConfig,
  useColorModeValue,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion, MotionProps } from 'framer-motion';

const MotionBox = motion<BoxProps>(Box);

const pulseKeyframes = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(var(--pulse-color, 26, 152, 179), 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(var(--pulse-color, 26, 152, 179), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--pulse-color, 26, 152, 179), 0); }
`;

export interface ButtonProps extends Omit<ChakraButtonProps, 'leftIcon' | 'rightIcon'> {
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  isGlass?: boolean;
  glassOpacity?: number;
  glassColor?: string;
  glassBlur?: number;
  textColor?: string;
  animation?: 'none' | 'pulse' | 'bounce' | 'scale';
  motionProps?: MotionProps;
  contrastWithBg?: boolean;
}

export const Button = forwardRef<ButtonProps, 'button'>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isGlass = false,
      glassOpacity = 0.7,
      glassColor,
      glassBlur = 8,
      textColor,
      animation = 'none',
      motionProps,
      contrastWithBg = true,
      ...rest
    },
    ref
  ) => {
    const styles = useStyleConfig('Button', { variant, size });
    const defaultLightText = useColorModeValue('white', 'gray.100');
    const defaultDarkText = useColorModeValue('gray.800', 'gray.100');
    
    // If glass property is true but variant is not already glass, apply glass styling
    const finalVariant = isGlass && typeof variant === 'string' && !variant.includes('glass') ? 'glass' : variant;
    
    // Determine text color for contrast with glass background
    // For transparent/glass backgrounds we need stronger contrast
    let buttonTextColor = textColor;
    if (!buttonTextColor && contrastWithBg) {
      // If glassColor is dark, use light text; if light, use dark text
      if (isGlass) {
        // Start with a dark text color
        buttonTextColor = defaultDarkText;
        
        // If glassColor exists and appears dark (contains rgba with low values or dark colors)
        if (glassColor) {
          const colorIsLikelyDark = 
            glassColor.includes('rgba(0,') || 
            glassColor.includes('rgba(1,') ||
            glassColor.includes('rgba(2,') ||
            glassColor.toLowerCase().includes('black') ||
            glassColor.toLowerCase().includes('dark');

          buttonTextColor = colorIsLikelyDark ? defaultLightText : defaultDarkText;
        }
      }
    }
    
    // Custom glass styles if isGlass is true
    const glassStyles = isGlass ? {
      backgroundColor: glassColor ? `${glassColor}` : 'rgba(255, 255, 255, 0.1)',
      backdropFilter: `blur(${glassBlur}px)`,
      borderRadius: 'lg',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: 'glass-sm',
      color: buttonTextColor,
      // For darker glass backgrounds, add a subtle text shadow for improved legibility
      textShadow: buttonTextColor === defaultLightText ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
      _hover: {
        boxShadow: 'glass-md',
        transform: 'translateY(-2px)',
      },
      _active: {
        transform: 'translateY(0px)',
      },
    } : {};

    // Animation properties
    let animationProps = {};
    if (animation === 'pulse') {
      animationProps = {
        animation: `${pulseKeyframes} 2s infinite`,
        sx: { '--pulse-color': glassColor || '26, 152, 179' },
      };
    } else if (animation !== 'none') {
      animationProps = {
        as: MotionBox,
        whileHover: animation === 'scale' ? { scale: 1.05 } : undefined,
        whileTap: animation === 'scale' ? { scale: 0.95 } : undefined,
        animate: animation === 'bounce' ? { y: [0, -5, 0] } : undefined,
        transition: animation === 'bounce' ? { 
          repeat: Infinity, 
          duration: 1.5, 
          ease: "easeInOut" 
        } : undefined,
        ...motionProps,
      };
    }

    const combinedStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      _before: {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        transition: 'opacity 0.3s ease',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
      },
    };

    return (
      <ChakraButton
        ref={ref}
        variant={finalVariant}
        size={size}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        sx={combinedStyles}
        _hover={isGlass ? glassStyles._hover : undefined}
        _active={isGlass ? glassStyles._active : undefined}
        color={buttonTextColor || textColor}
        {...glassStyles}
        {...animationProps}
        {...rest}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = 'Button';

export default Button; 