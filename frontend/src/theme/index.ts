import { extendTheme } from '@chakra-ui/react';

const colors = {
  primary: {
    50: '#ebf8ff',
    100: '#bee3f8',
    200: '#90cdf4',
    300: '#63b3ed',
    400: '#4299e1',
    500: '#005071', // Updated to standard primary color
    600: '#2b6cb0',
    700: '#2c5282',
    800: '#2a4365',
    900: '#1A365D',
  },
  secondary: {
    50: '#F7F7F7',
    100: '#E6E6E6',
    200: '#D1D1D1',
    300: '#B8B8B8',
    400: '#9E9E9E',
    500: '#2E3643', // Updated to standard secondary color
    600: '#666666',
    700: '#4D4D4D',
    800: '#333333',
    900: '#1A1A1A',
  },
  accent: {
    50: '#FFF9E6',
    100: '#FFEDB3',
    200: '#FFE180',
    300: '#FFD54D',
    400: '#FFC91A',
    500: '#FFB800', // Golden accent
    600: '#CC9400',
    700: '#997000',
    800: '#664B00',
    900: '#332500',
  },
  background: {
    50: '#DCF3FA', // Updated to standard background light color
    100: '#eff8fb',
    200: '#e6f3f8',
    300: '#dceff5',
    400: '#d2eaf2',
    500: '#DCF3FA', // Updated background color
    600: '#b1d8e6',
    700: '#9acbdd',
    800: '#83bdd4',
    900: '#6cb0cb',
  },
  success: {
    50: '#ebf9f0',
    100: '#d0efd9',
    200: '#b5e6c3',
    300: '#9adcac',
    400: '#7fd296',
    500: '#38b35a', // Richer green
    600: '#2b9849',
    700: '#207c3b',
    800: '#18612e',
    900: '#104520',
  },
  warning: {
    50: '#fef9e6',
    100: '#fcefc4',
    200: '#fbe5a1',
    300: '#f9db7e',
    400: '#f7d15c',
    500: '#f0b929', // Richer amber
    600: '#e0a415',
    700: '#c08a12',
    800: '#9f730f',
    900: '#7f5c0c',
  },
  error: {
    50: '#fdecec',
    100: '#facbcb',
    200: '#f7aaaa',
    300: '#f48989',
    400: '#f16868',
    500: '#e93535', // Richer red
    600: '#d42020',
    700: '#b01b1b',
    800: '#8c1616',
    900: '#681111',
  },
  gray: {
    50: '#f9fafb',
    100: '#f0f2f4',
    200: '#e4e7eb',
    300: '#d5d9e0',
    400: '#bcc4cd',
    500: '#97a3b1',
    600: '#768294',
    700: '#5d6777',
    800: '#434a57',
    900: '#2a2e38',
  },
  glass: {
    primary: 'rgba(49, 130, 206, 0.1)',
    secondary: 'rgba(51, 51, 51, 0.1)',
    accent: 'rgba(255, 184, 0, 0.1)',
    dark: 'rgba(26, 26, 26, 0.75)',
    light: 'rgba(249, 250, 251, 0.75)',
    card: 'rgba(255, 255, 255, 0.92)',
    cardDark: 'rgba(26, 32, 44, 0.85)',
    blueOverlay: 'rgba(49, 130, 206, 0.4)',
  },
  gradients: {
    bluePurple: 'linear(to-br, blue.700, gray.900)',
    blueGold: 'linear(to-br, blue.600, accent.500)',
  },
  brand: {
    50: '#fdeee9',
    100: '#fbc2b9',
    200: '#f79a8b',
    300: '#f3735e',
    400: '#ef4a31',
    500: '#FB4E0B', // Standard brand color (unchanged)
    600: '#D7470A',
    700: '#B04008',
    800: '#8A3907',
    900: '#623007',
  },
};

const fonts = {
  heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
};

const styles = {
  global: {
    body: {
      bg: 'background.50', // Use standard background color
      color: 'secondary.500', // Use standard secondary color for text
    },
    '::selection': {
      backgroundColor: 'accent.100',
      color: 'accent.800',
    },
  },
};

// Enhanced shadows for better depth perception
const shadows = {
  xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.07)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.06)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.05)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  outline: '0 0 0 3px rgba(26, 152, 179, 0.5)',
  none: 'none',
  // Glass morphism shadows
  'glass-sm': '0 8px 16px 0 rgba(31, 38, 135, 0.07)',
  'glass-md': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  'glass-lg': '0 8px 48px 0 rgba(31, 38, 135, 0.25)',
};

