# Gotime — Briefing de Implementação

> Este arquivo é o contrato técnico do projeto. **Leia inteiro antes de codar.**
> Você (Claude Code) deve seguir estas decisões; só desviar com justificativa explícita.

---

## 0. Regra de ouro — Ant Design 6.4.3

**Este projeto usa Ant Design 6.4.3 como design system oficial.**

- Pin exato no `package.json`: `"antd": "6.4.3"`. Não usar `^` nem `~`.
- Documentação: <https://ant.design/> · Repositório: <https://github.com/ant-design/ant-design>
- Para **qualquer componente que o AntD oferece, use o componente da lib**.
  Não recrie. Não copie de outros design systems. Não usar shadcn/ui, MUI,
  Radix UI, Chakra, Headless UI.
- O handoff em `design-reference/` foi montado com CSS que **imita** o AntD.
  A lib real é a fonte de verdade — não o CSS do handoff.
- Se sua memória de API do AntD for de uma versão anterior à 6.4.3, **vá
  conferir a doc oficial** antes de escrever a chamada. Componentes core
  (Button, Table, Drawer, Modal, Tabs, Form) tendem a ser estáveis, mas
  variantes e props mudam entre versões majors.

---

## 1. Contexto

**Gotime** é uma solução de gestão de escalas de trabalho (caixa, atendimento,
estoque) da empresa Goapice. O usuário desenhou as 3 telas principais no
Claude Design (claude.ai/design) e exportou um handoff em HTML/CSS/JS.

O handoff vive em `./design-reference/` (renomeado de `gotime/project/`).
Os 3 protótipos são:

- `Lista de escalas.html` — listagem das escalas geradas (tabela)
- `Configurações.html` — **tela alvo desta iteração**
- `Administração de escala.html` — timeline 24h de uma escala (React via Babel)

**Tarefa atual: implementar `Configurações.html` em produção** sobre AntD
6.4.3. As outras duas telas virão depois — mas o **shell** (sidebar + header
+ side menu) delas é o mesmo, então construa-o de forma reutilizável.

**O que NÃO fazer nesta iteração:**

- Não implementar Lista de escalas nem Administração de escala (só o shell
  compartilhado que serve as três).
- Não criar autenticação, multi-tenancy nem backend. Dados são mock.
- Não rodar nenhum HTML do handoff no browser nem tirar screenshots: tudo
  que você precisa está no HTML/CSS direto.
- Não recriar componentes que o AntD já oferece.
- Não importar `app.css` inteiro do handoff (veja §5).

---

## 2. Stack

| Camada            | Escolha                                       | Por quê                                              |
| ----------------- | --------------------------------------------- | ---------------------------------------------------- |
| Framework         | Next.js 15 (App Router)                       | Rotas nativas; pode escalar para SSR.                |
| Linguagem         | TypeScript (strict)                           | Tela tem muito estado — types valem muito.           |
| Design system     | **`antd@6.4.3`**                              | Fonte de verdade dos componentes.                    |
| Ícones            | `@ant-design/icons`                           | Consistência com o AntD.                             |
| SSR do AntD       | `@ant-design/nextjs-registry`                 | Evita FOUC do CSS-in-JS no App Router.               |
| Estilo extra      | Tailwind 4 (utilities de layout) — opcional   | Só pra `gap`, `flex` específicos quando útil.        |
| Estado            | `useState` / `useReducer` locais              | Sem Zustand/Redux por enquanto.                      |
| Datas             | `dayjs` (vem com AntD)                        | Mesmo do AntD — não instalar `date-fns`.             |
| Lint/format       | ESLint + Prettier                             | Defaults do `create-next-app`.                       |
| Node              | 20+ LTS                                       | Requisito Next 15.                                   |

**Versionamento exato a usar:**

```json
{
  "dependencies": {
    "next": "15.x",
    "react": "19.x",
    "react-dom": "19.x",
    "antd": "6.4.3",
    "@ant-design/icons": "latest-compatível-com-antd-6",
    "@ant-design/nextjs-registry": "latest",
    "dayjs": "1.x"
  }
}
```

Confira no `npm view antd@6.4.3 peerDependencies` qual a versão exata do
React requerida pelo AntD 6.4.3 antes de criar o projeto. Se o AntD 6.4.3
ainda exigir React 18, use Next 14 + React 18.

**Não instalar:** shadcn/ui, MUI, Radix UI standalone, Chakra, Headless UI,
react-hook-form (use o `<Form>` do AntD), zustand, redux, date-fns.

---

## 3. Configuração inicial obrigatória

### 3.1 ConfigProvider no root

Em `app/layout.tsx` (Server Component) você precisa de:

1. O **registry do AntD** para Next App Router, senão o CSS chega depois do
   HTML e dá flash.
