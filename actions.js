import * as types from "./types";

// https://allover.twodee.org/remote-state/fetching-memories/
function assertResponse(response) {
  if (response.status >= 200 || response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}

export const rememberLogin = ({ isTeacher, isStudent, isLoggedOut }) => {
  return {
    type: types.REMEMBER_LOGIN,
    payload: { isTeacher, isStudent, isLoggedOut },
  };
};

export const loggedIn = (data) => ({ type: types.LOGGED_IN, payload: data });

export const newCourse = (data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginMessageBody),
  };
  fetch(`https://teleband.cs.jmu.edu/login`, options);
};

export const attemptLogin = (loginInfo) => {
  let loginMessageBody = {};
  if (loginInfo && "email" in loginInfo && "password" in loginInfo) {
    loginMessageBody = {
      email: loginInfo.email,
      password: loginInfo.password,
    };
  } else if (loginInfo && "school_id" in loginInfo) {
    loginMessageBody = {
      school_id: loginInfo.school_id,
    };
  } else {
    console.error("not enough info to login", loginInfo);
  }

  return (dispatch) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginMessageBody),
    };
    fetch(`https://teleband.cs.jmu.edu/login`, options)
      .then(assertResponse)
      .then((response) => response.json())
      .then((data) => {
        console.log("got back response", data, data.token);
        if (data.error) {
          console.error(data);
        } else {
          dispatch(loggedIn(data));
        }
        // if (data.) {
        //   dispatch(replaceMemory({...memory, isEditing: false}));
        // } else {
        //   console.error(data);
        // }
      });
  };
};

// const onSubmitTeacher = (values) => {
//   loggingIn({ email: values["email"], password: values["password"] }, "teacher")
// }
// const onSubmitStudent = (values) => {
//   loggingIn({ school_id: values["school-id"] }, "student")
// }

// function loggingIn(payload, type) {
//   fetch(`${FetchURL}login`, {
//       method: "POST",
//       headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//       },
//       body: JSON.stringify(payload)
//   })
//   .then(resp => resp.json())
//   .then(json => {
//       if (json.error) {
//           alert(json.message)
//       } else {

export function gotEnrollments(courses) {
  return {
    type: types.Action.GotEnrollments,
    payload: courses,
  };
}

export function retrieveEnrollments(djangoToken) {
  return (
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/enrollments/`, {
      // fetch("http://localhost:3000/backend/api/enrollments/", {
      headers: {
        Authorization: `Token ${djangoToken}`,
        "Content-Type": "application/json",
      },
    })
      // return fetch("http://localhost:8000/api/enrollments/")
      .then((response, ...rest) => {
        // console.log("response");
        // console.log(response);
        // console.log("\n\nrest");
        // console.log(rest);
        const results = response.json();
        return results;
      })
  );
}

export function fetchEnrollments(djangoToken) {
  return (dispatch) => {
    return djangoToken
      ? retrieveEnrollments(djangoToken)
          .then((courses) => dispatch(gotEnrollments(courses)))
          .catch((...rest) => {
            console.log("catch rest");
            console.log(rest);
          })
      : null;
  };
}
