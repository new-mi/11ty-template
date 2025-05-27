import React from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import { Button } from "../components/Button/Button";
import { metaPages } from "../shared/meta-pages";
import { TestSwiper } from "../components/TestSwiper/TestSwiper.jsx";

export default function About() {
	return (
		<DefaultLayout meta={metaPages.about}>
			<h1>About</h1>
			<Button>Click me</Button>
			<TestSwiper />
		</DefaultLayout>
	);
}