2. Um `<ConfigProvider>` com locale pt-BR e theme do projeto.

Esqueleto:

```tsx
// app/layout.tsx
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import { theme as gotimeTheme } from "@/lib/theme";
import "./globals.css";

dayjs.locale("pt-br");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AntdRegistry>
          <ConfigProvider locale={ptBR} theme={gotimeTheme}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
```

A `AntdRegistry` é obrigatória para SSR funcionar bem com o cssinjs do AntD
no App Router. Sem ela: flash de conteúdo sem estilo no primeiro paint.

### 3.2 Theme — derivado do handoff

Em `lib/theme.ts`, espelhe os tokens visíveis no `design-reference/tokens.css`
para o objeto `theme.token` do AntD. O cor primária `#1677ff` é o blue-6
default do AntD — não precisa sobrescrever. Mas mantenha o objeto explícito
para fixar a marca caso o default mude entre versões.

```ts
// lib/theme.ts
import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  cssVar: true,        // expõe tokens como CSS vars; necessário para custom CSS
  hashed: false,       // remove hash do nome das classes em prod (opcional)
  token: {
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError:   "#ff4d4f",
    colorInfo:    "#1677ff",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderRadius: 6,
    fontSize: 14,
  },
  components: {
    // Sobrescritas finas só quando algo do handoff divergir do default
    // Layout: { headerBg: "#fff" },
  },
};
```

Confira na doc do AntD 6.4.3 se `cssVar` e `hashed` continuam tendo esses
nomes. Em v5 eles existem; em v6 podem ter sido renomeados.

### 3.3 Dark mode

AntD tem `theme.darkAlgorithm`. Para alternar light/dark, troque o algorithm:

```ts
import { theme as antdTheme } from "antd";

const darkTheme = {
  ...gotimeTheme,
  algorithm: antdTheme.darkAlgorithm,
};
```

Use um provider local para o toggle. Não precisa do `[data-theme="dark"]`
do handoff — o AntD aplica via cssinjs.

### 3.4 Locale

Importe `antd/locale/pt_BR` no ConfigProvider e `dayjs/locale/pt-br` na
inicialização. Sem isso, DatePicker, Calendar e mensagens do AntD ficam em
inglês.

---

## 4. Estrutura de pastas

```
gotime/
├── CLAUDE.md
├── PROMPT-INICIAL.md
├── README.md
├── package.json
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts                  ← se optar por Tailwind
├── postcss.config.mjs
├── design-reference/                   ← handoff original (read-only)
│   ├── Configurações.html
│   ├── Lista de escalas.html
│   ├── Administração de escala.html
│   ├── app.css                         ← NÃO importar inteiro
│   ├── tokens.css                      ← referência para lib/theme.ts
│   └── ...
├── app/
│   ├── layout.tsx                      ← ConfigProvider + AntdRegistry + shell
│   ├── globals.css                     ← reset + classes customizadas (§5)
│   ├── page.tsx                        ← redirect para /escalas
│   ├── escalas/
│   │   └── page.tsx                    ← placeholder (não é foco)
│   └── configuracoes/
│       └── page.tsx                    ← "use client", estado da tela
├── components/
│   ├── shell/
│   │   ├── AppShell.tsx                ← layout fixo (sidebar + main)
│   │   ├── Sidebar.tsx                 ← custom (não é AntD)
│   │   ├── SideMenu.tsx                ← Drawer placement="left" do AntD
│   │   ├── Header.tsx                  ← custom layout, usando Button etc.
│   │   └── GlobalTooltips.tsx          ← se precisar (AntD <Tooltip> resolve a maioria)
│   └── configuracoes/
│       ├── UnitsPane.tsx               ← coluna esquerda; usa Tabs tabPosition="left" ou custom
│       ├── AreaTabs.tsx                ← <Tabs> do AntD
│       ├── panels/
│       │   ├── ColaboradoresPanel.tsx
│       │   ├── PdvPanel.tsx
│       │   ├── HorariosPanel.tsx
│       │   ├── FeriadosPanel.tsx
│       │   ├── PrevisoesPanel.tsx
│       │   └── ParametrosPanel.tsx
│       └── overlays/
│           ├── PdvDrawer.tsx           ← <Drawer>
│           ├── ImportPdvModal.tsx      ← <Modal>
│           ├── ColabDrawer.tsx
│           ├── FolgasModal.tsx
│           ├── PrevisoesImportModal.tsx
│           ├── FeriadoDrawer.tsx
│           ├── FeriadoImportDrawer.tsx
│           └── ConfirmModal.tsx        ← Modal.useModal() hook
├── lib/
│   ├── theme.ts                        ← ThemeConfig (§3.2)
│   ├── types.ts                        ← types do domínio (§6)
│   ├── mock/
│   │   ├── unidades.ts
│   │   ├── colaboradores.ts
│   │   ├── pdvs.ts
│   │   ├── horarios.ts
│   │   ├── feriados.ts
│   │   ├── previsoes.ts
│   │   └── parametros.ts
│   └── utils/
│       ├── format.ts                   ← currency, date, time
│       └── cn.ts                       ← se usar Tailwind
└── public/
    └── icons/
```

