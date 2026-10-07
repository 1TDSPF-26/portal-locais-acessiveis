import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useDocumentTitle } from "./useDocumentTitle";

describe("useDocumentTitle Hook", () => {
  const APP_NAME = "Portal de Locais e Serviços Acessíveis";

  it("deve atualizar o document.title com o prefixo passado", () => {
    renderHook(() => useDocumentTitle("Cadastro"));
    expect(document.title).toBe(`Cadastro | ${APP_NAME}`);
  });

  it("deve manter apenas o nome do portal se nenhum título for passado", () => {
    renderHook(() => useDocumentTitle(""));
    expect(document.title).toBe(APP_NAME);
  });
});
