describe("Application logic tests", () => {
  describe("addCPUDataToState tests", () => {
    it("Doesn't crash on a new CPU", () => {
      const app = new App(undefined);
      app.addCPUDataToState("test_cpu", 22);
    });
  });
});