**Não há `components/ui/` neste projeto.** Use componentes do `antd`
diretamente nos arquivos onde forem necessários:

```tsx
import { Button, Table, Drawer, Modal, Tabs, Switch } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
```

Wrappers só quando houver lógica de domínio real para encapsular (ex.:
`<ColaboradorAvatar>` que recebe um `Colaborador` e renderiza o avatar
colorido), nunca para "envelopar" um componente AntD.

---

## 5. Como tratar o CSS do handoff

O `app.css` do handoff (~4.800 linhas) é uma **reimplementação** do AntD v5
em CSS puro. Boa parte dele vira lixo agora que estamos usando o AntD real.

### Decisão por categoria

| Bloco no `app.css`                          | O que fazer                                         |
| ------------------------------------------- | --------------------------------------------------- |
| `.gt-btn*`                                  | Descartar. Usar `<Button>` do AntD.                 |
| `.gt-table*`                                | Descartar. Usar `<Table>` do AntD.                  |
| `.gt-modal*`, `.gt-drawer*`                 | Descartar. Usar `<Modal>` / `<Drawer>` do AntD.     |
| `.gt-tabs*`, `.gt-vtabs*`                   | Descartar. Usar `<Tabs>` do AntD.                   |
| `.gt-checkbox*`, `.gt-radio*`, `.gt-switch` | Descartar. Usar componentes AntD.                   |
| `.gt-input*`, `.gt-search`, `.gt-input-number` | Descartar. Usar `<Input>`, `<Input.Search>`, `<InputNumber>`. |
| `.gt-datepicker*`, `.gt-daterange*`         | Descartar. Usar `<DatePicker>` / `<DatePicker.RangePicker>`. |
| `.gt-timepicker*`, `.gt-timerange*`         | Descartar. Usar `<TimePicker>` / `<TimePicker.RangePicker>`. |
| `.gt-calendar*`                             | Descartar. Usar `<Calendar>` do AntD.               |
| `.gt-tag*`                                  | Descartar. Usar `<Tag>` do AntD com `color="…"`.    |
| `.gt-tooltip*`                              | Descartar. Usar `<Tooltip>` do AntD.                |
| `.gt-popconfirm*`                           | Descartar. Usar `<Popconfirm>` do AntD.             |
| `.gt-dropzone*`                             | Descartar. Usar `<Upload.Dragger>` do AntD.         |
| `.gt-empty-state`                           | Descartar. Usar `<Empty>` do AntD.                  |
| `.gt-spin`, `.gt-skel`                      | Descartar. Usar `<Spin>` e `<Skeleton>` do AntD.    |
| `.gt-alert`                                 | Descartar. Usar `<Alert>` do AntD.                  |
| `.gt-message`                               | Descartar. Usar `message.*` (API funcional do AntD) ou hook `useMessage`. |
| `.gt-seg`                                   | Descartar. Usar `<Segmented>` do AntD.              |
| `.gt-form*`                                 | Descartar. Usar `<Form>` do AntD com `<Form.Item>`. |
| **`.gt-sidebar*`**                          | **MANTER.** É a sidebar preta de 56px — custom, não tem equivalente AntD. |
| **`.gt-sidemenu*`**                         | Re-implementar com `<Drawer placement="left">` do AntD + estilos pontuais. |
| **`.gt-header*`**                           | MANTER os layouts; trocar elementos por componentes AntD onde aplicável. |
| **`.gt-app`, `.gt-main`, `.gt-content`**    | MANTER. São layouts da shell.                       |
| **`.gt-blocks*`**, `.gt-pane-left`, `.gt-pane-right`, `.gt-splitter*` | MANTER. Sistema de layout A/B/C/D customizado. |
| **`.cfg__*`** (todas as ~187 classes)       | MANTER. São específicas da tela Configurações.      |

### Em prática

1. Crie `app/globals.css` com **apenas** as classes que ficaram (categoria
   MANTER da tabela acima). Pode ser um arquivo curto, ~600 linhas, contendo:
   - Reset mínimo (`* { box-sizing: border-box }`, `html, body { margin: 0 }`)
   - `.gt-app`, `.gt-main`, `.gt-content`, `.gt-sidebar*`, `.gt-header*`,
     `.gt-blocks*`, `.gt-pane-*`, `.gt-splitter*`, `.gt-rail*`
   - Todas as `.cfg__*` que existem no `Configurações.html`