// Enhanced border radius for modern look
const radii = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 600,
      borderRadius: 'xl',
      transition: 'all 0.3s ease',
      height: '40px',
      minWidth: '120px',
      px: 4,
    },
    sizes: {
      sm: {
        fontSize: 'sm',
        px: 3,
        py: 2,
        height: '36px',
      },
      md: {
        fontSize: 'md',
        px: 4,
        py: 2,
        height: '40px',
      },
      lg: {
        fontSize: 'lg',
        px: 6,
        py: 3,
        height: '48px',
      },
    },
    variants: {
      primary: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          transform: 'translateY(-3px)',
          boxShadow: 'lg',
        },
        _active: {
          bg: 'primary.700',
          transform: 'translateY(0px)',
        },
      },
      secondary: {
        bg: 'secondary.500',
        color: 'white',
        _hover: {
          bg: 'secondary.600',
          transform: 'translateY(-1px)',
          boxShadow: 'md',
        },
        _active: {
          bg: 'secondary.700',
          transform: 'translateY(0px)',
        },
      },
      accent: {
        bg: 'accent.500',
        color: 'white',
        _hover: {
          bg: 'accent.600',
          transform: 'translateY(-1px)',
          boxShadow: 'md',
        },
        _active: {
          bg: 'accent.700',
          transform: 'translateY(0px)',
        },
      },
      outline: {
        borderColor: 'primary.500',
        color: 'primary.500',
        _hover: {
          bg: 'primary.50',
          transform: 'translateY(-1px)',
          boxShadow: 'sm',
        },
        _active: {
          bg: 'primary.100',
          transform: 'translateY(0px)',
        },
      },
      ghost: {
        color: 'secondary.600',
        _hover: {
          bg: 'gray.100',
          transform: 'translateY(-1px)',
        },
        _active: {
          bg: 'gray.200',
        },
      },
      glass: {
        bg: 'glass.light',
        color: 'secondary.800',
        backdropFilter: 'blur(10px)',
        borderRadius: 'lg',
        boxShadow: 'glass-sm',
        _hover: {
          boxShadow: 'glass-md',
          transform: 'translateY(-2px)',
        },
        _active: {
          transform: 'translateY(0px)',
        },
        _dark: {
          color: 'white',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        }
      },
      'glass-colored': {
        bg: 'glass.primary',
        color: 'primary.800',
        backdropFilter: 'blur(10px)',
        borderRadius: 'lg',
        boxShadow: 'glass-sm',
        _hover: {
          bg: 'glass.primary',
          boxShadow: 'glass-md',
          transform: 'translateY(-2px)',
        },
        _active: {
          transform: 'translateY(0px)',
        },
        _dark: {
          color: 'primary.100',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        }
      },
      'blue-gradient': {
        position: 'relative',
        color: 'white',
        overflow: 'hidden',
        _before: {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: 'linear(to-br, blue.700, gray.900)',
          opacity: 0.95,
          zIndex: -1,
        },
        _hover: {
          transform: 'translateY(-3px)',
          boxShadow: 'xl',
        },
      },
    },
    defaultProps: {
      size: 'md',
      variant: 'primary',
    },
  },
  Heading: {
    baseStyle: {
      color: 'secondary.800',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
  },
  Text: {
    baseStyle: {
      color: 'secondary.700',
      lineHeight: 1.6,
      mb: 0,
    },
    variants: {
      'activity-title': {
        fontSize: 'lg',
        fontWeight: 600,
        color: 'secondary.800',
        mb: 1,
      },
      'activity-subtitle': {
        fontSize: 'sm',
        color: 'secondary.600',
        mb: 2,
      },
      'activity-meta': {
        fontSize: 'xs',
        color: 'secondary.500',
      }
    }
  },
  Card: {
    baseStyle: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      borderRadius: 'xl',
      overflow: 'hidden',
      height: '100%',
      position: 'relative',
      padding: { base: 5, md: 6 },
      gap: 4,
    },
    variants: {
      elevated: {
        boxShadow: 'md',
        border: '1px solid',
        borderColor: 'gray.100',
      },
      glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        color: 'gray.800',
        _dark: {
          backgroundColor: 'rgba(26, 32, 44, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: 'white',
        },
        _hover: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-5px)',
          transition: 'all 0.3s ease',
        }
      },
      outline: {
        border: '1px solid',
        borderColor: 'gray.200',
      },
      'blue-gradient': {
        position: 'relative',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        color: 'white',
        overflow: 'hidden',
        _before: {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: 'linear(to-br, blue.700, gray.900)',
          opacity: 0.95,
          zIndex: -1,
        },
        _hover: {
          transform: 'translateY(-5px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
        }
      },
      activity: {
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        bg: 'white',
        borderRadius: 'xl',
        boxShadow: 'sm',
        border: '1px solid',
        borderColor: 'gray.100',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'md',
          transition: 'all 0.2s ease',
        },
        '& > *:not(:last-child)': {
          borderBottom: '1px solid',
          borderColor: 'gray.100',
          pb: 3,
        }
      },
      'activity-glass': {
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        bg: 'glass.card',
        backdropFilter: 'blur(10px)',
        borderRadius: 'xl',
        boxShadow: 'glass-sm',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.18)',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'glass-md',
          transition: 'all 0.2s ease',
        },
        '& > *:not(:last-child)': {
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          pb: 3,
        }
      },
      solid: (props) => ({
        bg: `${props.colorScheme}.500`,
        color: 'white',
      }),
      subtle: (props) => ({
        bg: `${props.colorScheme}.50`,
        color: `${props.colorScheme}.700`,
      }),
      dataset: {
        p: 6,
        bg: 'white',
        borderRadius: 'xl',
        boxShadow: 'sm',
        border: '1px solid',
        borderColor: 'gray.100',
        gap: 4,
        '& > h3': {
          fontSize: 'lg',
          fontWeight: 600,
          color: 'gray.900',
          mb: 1,
        },
        '& > p': {
          color: 'gray.600',
          mb: 4,
        },
        '.metadata-grid': {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 4,
          mb: 4,
        },
        '.metadata-item': {
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        },
        '.metadata-label': {
          fontSize: 'sm',
          fontWeight: 500,
          color: 'gray.600',
        },
        '.metadata-value': {
          fontSize: 'md',
          fontWeight: 600,
          color: 'gray.900',
        },
        '.tags-container': {
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          mt: 'auto',
        },
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'md',
          transition: 'all 0.2s ease',
        },
      },
    },
    defaultProps: {
      variant: 'elevated',
    },
  },
  Link: {
    baseStyle: {
      color: 'accent.500',
      fontWeight: 500,
      transition: 'all 0.2s',
      _hover: {
        color: 'accent.600',
        textDecoration: 'underline',
      },
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: 'full',
      px: 2,
      py: 0.5,
      textTransform: 'normal',
      fontWeight: 'medium',
    },
    variants: {
      solid: {
        bg: 'primary.500',
        color: 'white',
      },
      outline: {
        color: 'primary.500',
        boxShadow: 'inset 0 0 0px 1px',
      },
      subtle: {
        bg: 'primary.100',
        color: 'primary.800',
      },
      glass: {
        bg: 'glass.primary',
        color: 'primary.600',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(49, 130, 206, 0.3)',
        boxShadow: 'glass-sm',
      },
      'dataset-tag': {
        px: 3,
        py: 1,
        borderRadius: 'full',
        fontSize: 'sm',
        fontWeight: 500,
        bg: 'blue.50',
        color: 'blue.600',
        _hover: {
          bg: 'blue.100',
        },
      },
    },
  },
  Table: {
    variants: {
      simple: {
        th: {
          borderColor: 'gray.200',
          color: 'secondary.700',
          fontSize: 'sm',
          fontWeight: 600,
          textTransform: 'normal',
          letterSpacing: '0.02em',
          bg: 'gray.50',
          py: 3,
        },
        td: {
          borderColor: 'gray.200',
          py: 3,
        },
        tbody: {
          tr: {
            _hover: {
              bg: 'gray.50',
            }
          }
        }
      },
      glass: {
        th: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: 'gray.800',
          fontSize: 'sm',
          fontWeight: 600,
          textTransform: 'normal',
          letterSpacing: '0.02em',
          bg: 'glass.light',
          backdropFilter: 'blur(10px)',
          py: 3,
          _dark: {
            color: 'white',
          }
        },
        td: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          py: 3,
          transition: 'all 0.2s',
          color: 'gray.700',
          _dark: {
            color: 'gray.200',
          }
        },
        tbody: {
          tr: {
            transition: 'all 0.2s',
            _hover: {
              bg: 'glass.light',
              transform: 'scale(1.01)',
              boxShadow: 'sm',
            }
          }
        }
      },
    },
  },
  Tabs: {
    variants: {
      enclosed: {
        tab: {
          fontWeight: 500,
          color: 'gray.600',
          _selected: {
            color: 'accent.600',
            fontWeight: 600,
            borderColor: 'accent.500',
          },
          _hover: {
            color: 'accent.500',
            bg: 'gray.50',
          },
        },
      },
      line: {
        tab: {
          fontWeight: 500,
          color: 'gray.600',
          _selected: {
            color: 'accent.600',
            fontWeight: 600,
            borderColor: 'accent.500',
          },
          _hover: {
            color: 'accent.500',
          },
        },
      },
      glass: {
        tab: {
          fontWeight: 500,
          color: 'gray.700',
          borderRadius: 'full',
          px: 4,
          py: 2,
          mx: 1,
          _selected: {
            color: 'primary.800',
            fontWeight: 600,
            bg: 'glass.primary',
            backdropFilter: 'blur(10px)',
            borderColor: 'transparent',
            _dark: {
              color: 'primary.100',
            }
          },
          _hover: {
            color: 'primary.700',
            bg: 'glass.light',
            backdropFilter: 'blur(10px)',
          },
          _dark: {
            color: 'gray.300',
          }
        },
        tablist: {
          p: 2,
          bg: 'rgba(240, 242, 244, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'full',
        }
      },
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'md',
      },
    },
    variants: {
      outline: {
        field: {
          borderColor: 'gray.300',
          _hover: {
            borderColor: 'gray.400',
          },
          _focus: {
            borderColor: 'accent.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-accent-500)',
          },
        },
      },
      filled: {
        field: {
          bg: 'gray.100',
          _hover: {
            bg: 'gray.200',
          },
          _focus: {
            bg: 'white',
            borderColor: 'accent.500',
          },
        },
      },
      glass: {
        field: {
          bg: 'glass.light',
          backdropFilter: 'blur(10px)',
          borderColor: 'transparent',
          color: 'gray.800',
          _placeholder: {
            color: 'gray.500',
          },
          _hover: {
            bg: 'rgba(249, 250, 251, 0.85)',
          },
          _focus: {
            bg: 'white',
            borderColor: 'accent.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-accent-500)',
          },
          _dark: {
            color: 'white',
            _placeholder: {
              color: 'gray.400',
            }
          }
        },
      },
      'search-field': {
        field: {
          height: '40px',
          borderRadius: 'xl',
          fontSize: 'md',
          pl: 4,
          _placeholder: {
            color: 'gray.400',
          },
        },
      },
    },
  },
  // New component styles
  Tooltip: {
    baseStyle: {
      bg: 'glass.dark',
      color: 'white',
      borderRadius: 'md',
      px: 3,
      py: 2,
      boxShadow: 'glass-sm',
      backdropFilter: 'blur(10px)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    }
  },
  Modal: {
    baseStyle: {
      dialog: {
        borderRadius: 'xl',
        boxShadow: 'glass-lg',
      }
    },
    variants: {
      glass: {
        dialog: {
          bg: 'glass.card',
          backdropFilter: 'blur(16px)',
          boxShadow: 'glass-lg',
          borderRadius: 'xl',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
        overlay: {
          bg: 'rgba(42, 46, 56, 0.4)',
          backdropFilter: 'blur(4px)',
        },
        header: {
          borderBottomWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        footer: {
          borderTopWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }
      }
    }
  },
  Menu: {
    baseStyle: {
      list: {
        borderRadius: 'lg',
        overflow: 'hidden',
        boxShadow: 'glass-md',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        p: 1,
        zIndex: 2,
      },
      item: {
        borderRadius: 'md',
        _focus: {
          bg: 'glass.primary',
        },
        _hover: {
          bg: 'glass.light',
        }
      }
    },
    variants: {
      glass: {
        list: {
          bg: 'glass.card',
          backdropFilter: 'blur(16px)',
          borderRadius: 'xl',
          boxShadow: 'glass-md',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          p: 1,
        },
        item: {
          borderRadius: 'md',
          transition: 'all 0.2s',
          _focus: {
            bg: 'glass.primary',
          },
          _hover: {
            bg: 'glass.light',
            transform: 'translateX(2px)',
          }
        }
      }
    }
  },
  Stack: {
    baseStyle: {
      spacing: 4,
    },
    variants: {
      'activity-list': {
        spacing: 4,
        divider: {
          borderColor: 'gray.100',
        }
      }
    }
  },
  Box: {
    variants: {
      'data-explorer-header': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 6,
        gap: 4,
        '.search-filter-group': {
          display: 'flex',
          gap: 3,
          flex: 1,
          maxWidth: '800px',
        },
        '.view-controls': {
          display: 'flex',
          gap: 3,
          alignItems: 'center',
        },
      },
    },
  },
};

const theme = extendTheme({
  colors,
  fonts,
  styles,
  shadows,
  radii,
  components,
});

export default theme; 