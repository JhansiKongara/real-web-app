import Carousel from "./components/carousel";
import Plots from "./components/plots";


export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">

      <Carousel />
      <Plots />
      
      
    </main>
  );
}