2. Substitua referências a CSS vars `--antd-*` por chamadas `var(...)` do
   AntD em modo cssVar (ativado em `lib/theme.ts`). Em v5/v6 com `cssVar: true`,
   o AntD expõe tokens como vars CSS no escopo do componente. Confira na doc
   o naming exato (em v5 era `--ant-color-primary`, sem o `d` extra).

3. **Não** importe `tokens.css` do handoff. Os tokens agora vivem em
   `lib/theme.ts`. As CSS vars são publicadas pelo AntD via `cssVar: true`.

4. O CSS custom (categoria MANTER) deve usar essas vars do AntD em vez de
   hex hardcoded. Exemplo:
   ```css
   .cfg__params-statcard__value--blue { color: var(--ant-color-primary); }
   ```

5. Inter via `next/font/google` no `app/layout.tsx`. Atribua ao token
   `fontFamily` do theme. Remova `@import url('https://fonts.googleapis.com/...')`
   se vier no globals.

---

## 6. Mapeamento HTML do handoff → AntD

Quando você ler o `Configurações.html` e ver uma classe `.gt-*` ou um
padrão de markup, troque pelo componente AntD correspondente. Quadro de
referência:

| Padrão no handoff                                       | Componente AntD                                  |
| ------------------------------------------------------- | ------------------------------------------------ |
| `<button class="gt-btn gt-btn--primary">`               | `<Button type="primary">`                        |
| `<button class="gt-btn gt-btn--danger">`                | `<Button danger>` (ou `<Button danger type="primary">`) |
| `<button class="gt-btn gt-btn--text">`                  | `<Button type="text">`                           |
| `<button class="gt-btn gt-btn--dashed">`                | `<Button type="dashed">`                         |
| `<button class="gt-btn gt-btn--icon">`                  | `<Button icon={<X/>} />` (sem children)          |
| `<table class="gt-table">`                              | `<Table columns={...} dataSource={...} />`       |
| `<span class="gt-tag gt-tag--success">`                 | `<Tag color="success">` (ou `green`)             |
| `<span class="gt-tag gt-tag--processing">`              | `<Tag color="processing">` (ou `blue`)           |
| `<span class="gt-tag gt-tag--warning">`                 | `<Tag color="warning">` (ou `gold`)              |
| `<span class="gt-tag gt-tag--error">`                   | `<Tag color="error">` (ou `red`)                 |
| `<span class="gt-tag gt-tag--magenta">`                 | `<Tag color="magenta">`                          |
| `.gt-tabs` (horizontal)                                 | `<Tabs items={...} activeKey={...} />`           |
| `.gt-vtabs` (vertical, Unidades)                        | `<Tabs tabPosition="left" items={...} />`        |
| `.gt-checkbox`                                          | `<Checkbox>`                                     |
| `.gt-radio-group`                                       | `<Radio.Group>` com `<Radio>` filhos             |
| `.gt-radio-button`                                      | `<Radio.Group optionType="button">`              |
| `.gt-switch`                                            | `<Switch>`                                       |
| `.gt-seg`                                               | `<Segmented options={...} />`                    |
| `.gt-input`                                             | `<Input>`                                        |
| `.gt-search` (input com lupa)                           | `<Input prefix={<SearchOutlined/>} />` ou `<Input.Search>` |
| `.gt-input-number` (com handlers)                       | `<InputNumber>`                                  |
| `.gt-datepicker`                                        | `<DatePicker locale=...>` (config global no provider basta) |
| `.gt-daterange`                                         | `<DatePicker.RangePicker>`                       |
| `.gt-timepicker`                                        | `<TimePicker format="HH:mm">`                    |
| `.gt-timerange`                                         | `<TimePicker.RangePicker format="HH:mm">`        |
| `.gt-calendar` (calendário mensal editável)             | `<Calendar cellRender={...} />` com edição custom em cellRender |
| `.cfg__month-picker`                                    | `<DatePicker picker="month">`                    |
| `.gt-tooltip` (data-tooltip attr)                       | `<Tooltip title="...">{child}</Tooltip>`         |
| `.gt-popconfirm`                                        | `<Popconfirm title="..." onConfirm={...}>`       |
| `.gt-dropzone`                                          | `<Upload.Dragger>`                               |
| `.gt-empty-state`                                       | `<Empty />`                                      |
| `.gt-modal-mask` + `.gt-modal`                          | `<Modal open={...} onCancel={...}>`              |
| `.gt-modal--confirm`                                    | `Modal.confirm({...})` (API imperativa) **ou** `<Modal>` com hook `Modal.useModal()` |
| `.gt-drawer-mask` + `.gt-drawer`                        | `<Drawer placement="right" open={...} />`        |
| `.gt-alert--info`                                       | `<Alert type="info" message="..." />`            |
| `.gt-message__item--success`                            | `message.success("...")` (de `App.useApp()`)     |
| `.gt-form__row` + `.gt-form__label`                     | `<Form layout="vertical">` + `<Form.Item label="...">` |
| `.gt-form__required` (asterisco)                        | `<Form.Item required>` (AntD coloca o asterisco) |
| `.gt-spin`                                              | `<Spin />` ou `loading` prop nos componentes que aceitam |
| `.gt-skel` / `.is-loading`                              | `<Skeleton>` ou `loading` no `<Table>`           |

