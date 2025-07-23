import BaseHtml from "../templates/BaseHtml";
import { Header } from "../components/Header/Header";

export default function DefaultLayout({ children, meta }) {
	return (
		<BaseHtml meta={meta}>
			<Header pagePath={meta.path} />
			<main>{children}</main>
			<footer>footer</footer>
		</BaseHtml>
	);
}
