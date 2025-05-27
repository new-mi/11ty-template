import React from "react";

export default function BaseHtml({ children, meta }) {
	return (
		<html lang="ru">
			<head>
				<meta charSet="UTF-8" />
				<title>{meta.title}</title>
				<meta name="description" content={meta.description} />
				<link rel="stylesheet" href="/assets/css/libs.min.css" />
				<link rel="stylesheet" href="/assets/css/main.css" />
				<link rel="stylesheet" href="/assets/css/custom.css" />
			</head>
			<body>
				<main>{children}</main>
				<script src="/assets/js/libs.min.js"></script>
				<script src="/assets/js/main.js"></script>
				<script src="/assets/js/custom.js"></script>
			</body>
		</html>
	);
}