**Importante sobre `message` e `Modal.confirm`:** AntD 6 reforça o uso da
API contextual via hook (`App.useApp()` retornando `{ message, notification, modal }`)
porque os métodos estáticos não pegam o ConfigProvider corretamente.

```tsx
import { App } from "antd";

export default function Layout({ children }) {
  return <App>{children}</App>;
}

// no componente:
const { message, modal } = App.useApp();
message.success("Salvo");
```

Confira a doc da v6.4.3 — se a recomendação mudou, siga ela.

---

## 7. Componentes custom (não-AntD)

São poucos. Documentação de cada um:

### 7.1 `Sidebar` (`components/shell/Sidebar.tsx`)

A barra preta vertical de 56px do lado esquerdo. **Não tem equivalente AntD.**
Mantenha o CSS `.gt-sidebar*` no globals e implemente em React.

API mínima:

```ts
interface SidebarProps {
  activeMenu: SidebarMenuKey | null;
  onMenuChange: (key: SidebarMenuKey | null) => void;
}

type SidebarMenuKey =
  | "modulos" | "favoritos" | "historico" | "notificacoes"
  | "solucoes" | "configuracoes" | "usuario";
```

Botões com `<Tooltip placement="right">` do AntD nos hovers.

### 7.2 `SideMenu` (`components/shell/SideMenu.tsx`)

O drawer que abre do lado esquerdo quando você clica num botão da Sidebar.
Use **`<Drawer placement="left" width={…}>`** do AntD com `mask={false}`
(no handoff a máscara está separada do drawer, mas pode usar a do AntD com
`maskClosable`). Body do drawer renderiza listas de links de acordo com
qual menu está aberto.

O `Configurações.html:1657-1670` mostra a estrutura dos 3 links principais
de módulos:
- Lista de escalas
- Administração de escala
- Configurações

### 7.3 `Header` (`components/shell/Header.tsx`)

Manter o CSS `.gt-header*` (altura 64px, sticky, padding 24px). Internamente
usa `<Button>`, `<Input.Search>`, `<DatePicker.RangePicker>` do AntD.

API por slots:

```ts
interface HeaderProps {
  title: string;
  showBack?: boolean;
  favorited?: boolean;
  onToggleFavorite?: () => void;
  actions?: React.ReactNode;  // botões do canto direito
  context?: React.ReactNode;  // textos contextuais no centro/direita
}
```

### 7.4 `AppShell` (`components/shell/AppShell.tsx`)

Composição: `Sidebar` + `SideMenu` + área principal com `Header` no topo e
`{children}` abaixo. Vive em `app/layout.tsx`.

---

## 8. Modelo de dados

Crie em `lib/types.ts`:

```ts
export type ID = string;

export type Unidade = {
  id: ID;
  nome: string;        // "Acre", "Alagoas", "Goapice", "Goapice · Unidade Sul"
  abreviacao?: string; // "AC", "AL"
  hasWarning?: boolean; // ícone de aviso amarelo na tab
};

export type Colaborador = {
  id: ID;
  unidadeId: ID;
  nome: string;
  cargo: string;
  matricula: string;
  avatarColor: string; // hex; geração estável por hash do nome
  ativoParaEscala: boolean;
};

export type PdvTipo = "Normal" | "Rápido" | "Preferencial";

export type Pdv = {
  id: ID;
  unidadeId: ID;
  nome: string;          // "PDV 1"
  tipo: PdvTipo;
  ativoParaEscala: boolean;
  preferencial: boolean; // só aplicável quando tipo = "Preferencial"
};

export type DiaSemana = "dom" | "seg" | "ter" | "qua" | "qui" | "sex" | "sab";

export type HorarioRange = { inicio: string; fim: string }; // "HH:mm"

export type HorarioDia = {
  dia: DiaSemana;
  fechado: boolean;
  ranges: HorarioRange[];
};

export type Feriado = {
  id: ID;
  unidadeId: ID;
  nome: string;
  data: string;          // ISO date "2026-12-25"
  tipo: "nacional" | "estadual" | "municipal" | "personalizado";
  abertura?: HorarioRange[]; // horário especial; vazio = fechado
};

export type PrevisaoDia = {
  data: string;          // ISO date
  valorPrevistoCentavos: number;
};

export type Parametros = {
  unidadeId: ID;
  jornada: {
    modelo: "6h" | "8h" | "44h-semanal" | "custom";
    customHoras?: number;
    minutosAntes: number;
    minutosDepois: number;
    acordoAtual?: { id: ID; nome: string; dataUpload: string; uploadPor: string };
    acordosHistorico: { id: ID; nome: string; dataUpload: string; uploadPor: string }[];
  };
  almoco: {
    duracaoTotalMin: number;
    duracaoMinimaMin: number;
    janelaInicioMin: string; // "11:30"
    janelaInicioMax: string; // "14:00"
  };
  folgas: {
    diasFechados: DiaSemana[];
    folgaDomingoFrequencia: "1-em-4" | "1-em-5" | "1-em-6" | "1-em-7" | "1-em-8";
  };
  tolerancia: {
    pdvMinimo: number;
    nivelServicoPct: number;
    absenteismoPct: number;
  };
};

export type AreaConfig =
  | "colaboradores" | "pdv" | "horarios"
  | "feriados" | "previsoes" | "parametros";
```

