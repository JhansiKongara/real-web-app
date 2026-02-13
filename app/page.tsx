import Header from "./components/header";
import Footer from "./components/footer";
import Carousel from "./components/carousel";
import Plots from "./components/plots";


export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
     {/* <h1 className="text-4xl text-red-500">Hello</h1> */}

      <Carousel />
      <Plots />
      
      
    </main>
  );
}
