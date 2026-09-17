import HeroSection from '../components/home/HeroSection';
import NowPlayingCarousel from '../components/home/NowPlayingCarousel';
import UpcomingSection from '../components/home/UpcomingSection';
import Container from '../components/ui/Container';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <Container className="py-12 space-y-12">
        <NowPlayingCarousel />
        <UpcomingSection />
      </Container>
    </div>
  );
}