Mocks em `lib/mock/*.ts`, usando os nomes que aparecem no handoff
(Marco Santana, Bruno Colato, etc.).

---

## 9. Tela Configurações — especificação

### 9.1 Layout

Two-column layout (no handoff é `.gt-blocks--B.is-cfg`):

```
┌──────┬──────────────┬──────────────────────────────────────────────┐
│ side │ Unidades     │ Header                                       │
│ 56px │ • Acre*      ├──────────────────────────────────────────────┤
│      │ • Alagoas    │ Tabs (Colab|PDV|Horários|Feriad|Prev|Param)  │
│      │ • …          ├──────────────────────────────────────────────┤
│      │ (colapsável  │ Painel da área ativa                         │
│      │  para 56px)  │                                              │
└──────┴──────────────┴──────────────────────────────────────────────┘
```

- Coluna esquerda: pode ser implementada como `<Tabs tabPosition="left">`
  do AntD **ou** como custom (a coluna do handoff tem uma busca interna +
  estados visuais que o AntD `<Tabs>` não cobre out-of-the-box, como o
  ícone de aviso por tab e o modo "rail" colapsado).
  - **Decisão recomendada:** custom. Implemente uma lista de `<button>`s
    com classe `.gt-vtab` (mantenha o CSS no globals) por simplicidade e
    fidelidade ao design. Você ainda usa `<Input prefix={<SearchOutlined/>}>`
    do AntD para a busca.
- Coluna direita: `<Tabs>` do AntD para as 6 áreas.

### 9.2 Estado

`useReducer` em `app/configuracoes/page.tsx` ("use client"). Discriminated
union para overlays:

```ts
type ConfigState = {
  unidadeAtivaId: ID;
  unidadeSearch: string;
  unidadesColapsadas: boolean;
  areaAtiva: AreaConfig;
  overlay:
    | { kind: "none" }
    | { kind: "pdv-drawer"; pdvId?: ID }
    | { kind: "import-pdv-modal" }
    | { kind: "colab-drawer"; colabId?: ID }
    | { kind: "folgas-modal" }
    | { kind: "previsoes-import-modal" }
    | { kind: "feriado-drawer"; feriadoId?: ID }
    | { kind: "feriado-import-drawer" }
    | { kind: "confirm"; title: string; message: string; onConfirm: () => void };
};
```

### 9.3 URL state

Sincronize com query string:

```
/configuracoes?unidade=acre&area=colaboradores
```

`useSearchParams` + `router.replace`. Não sincronize overlays com URL.

### 9.4 Os 6 painéis

#### Colaboradores (`<ColaboradoresPanel>`)
- Toolbar: `<Input.Search>` à esquerda, `<Button type="primary" icon={<PlusOutlined/>}>` "Novo" à direita
- `<Table>` AntD:
  - Coluna avatar+nome: cellRender custom com avatar circular colorido
  - Cargo, matrícula
  - Ativo para escala: `<Switch>`
  - Ações: `<Button type="link">` "Gerenciar"
- Rodapé com totalizadores (custom div, ver `.cfg__pdv-totals`)
- Linhas inativas: `rowClassName="is-disabled"` (mantenha a classe no globals)

#### PDV (`<PdvPanel>`)
- Toolbar: busca + "Importar PDVs" + "Novo PDV"
- `<Table>`:
  - Nome
  - Tipo: `<Tag color="blue|gold|magenta">` (Normal/Rápido/Preferencial)
  - Ativo: `<Switch>`
  - Preferencial: `<Switch>` (disabled quando tipo !== "Preferencial")
