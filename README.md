# Gotime

Gestão de escalas de trabalho da **Goapice** — caixa, atendimento, estoque.

> Implementação em produção do handoff de design do Claude Design (`design-reference/`).

## Stack

| Camada | Escolha |
| --- | --- |
| Framework | Next.js 15 (App Router) + Turbopack |
| Linguagem | TypeScript (strict) |
| Design system | [Ant Design 6.4.3](https://ant.design) |
| Ícones | [Lucide](https://lucide.dev) |
| SSR do AntD | `@ant-design/nextjs-registry` |
| Datas | `dayjs` (locale pt-BR) |
| Node | 20+ LTS |

## Telas

| Rota | Tela |
| --- | --- |
| `/` | Redirect para `/configuracoes` |
| `/configuracoes` | Configurações da unidade (Colaboradores, PDV, Horários, Feriados, Previsões, Parâmetros) |
| `/escalas` | Lista de escalas |
| `/escalas/[id]` | Administração de escala (timeline 24h) |

## Local

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>.

## Scripts

| Script | Faz |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Deploy

Configurado para deploy automático na [Vercel](https://vercel.com) — toda push para `main` dispara um build.

## Documentação

- `CLAUDE.md` — contrato técnico e decisões de implementação
- `PROMPT-INICIAL.md` — prompt usado para inicializar o projeto
- `design-reference/` — handoff original em HTML/CSS/JS do Claude Design
