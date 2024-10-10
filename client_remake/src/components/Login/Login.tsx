import styles from "./Login.module.scss";
import React, { useState } from "react";
import { apiRequestLogin } from "../../../requests.ts";
import {
  INIT_USERINPUT_LOGIN,
  type T_APIRESULT_LOGIN,
  type T_USERINPUT_LOGIN,
} from "../../types";
import { AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendTokensToLocalStorage } from "../../utils/methods.tsx";

const Login: React.FC = () => {
  const [userInput, setUserInuput] =
    useState<T_USERINPUT_LOGIN>(INIT_USERINPUT_LOGIN);
  const [error, setError] = useState<boolean>(false);
  const [incorrectInfo, setIncorrectInfo] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (
      userInput: T_USERINPUT_LOGIN,
    ): Promise<AxiosResponse<T_APIRESULT_LOGIN>> => {
      return apiRequestLogin(userInput);
    },
    onError(err) {
      console.log(err);
    },
    // TODO: handle error vs incorrect info
    onSuccess(data) {
      if (data.data.valid) {
        sendTokensToLocalStorage(data.data.tokens);
        queryClient.resetQueries();
      } else {
        setIncorrectInfo(true);
      }
    },
  });

  // INPUT HANDLER
  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (incorrectInfo) setIncorrectInfo(false);

    setUserInuput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.scroll}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            mutation.mutate(userInput);
          }}
        >
          <h2>Username:</h2>
          <input
            type="text"
            name="username"
            value={userInput.username}
            onChange={inputHandler}
            autoComplete="on"
          />
          <br />
          <h2>Password:</h2>
          <input
            type="password"
            name="password"
            id="passwordBox"
            value={userInput.password}
            onChange={inputHandler}
            autoComplete="on"
          />

          {incorrectInfo && (
            <div style={{ color: "red", marginTop: "10px" }}>
              Information was incorrect
            </div>
          )}

          {error && (
            <div>
              <div>Error, Please Try Again</div>
              <br />
            </div>
          )}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