- Rodapé: totalizadores com cores correspondentes às tags

#### Horários (`<HorariosPanel>`)
- Header: título + Select de fuso (`<Select>` com `America/Sao_Paulo` default)
- 7 linhas de dia (dom→sáb), cada uma com:
  - Nome do dia
  - `<Switch>` fechado/aberto (quando fechado: estado visual `.is-off`)
  - Lista de ranges: cada range é um par de `<TimePicker format="HH:mm">`
    com botão para remover (`<Button type="text" icon={<DeleteOutlined/>}/>`)
  - Botão para adicionar range (`<Button type="dashed" icon={<PlusOutlined/>}>`)
- Modos: linhas (default) ou colunas — `<Segmented>` para alternar

#### Feriados (`<FeriadosPanel>`)
- Toolbar: busca + "Importar" (drawer) + "Novo" (drawer)
- `<Table>`:
  - Nome
  - Data
  - Tipo: `<Tag>` colorida
  - Funcionamento: texto ("Fechado" ou lista de ranges)
  - Ações: editar (abre drawer) / excluir (Popconfirm)

#### Previsões de venda (`<PrevisoesPanel>`)
- Toolbar:
  - Esquerda: `<Segmented options={["Calendário", "Tabela"]}>`
  - Centro: navegador de mês com `<DatePicker picker="month">`
  - Direita: "Gerar com IA" (`<Button icon={<ThunderboltOutlined/>}>`), "Importar" (modal), "Limpar" (`<Popconfirm>` antes)
- Calendário: `<Calendar>` AntD com `cellRender` retornando o valor em R$.
  Para edição inline, ao clicar numa célula renderize um `<InputNumber>` em
  vez do texto. Enter confirma, Esc cancela, blur confirma.
- Tabela alternativa: `<Table>` com 3 colunas (Dia, Dia da semana, Valor previsto)
- Rodapé: totais (custom div)

#### Parâmetros (`<ParametrosPanel>`)
- 4 seções em colunas, cada uma colapsável horizontalmente (vira rail
  vertical com `writing-mode`):
  1. **Jornada de trabalho**: `<Radio.Group>` modelo, `<InputNumber>` antes/depois, `<Upload.Dragger>` acordo coletivo + histórico
  2. **Almoço**: `<TimePicker>` duração total/mínima, `<TimePicker>` janela inicio min/max
  3. **Folgas**: `<Checkbox>` dias fechados, `<Radio.Group>` frequência aos domingos
  4. **Tolerância**: cards de stats (custom div, ver `.cfg__params-statcard`), `<InputNumber>` PDV Mínimo / Nível de serviço (%) / Absenteísmo (%)

### 9.5 Overlays

Cada drawer/modal é um componente em `components/configuracoes/overlays/`.
Props mínimas: `open: boolean`, `onClose: () => void`, mais a entidade
quando aplicável.

Use:
- `<Drawer placement="right">` para os 4 drawers (PDV, Colab, Feriado, FeriadoImport)
- `<Modal>` para os 4 modais
- `Modal.useModal()` para o ConfirmModal (API contextual)
- `<Form layout="vertical">` dentro de cada um, com `<Form.Item label="...">`
- Validação via `rules` do Form

Posições/linhas exatas no handoff:
- PdvDrawer: `Configurações.html:1987-2067`
- ImportPdvModal: `2299-2326`
- ColabDrawer: `2534-2578`
- FolgasModal: `2682-2709`
- PrevisoesImportModal: `3142-3169`
- FeriadoDrawer: `3258-3308`
- ConfirmModal: `3485-3500`
- FeriadoImportDrawer: `5680-5713`

---

## 10. Ordem de implementação

Faça nessa ordem. Não pule.

1. **Setup**: `create-next-app` com TS, App Router. Instalar `antd@6.4.3`,
   `@ant-design/icons`, `@ant-design/nextjs-registry`, `dayjs`. Configurar
   `app/layout.tsx` com `<AntdRegistry>` + `<ConfigProvider>` + `<App>` + locale pt-BR.
2. **Theme**: `lib/theme.ts` com `cssVar: true`, tokens da brand.
3. **Globals**: `app/globals.css` com **apenas** as classes MANTER do §5
   (sidebar, header, app, blocks, panes, splitter, cfg__*). Substituir
   hardcoded colors por `var(--ant-color-*)`.
4. **Tipos e mocks**: `lib/types.ts` + todos os `lib/mock/*.ts`.
5. **Shell**: `AppShell`, `Sidebar`, `SideMenu`, `Header`. Apenas visual,
   sem lógica de troca de telas.
6. **Página Configurações — esqueleto**: layout B com Unidades à esquerda
   e AreaTabs + painel ativo à direita. Estado vivendo no componente.
   Renderize os 6 painéis com placeholders.
