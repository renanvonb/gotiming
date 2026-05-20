# Prompt inicial para o Claude Code

Cole isto como **primeira mensagem** no Claude Code, depois de abri-lo no
diretório raiz do projeto.

---

Estou iniciando um projeto novo chamado **Gotime** (gestão de escalas de
trabalho). Tenho um handoff de design em `design-reference/` (HTML/CSS/JS
exportado do Claude Design) e um briefing técnico completo em `CLAUDE.md`
na raiz.

**Decisão crítica de stack:** o design system oficial deste projeto é o
**Ant Design 6.4.3** (`antd@6.4.3` exato no `package.json`). O handoff em
HTML/CSS apenas *imita* o AntD com classes `.gt-*` — a biblioteca real é
a fonte de verdade. Para qualquer componente que o AntD oferece (Button,
Table, Modal, Drawer, Tabs, Form, DatePicker etc.), use o componente da
lib direto. Doc: <https://ant.design/>.

**Tarefa desta iteração:** implementar a tela `Configurações.html` em
produção, seguindo o briefing.

Por favor:

1. Leia `CLAUDE.md` inteiro antes de qualquer ação. Em especial, a §0
   (regra de ouro sobre AntD), §5 (o que descartar do handoff CSS) e §6
   (mapeamento HTML → AntD).
2. Leia `design-reference/Configurações.html` inteiro.
3. Dê uma olhada em `design-reference/app.css` para identificar quais
   classes **custom** (categoria MANTER da §5 do briefing) precisam ser
   portadas para `app/globals.css`. Não copie o arquivo inteiro.
4. Confira na documentação oficial do AntD 6.4.3 a API exata dos
   componentes que vai usar (props podem ter mudado em relação à versão
   que você conhece de cabeça).
5. Confirme comigo: stack final, estrutura de pastas, ordem de
   implementação. Depois comece pelo passo 1 da §10 do briefing.

Trabalhe em pequenos commits revisáveis. Não avance pra próxima etapa sem
ter a anterior funcionando.
