import { links } from "./navigation";
import clsx from "clsx";

export const Header = ({ pagePath }) => {
	return (
		<header className="header">
			<nav className="nav">
				{links.map((link) => {
					return (
						<a
							key={link.href}
							href={link.href}
							className={clsx("link", {
								"link--active": link.href === pagePath,
							})}
						>
							{link.label}
						</a>
					);
				})}
			</nav>
		</header>
	);
};