7. **Painéis um a um** (com dados mock):
   - Colaboradores → PDV → Horários → Feriados → Previsões → Parâmetros
   - Cada painel completo (com Switch, edit row, etc.) **sem drawers ainda**.
8. **Overlays**: do mais simples (ConfirmModal, FolgasModal) ao mais
   complexo (FeriadoImportDrawer, PrevisoesImportModal).
9. **URL state**: sincronizar `unidade` e `area` com query params.
10. **Polish**:
    - Empty states com `<Empty>`
    - Loading skeletons (`loading` prop no `<Table>`)
    - Confirmações com `<Popconfirm>` em ações destrutivas
    - Toast com `message.success` após save
11. **Dark mode**: toggle via `theme.darkAlgorithm`. Teste todas as áreas.
12. **A11y check**: navegar tudo pelo teclado. Lighthouse ≥95.

---

## 11. Critérios de pronto

- [ ] `npm i` e `npm run dev` rodam sem erro
- [ ] `npm run build` sem warnings
- [ ] `tsc --noEmit` sem erros (strict mode)
- [ ] `npm run lint` passa
- [ ] `/configuracoes` renderiza com unidade default e área "Colaboradores"
- [ ] Trocar de unidade muda dados de todos os painéis
- [ ] Trocar de área mantém a unidade ativa
- [ ] URL reflete o estado e reload restaura
- [ ] 8 drawers/modais funcionam (abrir, fechar por ESC e click fora, focus trap)
- [ ] Todos os campos são acessíveis por teclado
- [ ] Previsões: edição inline na célula do calendário funciona (Enter/Esc/blur)
- [ ] Feriados: criar/editar/excluir (com Popconfirm) funciona
- [ ] Dark mode renderiza sem buracos
- [ ] Inter carregando via next/font (sem flash)
- [ ] Sem `any` em produção
- [ ] AntD components em todas as oportunidades possíveis (auditar grep dos imports)
- [ ] `package.json` tem `"antd": "6.4.3"` (sem ^ ou ~)

---

## 12. O que NÃO fazer

- Recriar componentes que o AntD já oferece (Button, Table, Tabs, Modal,
  Drawer, Form, Input, Select, DatePicker, Tag, Tooltip, Popconfirm, etc.)
- Instalar shadcn/ui, MUI, Radix UI, Chakra, Headless UI
- Importar `app.css` ou `tokens.css` do handoff diretamente
- Usar `dangerouslySetInnerHTML` para conteúdo do handoff — reescreva em JSX
- Manter os `<script>` inline do handoff — reescreva a lógica em React
- Implementar Lista de escalas ou Administração de escala nesta iteração
- Usar Server Components onde precisa de interatividade — marque `"use client"`
- Carregar Inter via `@import` CSS (causa flash) — use `next/font/google`
- Usar `Modal.confirm` / `message.success` estáticos sem o ConfigProvider
  context — use o hook `App.useApp()` ou `Modal.useModal()`
- Versão `^6.4.3` ou `~6.4.3` no package.json — pin exato

---

## 13. Convenções de código

- Filenames de componentes: PascalCase (`Sidebar.tsx`)
- Filenames de não-componentes: kebab-case (`format-currency.ts`)
- Imports absolutos: `@/components/...`, `@/lib/...` (paths no tsconfig)
- Props interfaces nomeadas: `SidebarProps`, `HeaderProps`
- Componentes: sempre `export const Sidebar = ...` (named export), nunca default
- Hooks custom em `hooks/`. Prefixo `use`.

---

## 14. Como interpretar o HTML do handoff

O `Configurações.html` tem muito **estado inicial hard-coded** (a unidade
"Acre" está ativa, a área "Colaboradores" está visível, outras estão
`hidden`). Isso é mock visual. Na sua implementação:

- Estado inicial vem do reducer, não do HTML
- `hidden=""` no HTML → no React, é condicional `state.areaAtiva === "x"`
- Os `<script>` inline são código de prototipagem. **Reescreva a lógica em
  React** — não tente portar 1:1. Use os scripts apenas para entender o
  comportamento esperado.

Quando encontrar interatividade só visível no script (ex.: filtros, ordenação
de tabela, calendário editável), use o script como referência de "o que deve
acontecer", não "como deve ser feito".

---

## 15. Quando perguntar ao usuário

Pergunte antes de implementar quando:

- A doc do AntD 6.4.3 contradisse algo deste briefing
- Quiser instalar uma dependência fora da lista de §2
- Tiver dúvida sobre **comportamento** (não sobre estilo — estilo segue o handoff)
- O CSS do handoff prescrever algo que conflita com o AntD default e você
  precisa decidir qual vence (default: AntD vence; reporte o conflito)

Caso contrário, siga este briefing. Boa sorte.
