import { describe, test, expect, jest } from "@jest/globals";
import Routes from "../../src/routes.js";

describe("#Routes test suite", () => {
  const defaultParams = {
    request: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: "",
      body: {},
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
    },
    values: () => Object.values(defaultParams),
  };

  describe("#setSocketInstance", () => {
    test("setSocket should store io instance", () => {
      const routes = new Routes();

      const ioObject = {
        to: (id) => ioObject,
        emit: (event, message) => {},
      };

      routes.setSocketInstace(ioObject);
      expect(routes.io).toStrictEqual(ioObject);
    });
  });

  describe("#handler", () => {
    test("given an inexistent route it should choose default route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "inexistent";

      await routes.handler(...params.values());

      expect(params.response.end).toHaveBeenCalledWith("Hello world");
    });

    test("it should set any request with CORS enable", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "inexistent";

      await routes.handler(...params.values());

      expect(params.response.setHeader).toHaveBeenCalledWith(
        "Access-Controle-Allow-Origin",
        "*"
      );
    });

    test("given metho OPTIONS it should choose option route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "OPTIONS";

      await routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(204);
      expect(params.response.end).toHaveBeenCalled();
    });

    test("given metho POST it should choose post route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "POST";
      jest.spyOn(routes, routes.post.name).mockResolvedValue();

      await routes.handler(...params.values());

      expect(routes.post).toHaveBeenCalled();
    });

    test("given metho GET it should choose get route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "GET";
      jest.spyOn(routes, routes.get.name).mockResolvedValue();

      await routes.handler(...params.values());

      expect(routes.get).toHaveBeenCalled();
    });
  });

  describe("#get", () => {
    test("given method GET it should list all files downloaded", async () => {
      const routes = new Routes();

      const params = {
        ...defaultParams,
      };

      params.request.method = "GET";
      const filesStatusesMock = [
        {
          size: "67.3 kB",
          lastModified: "2021-09-06T21:51:26.384Z",
          owner: "igorbecker",
          file: "file.png",
        },
      ];

      jest
        .spyOn(routes.fileHelper, routes.fileHelper.getFileStatus.name)
        .mockResolvedValue(filesStatusesMock);

      await routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(200);
      expect(params.response.end).toHaveBeenCalledWith(
        JSON.stringify(filesStatusesMock)
      );
    });
  });
});
