// API TEMPLATE
api
  .update()
  .then(({ data }) => {
    dispatch({ type: "TYPE", data });
    console.log("api data:", data);
  })
  .catch((err) => {
    console.log(err);
  });
