import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

// Optional: Icons or emojis per category
const category = [
  { label: "Frontend Developer", icon: "🖥️" },
  { label: "Backend Developer", icon: "🧠" },
  { label: "Data Science", icon: "📊" },
  { label: "Graphic Designer", icon: "🎨" },
  { label: "FullStack Developer", icon: "💻" }
];

export default function CategoryCarousel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="w-full px-4 md:px-8 my-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
        🌐 Browse by <span className="text-[#6A38C2]">Category</span>
      </h2>

      <Carousel className="w-full max-w-6xl mx-auto">
        <CarouselContent className="gap-2">
          {category.map((cat) => (
            <CarouselItem
              key={cat.label}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 flex justify-center"
            >
              <Button
                onClick={() => searchJobHandler(cat.label)}
                variant="outline"
                className="rounded-full px-6 py-3 w-full sm:w-auto text-sm md:text-base font-medium border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-all duration-300 ease-in-out shadow hover:shadow-lg whitespace-nowrap"
              >
                <span className="mr-2 text-lg">{cat.icon}</span>
                {cat.label}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hover:scale-110 transition-transform duration-200" />
        <CarouselNext className="hover:scale-110 transition-transform duration-200" />
      </Carousel>
    </div>
  );
}
