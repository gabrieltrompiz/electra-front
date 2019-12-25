import React, { useState, useRef } from 'react';

interface ShowcaseCarouselProps {
  /** Images that will be shown in the showcase. Have to pass them with require() method. */
  images: Array<string>
}

/**
 * Carousel showcasing app's features
 * @visibleName Showcase Carousel
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ images }) => {
  const [active, setActive] = useState<number>(0);
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const imageRef = useRef<HTMLImageElement>(null);

  /** Changes the active image to the next one and animates transitions */
  const moveRight = () => {
    if(imageRef && imageRef.current && !transitioning) {
      setTransitioning(true);
      imageRef.current.classList.toggle('opacityIn');
      imageRef.current.classList.toggle('opacityOut');
      setTimeout(() => {
        setActive(active === images.length - 1 ? 0 : active + 1);
        if(imageRef && imageRef.current) {
          imageRef.current.classList.toggle('opacityOut');
          imageRef.current.classList.toggle('opacityIn');
          setTransitioning(false);
        }
      }, 300);
    }
  };

   /** Changes the active image to the previous one and animates transitions */
  const moveLeft = () => {
    if(imageRef && imageRef.current && !transitioning) {
      setTransitioning(true);
      imageRef.current.classList.toggle('opacityIn');
      imageRef.current.classList.toggle('opacityOut');
      setTimeout(() => {
        setActive(active === 0 ? images.length - 1 : active - 1);
        if(imageRef && imageRef.current) {
          imageRef.current.classList.toggle('opacityOut');
          imageRef.current.classList.toggle('opacityIn');
          setTransitioning(false);
        }
      }, 350);
    }
  };

  const moveTo = (position: number) => {
    if(imageRef && imageRef.current && !transitioning) {
      setTransitioning(true);
      imageRef.current.classList.toggle('opacityIn');
      imageRef.current.classList.toggle('opacityOut');
      setTimeout(() => {
        setActive(position);
        if(imageRef && imageRef.current) {
          imageRef.current.classList.toggle('opacityOut');
          imageRef.current.classList.toggle('opacityIn');
          setTransitioning(false);
        }
      }, 350);
    }
  };

  return (
    <div id='carousel'>
      <div>
        <img src={require('../assets/images/arrow-right.png')} alt='arrow' onClick={() => moveLeft()}/>
        <img src={images[active]} alt='feature' ref={imageRef} className='opacityIn' />
        <img src={require('../assets/images/arrow-right.png')} alt='arrow' onClick={() => moveRight()}/>
      </div>
      <div>
        {images.map((_, i) => 
          <img key={i} src={i === active ? require('../assets/images/dot-filled.png') : require('../assets/images/dot-empty.png')} alt='dot' onClick={() => moveTo(i)}/>)
        }
      </div>
    </div>
  );
};

export default ShowcaseCarousel;