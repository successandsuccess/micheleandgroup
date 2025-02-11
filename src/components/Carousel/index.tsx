"use client";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Card } from "./card";
import Link from "next/link";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
    slidesToSlide: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 770 },
    items: 3,
    slidesToSlide: 3,
  },
  mobile: {
    breakpoint: { max: 770, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const ImageCarousel = ({ data }: { data: any }) => {
  if(data)
  return (
    <div>
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlaySpeed={5000}
        autoPlay={true}
        transitionDuration={500}
      >
        {data?.map((item: any, index: number) => (
          <Link href={item.link} key={'talent-card' + index}>
          <Card
            key={"carousel-card" + index}
            src={item.image}
            description={item.name}
          />
          </Link>
        ))}
      </Carousel>
    </div>
  );
  else return <></>
};

export default ImageCarousel;
