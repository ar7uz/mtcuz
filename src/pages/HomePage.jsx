/* HomePage — wraps the existing landing sections, sets document.title */

function HomePage() {
  useEffect(() => {
    document.title = `${BRAND.full} — ${BRAND.tagline}`;
  }, []);

  return (
    <>
      <HeroDark />
      <TrustBar />
      <HeroLight />
      <FeaturedProjects />
      <WhyUs />
      <ScaleNumbers />
      <Government />
      <SubsidiariesTeaser />
      <ProcessTimeline />
      <Testimonials />
      <News />
      <FinalCTA />
    </>
  );
}

window.HomePage = HomePage;
