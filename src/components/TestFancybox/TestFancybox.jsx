import { images } from "./images.js";

export const TestFancybox = () => {
	return (
		<div className="fancybox">
			{images.map((image) => (
				<a
					key={image.src}
					href={image.src}
					data-fancybox="gallery"
					data-caption={image.caption}
				>
					<img src={image.src} alt={image.caption} />
				</a>
			))}
		</div>
	);
};
