import { Link } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../utils/consts";
import { getAuthStatus } from "../../../../utils/methods";

const NavBar: React.FC = () => {
	const { isSuccess, data } = useQuery({
		queryKey: [QUERY_KEYS.USER_DATA],
		queryFn: getAuthStatus,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	return (
		<div className={styles.root}>
			<div className={styles.top}>
				<Link to={"/game"} className={styles.link}>
					<div>Play</div>
				</Link>

				<Link to={"/"} className={styles.link}>
					<div>Assignments</div>
				</Link>

				<Link to={"/"} className={styles.link}>
					<div>Stats</div>
				</Link>

				<Link to={"/"} className={styles.link}>
					<div>Class</div>
				</Link>
			</div>

			{isSuccess && data && (
				<div className={styles.bottom}>
					<Link to={"/"} className={styles.link}>
						<div>{data.user_data.username}</div>
					</Link>
				</div>
			)}
		</div>
	);
};

export default NavBar;
