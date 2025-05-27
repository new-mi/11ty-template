import React from "react";
import { slides } from "./slides.js";

export const TestSwiper = () => {
	return (
		<div className="swiper">
			<div className="swiper-wrapper">
				{slides.map((slide) => (
					<div className="swiper-slide" key={slide.src}>
						<img src={slide.src} alt={slide.caption} />
						<span>{slide.caption}</span>
					</div>
				))}
			</div>
			<div className="swiper-pagination"></div>

			<div className="swiper-button-prev"></div>
			<div className="swiper-button-next"></div>

			<div className="swiper-scrollbar"></div>
		</div>
	);
};
