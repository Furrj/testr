import styles from "./Active.module.scss";
import type { T_QUESTION } from "../../../../types/questions";
import { useEffect, useRef, useState } from "react";
import UIHandlers from "../../../../utils/uiHandlers";
import {
  E_GAME_LIMIT_TYPES,
  E_GAME_STATUS,
  type T_GAME_SETTINGS,
} from "../../../../types/game";
import { PiDeviceRotateBold } from "react-icons/pi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse, HttpStatusCode } from "axios";
import {
  I_PARAMS_APIREQUEST_UPDATE_VERTICAL,
  apiRequestUpdateVertical,
} from "../../../../../requests";
import { QUERY_KEYS } from "../../../../utils/consts";
import { getUserSessionDataFromStorage } from "../../../../utils/methods";

interface IProps {
  questions: T_QUESTION[];
  userGuesses: React.MutableRefObject<number[]>;
  settings: T_GAME_SETTINGS;
  vertical: boolean;
  limitType: E_GAME_LIMIT_TYPES;
  gameStatus: {
    set: React.Dispatch<React.SetStateAction<E_GAME_STATUS>>;
  };
  currentQuestionIndex: {
    curr: number;
    set: React.Dispatch<React.SetStateAction<number>>;
  };
  timeInSeconds: {
    curr: number;
    set: React.Dispatch<React.SetStateAction<number>>;
  };
}

const Active: React.FC<IProps> = (props) => {
  const [inputErr, setInputErr] = useState<boolean>(false);
  const [verticalMode, setVerticalMode] = useState<boolean>(false);

  const currQuestion = props.questions[props.currentQuestionIndex.curr - 1];
  const savedVerticalMode = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // focus on input box on page load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  // reset input value and err on new question load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputErr && setInputErr(false);
    }
  }, [props.currentQuestionIndex.curr]);

  // setup timer
  useEffect(() => {
    const interval = setInterval(() => {
      props.timeInSeconds.set((prevSeconds) =>
        props.limitType === E_GAME_LIMIT_TYPES.TIME
          ? prevSeconds - 1
          : prevSeconds + 1,
      );
    }, 1000);

    // clean up on unmount
    return () => clearInterval(interval);
  }, []);

  // check for end of game if using time limits
  useEffect(() => {
    if (
      props.limitType === E_GAME_LIMIT_TYPES.TIME &&
      props.timeInSeconds.curr < 1
    ) {
      props.gameStatus.set(E_GAME_STATUS.POST);
    }
  }, [props.timeInSeconds]);

  // init vertical mode
  useEffect(() => {
    savedVerticalMode.current = props.vertical;

    if (rootRef.current) {
      if (rootRef.current.clientWidth >= 800) {
        setVerticalMode(savedVerticalMode.current);
      }
    }
  }, [props.vertical]);

  // set up window resize listener for disabling vertical mode
  useEffect(() => {
    function checkResizeForVerticalEligibility() {
      if (rootRef.current) {
        if (rootRef.current.clientWidth < 800 && verticalMode) {
          setVerticalMode(false);
        } else if (
          rootRef.current.clientWidth >= 800 &&
          verticalMode !== savedVerticalMode.current
        ) {
          setVerticalMode(savedVerticalMode.current);
        }
      }
    }
    window.addEventListener("resize", checkResizeForVerticalEligibility);

    return () =>
      window.removeEventListener("resize", checkResizeForVerticalEligibility);
  }, [verticalMode]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (
      params: I_PARAMS_APIREQUEST_UPDATE_VERTICAL,
    ): Promise<AxiosResponse> => apiRequestUpdateVertical(params),
    onSuccess(data) {
      if (data.status === HttpStatusCode.Ok)
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_DATA],
        });
      else console.log("error");
    },
  });

  return (
    <div
      className={`${styles.root} ${verticalMode ? styles.vertical : ""}`}
      ref={rootRef}
    >
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.number}>
            # {props.currentQuestionIndex.curr}
            {props.limitType === E_GAME_LIMIT_TYPES.COUNT &&
              `/${props.settings.limits.count}`}
          </div>
          <div
            className={styles.timer}
            style={{
              color:
                props.timeInSeconds.curr < 10 &&
                props.limitType === E_GAME_LIMIT_TYPES.TIME
                  ? "red"
                  : "",
            }}
          >
            {UIHandlers.formatTime(props.timeInSeconds.curr)}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.left}>
              <h2>{currQuestion.operands[0]}</h2>
            </div>
            <div className={styles.middle}>
              <h2>
                {UIHandlers.convertOperatorToDisplay(currQuestion.operator)}
              </h2>
            </div>
            <div className={styles.right}>
              <h2>{currQuestion.operands[1]}</h2>
            </div>
          </div>
          <div className={styles.bottom}>
            <input
              className={inputErr ? styles.err : ""}
              type="number"
              name="userAnswer"
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // submit answer
                  if (inputRef.current?.value !== "") {
                    props.userGuesses.current.push(
                      e.currentTarget.valueAsNumber,
                    );

                    // if last question set gameState to 'post' else increase index
                    if (
                      props.limitType === E_GAME_LIMIT_TYPES.COUNT &&
                      props.currentQuestionIndex.curr >=
                        props.settings.limits.count
                    ) {
                      props.gameStatus.set(E_GAME_STATUS.POST);
                    } else {
                      props.currentQuestionIndex.set((curr) => curr + 1);
                    }
                  } else setInputErr(true);
                }
              }}
              onChange={() => inputErr && setInputErr(false)}
            />
            <div
              className={styles.rotate}
              onClick={() => {
                savedVerticalMode.current = !savedVerticalMode.current;
                setVerticalMode((curr) => !curr);

                mutation.mutate({
                  vertical: savedVerticalMode.current,
                  tokens: getUserSessionDataFromStorage(),
                });
              }}
            >
              <PiDeviceRotateBold />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Active;
