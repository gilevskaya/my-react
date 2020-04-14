System.register(["vue"], () => {
  let Vue;

  return {
    setters: [(v) => (Vue = v.default)],
    execute() {
      new Vue({
        el: "#root",
        data: {
          age: "123",
        },
      });
    },
  };
});
