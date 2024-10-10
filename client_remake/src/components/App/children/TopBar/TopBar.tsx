import { useState } from "react";
import styles from "./TopBar.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import NavBar from "./children/NavBar/NavBar";
import { IoMdExit } from "react-icons/io";
import { QUERY_KEYS } from "../../../../utils/consts";
import {
  clearTokensFromLocalStorage,
  getAuthStatus,
} from "../../../../utils/methods";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PiMathOperationsBold } from "react-icons/pi";
import { VscColorMode } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";

const TopBar: React.FC = () => {
  const { isSuccess, data } = useQuery({
    queryKey: [QUERY_KEYS.USER_DATA],
    queryFn: getAuthStatus,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const [showingNavbar, setShowingNavbar] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const location = useLocation();

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <PiMathOperationsBold className={styles.icon} />
        <h1 className={styles.title}>Mathtestr</h1>

        <div className={styles.right}>
          {isSuccess && data.valid ? (
            <div className={styles.logged_in}>
              <IoMdExit
                onClick={() => {
                  clearTokensFromLocalStorage();
                  queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.USER_DATA],
                  });
                }}
                className={styles.logout}
              />
              <GiHamburgerMenu
                onClick={() => setShowingNavbar((curr) => !curr)}
                className={styles.hamburger}
              />
            </div>
          ) : (
            <>
              {location.pathname !== "/login" && (
                <div className={styles.buttons}>
                  <Link to={"/login"} className={"link"}>
                    <button>Login</button>
                  </Link>
                </div>
              )}
            </>
          )}
          <VscColorMode className={styles.theme} />
        </div>
      </div>

      {showingNavbar && (
        <div className={styles.navbar}>
          <NavBar />
        </div>
      )}
    </div>
  );
};

export default TopBar;
