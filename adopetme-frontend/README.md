# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Observação sobre backend (mocked)

Durante o desenvolvimento neste repositório, as integrações com o backend foram substituídas por mocks locais no frontend.

- As implementações de mock estão em `src/mocks/api.ts` e `src/mocks/data.ts`.
- O proxy do `nginx` que encaminhava `/api/` para um serviço backend foi comentado em `nginx/nginx.conf`.

Para reativar a comunicação com um backend real, restaure o bloco `location /api/ { ... }` em `nginx/nginx.conf` e ajuste o serviço `backend` no `docker-compose` conforme necessário.
