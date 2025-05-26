import React from "react";
import { Button } from "../components/Button/Button";
import DefaultLayout from "../layouts/DefaultLayout";
import { metaPages } from "../shared/meta-pages";

export default function Home() {
  return (
    <DefaultLayout meta={metaPages.home}>
      <h1>Hello, Eleventy + React!</h1>
      <Button>Click me</Button>
			<br/>
			<img src="/assets/images/angel.png" alt="Logo" />
    </DefaultLayout>
  );
}