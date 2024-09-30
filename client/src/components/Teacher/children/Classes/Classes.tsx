import { useRef, useState } from "react";
import { T_CLASS } from "../../../Register/Register";
import styles from "./Classes.module.scss";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
  apiRequestAddClass,
  I_PARAMS_APIREQUEST_ADD_CLASS,
} from "../../../../../requests";
import { QUERY_KEYS } from "../../../../utils/consts";
import {
  getAuthStatus,
  getUserSessionDataFromStorage,
} from "../../../../utils/methods";

interface IProps {
  classes: T_CLASS[];
  userID: number;
}

const Classes: React.FC<IProps> = (props) => {
  const [addingMode, setAddingMode] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.USER_DATA],
    queryFn: getAuthStatus,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (
      params: I_PARAMS_APIREQUEST_ADD_CLASS,
    ): Promise<AxiosResponse> => {
      return apiRequestAddClass(params);
    },
    onError(err) {
      console.log(err);
      alert("Error, please refresh and try again");
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLASSES] });
    },
  });

  return (
    <div className={styles.root}>
      <h2>Teacher Code: {data?.user_data.user_id}</h2>
      <h2>My Classes</h2>
      <div className={styles.content}>
        <div className={styles.scroll}>
          {props.classes.length > 0 &&
            props.classes.map((c) => (
              <div key={`class-${c.class_id}`} className={styles.box}>
                {c.name}
              </div>
            ))}
          {addingMode ? (
            <div className={`${styles.new}`}>
              <input
                className={styles.text}
                type="text"
                placeholder="Class Name"
                ref={inputRef}
              />
              <button
                onClick={() => {
                  if (inputRef.current) {
                    mutation.mutate({
                      c: { name: inputRef.current.value, class_id: 0 },
                      tokens: getUserSessionDataFromStorage(),
                    });
                    setAddingMode(false);
                    inputRef.current.value = "";
                  }
                }}
              >
                +
              </button>
            </div>
          ) : (
            <div className={styles.box} onClick={() => setAddingMode(true)}>
              +
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classes;
