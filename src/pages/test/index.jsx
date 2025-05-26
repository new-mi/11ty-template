import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { metaPages } from "../../shared/meta-pages";


export default function Test() {
  return (
    <DefaultLayout meta={metaPages.test}>
      <h1>Test</h1>
			<div className="test-image" />
    </DefaultLayout>
  );
}