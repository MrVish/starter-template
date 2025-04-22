import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Stack,
  Icon,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import GlassMorphismCard from './GlassMorphismCard';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
  onScrollDown?: () => void;
  backgroundGradient?: string;
  showScrollIndicator?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Build Something Amazing',
  subtitle = 'A modern platform with everything you need to create your next great project. Easy to use, powerful, and customizable.',
  ctaText = 'Get Started',
  secondaryCtaText = 'Learn More',
  onPrimaryCta,
  onSecondaryCta,
  onScrollDown,
  backgroundGradient,
  showScrollIndicator = true,
}) => {
  const defaultGradient = useColorModeValue(
    'linear(to-br, blue.400, purple.600)',
    'linear(to-br, blue.700, purple.900)'
  );
  
  const textColor = useColorModeValue('gray.700', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.300');
  
  const handleScrollDown = () => {
    if (onScrollDown) {
      onScrollDown();
    } else {
      // Default scroll down behavior
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box
      position="relative"
      height={{ base: '100vh', md: '90vh' }}
      minHeight="600px"
      width="100%"
      bg={backgroundGradient || defaultGradient}
      overflow="hidden"
    >
      {/* Background decorative elements */}
      <Box
        position="absolute"
        width="500px"
        height="500px"
        borderRadius="full"
        bg="whiteAlpha.100"
        filter="blur(80px)"
        top="-100px"
        right="-100px"
        zIndex={0}
      />
      <Box
        position="absolute"
        width="300px"
        height="300px"
        borderRadius="full"
        bg="whiteAlpha.100"
        filter="blur(60px)"
        bottom="-50px"
        left="10%"
        zIndex={0}
      />
      
      {/* Main Content */}
      <Container 
        maxW="container.xl" 
        height="100%" 
        position="relative" 
        zIndex={1}
      >
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          height="100%" 
          textAlign="center"
          px={{ base: 4, md: 8 }}
        >
          <GlassMorphismCard
            maxW="800px"
            p={{ base: 8, md: 12 }}
            opacity={0.6}
            blurStrength={10}
            mb={10}
          >
            <Stack spacing={6}>
              <Heading
                as="h1"
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="bold"
                color={textColor}
                lineHeight="1.2"
              >
                {title}
              </Heading>
              
              <Text 
                fontSize={{ base: 'lg', md: 'xl' }}
                color={subtitleColor}
                maxW="600px"
                mx="auto"
              >
                {subtitle}
              </Text>
              
              <HStack 
                spacing={4} 
                justify="center"
                pt={4}
              >
                <Button
                  size="lg"
                  colorScheme="blue"
                  rightIcon={<FiArrowRight />}
                  onClick={onPrimaryCta}
                  fontSize="md"
                  px={8}
                  py={6}
                  borderRadius="xl"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                >
                  {ctaText}
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onSecondaryCta}
                  fontSize="md"
                  px={8}
                  py={6}
                  borderRadius="xl"
                  borderWidth="2px"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                  }}
                >
                  {secondaryCtaText}
                </Button>
              </HStack>
            </Stack>
          </GlassMorphismCard>
          
          {showScrollIndicator && (
            <Box position="absolute" bottom="10%" left="50%" transform="translateX(-50%)">
              <IconButton
                aria-label="Scroll down"
                icon={<FiChevronDown />}
                fontSize="24px"
                variant="ghost"
                color="white"
                bg="rgba(0, 0, 0, 0.2)"
                _hover={{ bg: "rgba(0, 0, 0, 0.4)" }}
                borderRadius="full"
                boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
                textShadow="0px 1px 2px rgba(0, 0, 0, 0.3)"
                onClick={handleScrollDown}
                animation="bounce 2s infinite"
                sx={{
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-10px)' },
                    '60%': { transform: 'translateY(-5px)' },
                  },
                }}
              />
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection; 