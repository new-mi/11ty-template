import React from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import { metaPages } from "../shared/meta-pages";
import { TestFancybox } from "../components/TestFancybox/TestFancybox.jsx";

export default function Contacts() {
	return (
		<DefaultLayout meta={metaPages.contacts}>
			<h1>Contacts</h1>
			<TestFancybox />
		</DefaultLayout>
	);
}
