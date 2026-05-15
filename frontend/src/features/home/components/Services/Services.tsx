import { Box, Container, Typography, keyframes } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type JSX } from "react";

gsap.registerPlugin(ScrollTrigger);

type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  numericPrice: number;
  imagePosition?: string;
};

const services: Service[] = [
  {
    id: "flower",
    title: "Floral Decoration",
    description: "Elegant floral arrangements and luxury décor to set the perfect mood for your celebration.",
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=1600",
    numericPrice: 50000,
    imagePosition: "center 60%",
  },
  {
    id: "coordinate",
    title: "Wedding Coordination",
    description: "Seamless end-to-end planning and on-day execution for a stress-free wedding experience.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600",
    numericPrice: 100000,
  },
  {
    id: "photoshoot",
    title: "Cinematic Photoshoot",
    description: "Capturing every heartfelt moment with professional, cinematic photography and videography.",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1600",
    numericPrice: 120000,
    imagePosition: "center 30%",
  },
  {
    id: "makeup",
    title: "Luxury Makeup Artist",
    description: "Expert beauty services to ensure you look breathtaking throughout your special day.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1600",
    numericPrice: 25000,
  },
  {
    id: "invitation",
    title: "Elegant Invitations",
    description: "Custom-designed stationery and invitations that reflect the unique theme of your wedding.",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=1600",
    numericPrice: 15000,
  },
  {
    id: "catering",
    title: "Premium Catering",
    description: "A culinary journey with curated menus and service that delights all your senses.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1600",
    numericPrice: 75000,
  },
];

const floatSlow = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, 60px) scale(1.1); }
`;

const Services = (): JSX.Element => {
  const rootRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const headerElements = ".services-header > *";
      const cards = ".service-card";

      // 1. Set initial states immediately to ensure GSAP takes tracking control
      gsap.set([headerElements, cards], {
        autoAlpha: 0,
        y: 40,
        scale: 0.98
      });

      // 2. Build the entrance animation (currently paused)
      const tl = gsap.timeline({ paused: true });

      tl.to(headerElements, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        overwrite: "auto"
      });

      tl.to(cards, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        overwrite: "auto"
      }, "-=0.5");

      // 3. Create a stable ScrollTrigger for manual control
      ScrollTrigger.create({
        trigger: root,
        start: "top 80%",
        onEnter: () => tl.play(0),
        onLeaveBack: () => tl.pause(0),
        // Ensures animations don't overlap or fight during rapid scrolling
        preventOverlaps: true,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      });

      // 4. Mouse Tracking for Shine Effect (unrelated to entry)
      const cardNodes = gsap.utils.toArray(cards) as HTMLElement[];
      cardNodes.forEach((card) => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty("--x", `${x}px`);
          card.style.setProperty("--y", `${y}px`);
        };

        card.addEventListener("mousemove", handleMouseMove);
        return () => card.removeEventListener("mousemove", handleMouseMove);
      });
    }, root);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <Box
      component="section"
      id="services-section"
      aria-label="Our Services"
      ref={rootRef as any}
      sx={{
        padding: { xs: "4rem 0", md: "4rem 0" },
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Blobs */}
      <Box
        sx={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
          opacity: 0.3,
          pointerEvents: "none",
          background: "radial-gradient(circle, #c7d2fe 0%, transparent 70%)",
          top: "-10%",
          right: "-10%",
          animation: `${floatSlow} 20s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
          opacity: 0.3,
          pointerEvents: "none",
          background: "radial-gradient(circle, #ede9fe 0%, transparent 70%)",
          bottom: "-15%",
          left: "-10%",
          animation: `${floatSlow} 25s ease-in-out infinite reverse`,
        }}
      />

      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 2.5, sm: 4 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          component="header"
          className="services-header"
          sx={{
            textAlign: "center",
            mb: { xs: 6, md: 12 },
          }}
        >
          <Typography
            variant="h2"
            className="services-title"
            sx={{
              fontSize: { xs: "1.85rem", md: "2.35rem" },
              fontWeight: 800,
              letterSpacing: "-0.015em",
              mb: 3,
              background: "linear-gradient(to bottom, #1e1e2d, #4b5563)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: 0,
              visibility: "hidden",
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "4.5px",
                background: "linear-gradient(90deg, #9b86ff 0%, #7c3aed 100%)",
                borderRadius: "4px",
              },
            }}
          >
            Crafting Your Perfect Day
          </Typography>
          <Typography
            variant="body1"
            className="services-subtitle"
            sx={{
              color: "#64748b",
              maxWidth: "700px",
              mx: "auto",
              fontSize: { xs: "16px", md: "18px" },
              lineHeight: 1.6,
              fontWeight: 400,
              opacity: 0,
              visibility: "hidden",
            }}
          >
            From exquisite floral arrangements to cinematic photography,
            we provide everything you need to create a truly unforgettable celebration.
          </Typography>
        </Box>

        <Box
          className="services-grid"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)"
            },
            gap: { xs: 4, md: "3.5rem" },
          }}
        >
          {services.map((s) => (
            <Box
              component="article"
              key={s.id}
              className="service-card"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                borderRadius: "28px",
                overflow: "hidden",
                transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
                height: "100%",
                willChange: "transform, opacity",
                opacity: 0,
                visibility: "hidden",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 30px 60px -15px rgba(124, 58, 237, 0.15)",
                  "& .service-image": {
                    transform: "scale(1.1)",
                  },
                  "& .service-card-title": {
                    color: "#7c3aed",
                  },
                  "& .card-shine": {
                    opacity: 1,
                  }
                },
              }}
            >
              <Box
                className="service-image-container"
                sx={{
                  width: "100%",
                  height: { xs: "200px", md: "190px" },
                  position: "relative",
                  overflow: "hidden",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to bottom, transparent 60%, rgba(255, 255, 255, 0.9))",
                  }
                }}
              >
                <Box
                  component="img"
                  src={s.image}
                  alt={s.title}
                  className="service-image"
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: s.imagePosition || 'center',
                    transition: "transform 0.8s ease",
                  }}
                />
              </Box>
              <Box
                className="service-content"
                sx={{
                  padding: { xs: "1.25rem 1.5rem", md: "1rem 1.25rem" },
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h4"
                  className="service-card-title"
                  sx={{
                    fontSize: { xs: "1.3rem", md: "1.4rem" },
                    fontWeight: 700,
                    color: "#1e1e2d",
                    mb: 1,
                    transition: "color 0.3s ease",
                  }}
                >
                  {s.title}
                </Typography>
                <Typography
                  variant="body2"
                  className="service-card-desc"
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    lineHeight: 1.6,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {s.description}
                </Typography>
              </Box>
              <Box
                className="card-shine"
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "28px",
                  background: "radial-gradient(600px circle at var(--x) var(--y), rgba(124, 58, 237, 0.08), transparent 40%)",
                  opacity: 0,
                  transition: "opacity 0.5s ease",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Services;
