import styles from "./Post.module.scss";
import type { T_QUESTION_RESULT } from "../../../../types/questions";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiRequestSubmitGameSession,
  I_PARAMS_APIREQUEST_SUBMIT_GAME_SESSION,
} from "../../../../../requests";
import { HttpStatusCode, type AxiosResponse } from "axios";
import {
  E_GAME_LIMIT_TYPES,
  E_GAME_STATUS,
  T_GAME_SETTINGS,
} from "../../../../types/game";
import { getUserSessionDataFromStorage } from "../../../../utils/methods";
import UIHandlers from "../../../../utils/uiHandlers";
import { QUERY_KEYS } from "../../../../utils/consts";
import { FaRedoAlt, FaPlus } from "react-icons/fa";

interface IProps {
  results: T_QUESTION_RESULT[];
  time: number;
  settings: T_GAME_SETTINGS;
  limitType: E_GAME_LIMIT_TYPES;
  gameStatus: {
    curr: E_GAME_STATUS;
    set: React.Dispatch<React.SetStateAction<E_GAME_STATUS>>;
  };
  currentQuestionIndex: {
    curr: number;
    set: React.Dispatch<React.SetStateAction<number>>;
  };
  timeInSeconds: {
    curr: number;
    set: React.Dispatch<React.SetStateAction<number | null>>;
  };
  restartGame: (status: E_GAME_STATUS) => void;
}

const Post: React.FC<IProps> = (props) => {
  const [sent, setSent] = useState<boolean>(false);

  const correctCount = props.results.filter(({ correct }) => correct).length;
  const questionsCount = props.results.length;
  const score = Math.round((correctCount / questionsCount) * 100);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (
      params: I_PARAMS_APIREQUEST_SUBMIT_GAME_SESSION,
    ): Promise<AxiosResponse> => apiRequestSubmitGameSession(params),
    onSuccess(data) {
      if (data.status === HttpStatusCode.Ok)
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_GAME_SESSIONS],
        });
      else console.log("error");
      setSent(true);
    },
  });

  // submit on page load
  useEffect(() => {
    !sent &&
      mutation.mutate({
        tokens: getUserSessionDataFromStorage(),
        session: {
          limit_type: props.limitType,
          questions_count: questionsCount,
          correct_count: correctCount,
          score,
          time:
            props.limitType === E_GAME_LIMIT_TYPES.TIME
              ? props.settings.limits.time
              : props.time,
          min: props.settings.range.min,
          max: props.settings.range.max,
          add: props.settings.ops.add,
          sub: props.settings.ops.sub,
          mult: props.settings.ops.mult,
          div: props.settings.ops.div,
        },
      });
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <div className={styles.score}>
          <h2>{score}%</h2>
        </div>
        <div className={styles.ratio}>
          <h3>
            {correctCount}/{questionsCount}
          </h3>
        </div>
        <div className={styles.time}>
          <h3>
            {UIHandlers.formatTime(
              props.limitType === E_GAME_LIMIT_TYPES.TIME
                ? props.settings.limits.time
                : props.time,
            )}
          </h3>
        </div>
      </div>

      <div className={styles.results}>
        {props.results
          .filter(({ correct }) => !correct)
          .map((result) => {
            return (
              <div key={`question-${result.id}`} className={styles.incorrect}>
                <div>#{result.id}</div>
                <div>
                  {result.operands[0]}{" "}
                  {UIHandlers.convertOperatorToDisplay(result.operator)}{" "}
                  {result.operands[1]} = {result.answer}
                </div>
                <div>{result.guess}</div>
              </div>
            );
          })}
      </div>

      <div className={styles.buttons}>
        <div className={styles.box}>
          <div
            className={styles.button}
            onClick={() => props.restartGame(E_GAME_STATUS.ACTIVE)}
          >
            <FaRedoAlt className={styles.icon} />
          </div>
          Play Again
        </div>
        <div className={styles.box}>
          <div
            className={styles.button}
            onClick={() => props.restartGame(E_GAME_STATUS.PRE)}
          >
            <FaPlus className={styles.icon} />
          </div>
          New Game
        </div>
      </div>
    </div>
  );
};

export default Post;
