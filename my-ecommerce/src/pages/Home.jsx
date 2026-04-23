import React from "react";
import { useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

import shoes from "../assets/shoes.png";
import food from "../assets/food.png";
import makeup from "../assets/makeup.jpg";
import Categories from "./Categories";
import AccordinComp from "@/components/AccordinComp";
import { fetchProducts } from "@/slices/productSlice";
import { useDispatch } from "react-redux";

function Home() {
   const dispatch = useDispatch();
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
 
  useEffect(() => {
    console.log("Dispatching fetchProducts"); 
    dispatch(fetchProducts());
  }, [dispatch]);
  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);

  }, [api]);
  

  return (
    <>
    <div className="w-full max-w-6xl mx-auto mt-8">
      <Carousel setApi={setApi}>
        <CarouselContent>

          <CarouselItem>
            <img src={shoes} className="w-full h-[420px] object-cover rounded-xl" />
          </CarouselItem>

          <CarouselItem>
            <img src={food} className="w-full h-[420px] object-cover rounded-xl" />
          </CarouselItem>

          <CarouselItem>
            <img src={makeup} className="w-full h-[420px] object-cover rounded-xl" />
          </CarouselItem>

        </CarouselContent>
      </Carousel>

      <div className="text-center mt-4 text-lg font-medium">
        Slide {current} of {count}
      </div>
    
    </div>
      <Categories/>
      <AccordinComp/>
    </>
  );
}

export default Home;