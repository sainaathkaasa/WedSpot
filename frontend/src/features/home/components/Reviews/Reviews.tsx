import { type JSX, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Rating
} from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeReview } from "@/features/home/types";

gsap.registerPlugin(ScrollTrigger);

const reviews: HomeReview[] = [
  {
    id: 1,
    name: "Sarah & Michael",
    role: "Wedding - June 2024",
    image: "https://ui-avatars.com/api/?name=Sarah+Michael&background=7c3aed&color=fff&size=80",
    rating: 5,
    review: "WeddsPot made our dream wedding come true! Every detail was perfect, from the flowers to the coordination. The team was professional, attentive, and truly cared about making our day special.",
    date: "2 months ago"
  },
  {
    id: 2,
    name: "Emily & James",
    role: "Wedding - April 2024",
    image: "https://ui-avatars.com/api/?name=Emily+James&background=a855f7&color=fff&size=80",
    rating: 5,
    review: "Absolutely amazing service! The photographers captured every precious moment beautifully. We couldn't be happier with how everything turned out. Highly recommend WeddsPot to any couple!",
    date: "4 months ago"
  },
  {
    id: 3,
    name: "Jessica & David",
    role: "Wedding - March 2024",
    image: "https://ui-avatars.com/api/?name=Jessica+David&background=8b5cf6&color=fff&size=80",
    rating: 5,
    review: "From planning to execution, everything was flawless. The team handled our destination wedding with such ease and professionalism. Our guests are still talking about how beautiful it was!",
    date: "5 months ago"
  },
  {
    id: 4,
    name: "Amanda & Robert",
    role: "Wedding - February 2024",
    image: "https://ui-avatars.com/api/?name=Amanda+Robert&background=9333ea&color=fff&size=80",
    rating: 5,
    review: "Best decision we made for our wedding! The attention to detail and creative ideas from the WeddsPot team exceeded our expectations. Thank you for making our special day unforgettable!",
    date: "6 months ago"
  },
  {
    id: 5,
    name: "Rachel & Tom",
    role: "Wedding - January 2024",
    image: "https://ui-avatars.com/api/?name=Rachel+Tom&background=7c3aed&color=fff&size=80",
    rating: 5,
    review: "Professional, creative, and so easy to work with! They took all our stress away and delivered a wedding that was more beautiful than we imagined. Worth every penny!",
    date: "7 months ago"
  },
  {
    id: 6,
    name: "Lisa & Mark",
    role: "Wedding - December 2023",
    image: "https://ui-avatars.com/api/?name=Lisa+Mark&background=a855f7&color=fff&size=80",
    rating: 5,
    review: "WeddsPot turned our vision into reality with such grace and precision. The makeup artists were incredible, and the venue decoration was breathtaking. Couldn't have asked for better!",
    date: "8 months ago"
  }
];

const Reviews = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Triple the reviews to ensure seamless looping on all screen sizes
  const carouselReviews = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Initial appearance animations matching site standards
      gsap.set(headerRef.current, { opacity: 0, y: 30 });
      gsap.set(".review-card", { opacity: 0, scale: 0.9, y: 20 });

      gsap.to(headerRef.current, {
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.to(".review-card", {
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
      });

      // 2. Continuous Sliding Carousel Logic
      const track = trackRef.current;
      if (!track) return;

      // Calculate translation distance (one full set of reviews)
      const totalWidth = track.scrollWidth;
      const singleSetWidth = totalWidth / 3;

      // Create the infinite scroll timeline
      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "none" }
      });

      tl.to(track, {
        x: -singleSetWidth,
        duration: 30, // Adjust speed here
        onRepeat: () => {
          gsap.set(track, { x: 0 });
        }
      });

      timelineRef.current = tl;

      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const handleMouseEnter = () => {
    timelineRef.current?.pause();
  };

  const handleMouseLeave = () => {
    timelineRef.current?.play();
  };

  return (
    <Box
      component="section"
      id="reviews-section"
      ref={sectionRef as any}
      sx={{
        width: "100%",
        py: { xs: 8, md: 5 },
        background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          maxWidth: "1440px",
          px: { xs: "20px", md: "40px" },
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box
          ref={headerRef as any}
          sx={{
            textAlign: "center",
            mb: { xs: "50px", md: "70px" },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "26px", sm: "30px", md: "38px" },
              fontWeight: 800,
              mb: "16px",
              color: "#1a1a1a",
              lineHeight: 1.2,
              display: "inline-block",
              position: "relative",
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
            What Our Clients Say
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "15px", md: "17px" },
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
              mt: 1.5,
            }}
          >
            Don't just take our word for it - hear from the couples who trusted
            us with their special day.
          </Typography>
        </Box>

        {/* Carousel Wrapper */}
        <Box
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            width: "100%",
            overflow: "hidden", // Clips the sliding track
            cursor: "grab",
            "&:active": { cursor: "grabbing" },
            py: 2
          }}
        >
          {/* Carousel Track */}
          <Box
            ref={trackRef as any}
            sx={{
              display: "flex",
              gap: { xs: "20px", md: "30px" },
              width: "max-content", // Important for horizontal scrolling
              willChange: "transform"
            }}
          >
            {carouselReviews.map((review, index) => (
              <Box
                key={`${review.id}-${index}`}
                className="review-card"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                  background: "#fff",
                  p: { xs: "20px", sm: "24px", md: "28px" },
                  borderRadius: "24px",
                  border: "2px solid",
                  borderColor: "rgba(124, 58, 237, 0.08)",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                  width: { xs: "280px", sm: "320px", md: "350px" }, // Reduced width for more compact look
                  flexShrink: 0,
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    borderColor: "rgba(124, 58, 237, 0.3)",
                    boxShadow: "0 15px 45px rgba(124, 58, 237, 0.15)",
                    zIndex: 10,
                    "& .quote-icon": {
                      background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                      color: "#fff",
                      transform: "scale(1.1) rotate(-5deg)",
                    },
                    "& .author-image": {
                      borderColor: "rgba(124, 58, 237, 0.3)",
                      transform: "scale(1.05)",
                    }
                  },
                }}
              >
                {/* Quote Icon */}
                <Box
                  className="quote-icon"
                  sx={{
                    width: 48,
                    height: 48,
                    background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7c3aed",
                    transition: "all 0.3s ease",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                  </svg>
                </Box>

                {/* Rating */}
                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#fbbf24",
                    },
                    "& .MuiRating-iconEmpty": {
                      color: "#e5e7eb",
                    },
                  }}
                />

                {/* Review Text */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "#555",
                    fontStyle: "italic",
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  "{review.review}"
                </Typography>

                {/* Author Info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    pt: "16px",
                    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Avatar
                    src={review.image}
                    alt={review.name}
                    className="author-image"
                    sx={{
                      width: 52,
                      height: 52,
                      border: "3px solid",
                      borderColor: "rgba(124, 58, 237, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#1a1a1a",
                        mb: 0.5,
                      }}
                    >
                      {review.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#7c3aed",
                        fontWeight: 500,
                      }}
                    >
                      {review.role}
                    </Typography>
                  </Box>
                </Box>

                {/* Date */}
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#999",
                    position: "absolute",
                    top: "32px",
                    right: "32px",
                  }}
                >
                  {review.date}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Reviews;
