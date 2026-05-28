"use client";

import { Tabs } from "antd";
import { useReducer, useEffect, useMemo, useCallback } from "react";
import type { CSSProperties } from "react";
import { useSearchParams } from "react-router-dom";
import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import { UnitsPane } from "@/components/configuracoes/UnitsPane";
import {
  AREAS,
  configReducer,
  makeInitialState,
  parseArea,
} from "@/components/configuracoes/state";
import { unidades, defaultUnidadeId } from "@/lib/mock/unidades";
import { ColaboradoresPanel } from "@/components/configuracoes/panels/ColaboradoresPanel";
import { PdvPanel } from "@/components/configuracoes/panels/PdvPanel";
import { HorariosPanel } from "@/components/configuracoes/panels/HorariosPanel";
import { FeriadosPanel } from "@/components/configuracoes/panels/FeriadosPanel";
import { PrevisoesPanel } from "@/components/configuracoes/panels/PrevisoesPanel";
import { ParametrosPanel } from "@/components/configuracoes/panels/ParametrosPanel";
import { PdvDrawer } from "@/components/configuracoes/overlays/PdvDrawer";
import { ColabDrawer } from "@/components/configuracoes/overlays/ColabDrawer";
import { FeriadoDrawer } from "@/components/configuracoes/overlays/FeriadoDrawer";
import { FeriadoImportDrawer } from "@/components/configuracoes/overlays/FeriadoImportDrawer";
import { ImportPdvModal } from "@/components/configuracoes/overlays/ImportPdvModal";
import { FolgasModal } from "@/components/configuracoes/overlays/FolgasModal";
import { PrevisoesImportModal } from "@/components/configuracoes/overlays/PrevisoesImportModal";

const styles: Record<string, CSSProperties> = {
  content: {
    flex: 1,
    padding:
      "var(--content-pad-top) var(--content-pad-right) var(--content-pad-bottom) var(--content-pad-left)",
    minWidth: 0,
    minHeight: 0,
    position: "relative",
    overflow: "hidden",
  },
  blocks: {
    display: "flex",
    alignItems: "stretch",
    gap: 16,
    height: "100%",
    minHeight: 0,
  },
  paneLeft: {
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    flex: "0 0 261px",
    width: 261,
    borderRadius: 4,
    transition:
      "width var(--ant-motion-duration-mid) var(--ant-motion-ease-out), flex-basis var(--ant-motion-duration-mid) var(--ant-motion-ease-out)",
    willChange: "width",
  },
  paneLeftCollapsed: {
    width: 56,
    flex: "0 0 56px",
  },
  paneRight: {
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    flex: "1 1 auto",
    borderRadius: 4,
  },
  block: {
    background: "var(--ant-color-bg-container)",
    border: "1px solid var(--ant-color-border-secondary)",
    borderRadius: 4,
    padding: 0,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
    flex: 1,
  },
  cfgContent: {
    flex: 1,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    overflow: "auto",
  },
  cfgHead: {
    padding: "16px 16px 4px",
  },
  cfgTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "24px",
    color: "var(--ant-color-text)",
  },
};

export function ConfiguracoesContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialUnidade = useMemo(() => {
    const fromUrl = searchParams.get("unidade");
    if (fromUrl && unidades.some((u) => u.id === fromUrl)) return fromUrl;
    return defaultUnidadeId;
  }, [searchParams]);

  const initialArea = useMemo(
    () => parseArea(searchParams.get("area")) ?? "colaboradores",
    [searchParams]
  );

  const [state, dispatch] = useReducer(
    configReducer,
    makeInitialState(initialUnidade, initialArea)
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("unidade", state.unidadeAtivaId);
    params.set("area", state.areaAtiva);
    const next = params.toString();
    if (next !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [state.unidadeAtivaId, state.areaAtiva, setSearchParams, searchParams]);

  const closeOverlay = useCallback(() => dispatch({ type: "close-overlay" }), []);

  const tabItems = AREAS.map((a) => ({ key: a.key, label: a.label }));
  const unidadeAtiva = unidades.find((u) => u.id === state.unidadeAtivaId);

  return (
    <AppShell>
      <Header
        title="Configurações"
        showEdit={false}
        favorited={false}
        onToggleFavorite={() => {}}
      />
      <div style={styles.content}>
        <div style={styles.blocks}>
          <div
            style={{
              ...styles.paneLeft,
              ...(state.unidadesColapsadas ? styles.paneLeftCollapsed : null),
            }}
          >
            <UnitsPane
              unidades={unidades}
              ativaId={state.unidadeAtivaId}
              onAtivaChange={(id) => dispatch({ type: "set-unidade", id })}
              search={state.unidadeSearch}
              onSearchChange={(value) => dispatch({ type: "set-unidade-search", value })}
              colapsada={state.unidadesColapsadas}
              onToggleColapsada={() => dispatch({ type: "toggle-unidades-colapsadas" })}
            />
          </div>
          <div style={styles.paneRight}>
            <section style={styles.block}>
              <div style={styles.cfgHead}>
                <h2 style={styles.cfgTitle}>{unidadeAtiva?.nome ?? ""}</h2>
              </div>
              <Tabs
                activeKey={state.areaAtiva}
                onChange={(key) =>
                  dispatch({
                    type: "set-area",
                    area: key as (typeof AREAS)[number]["key"],
                  })
                }
                items={tabItems}
                tabBarStyle={{ paddingLeft: 16, paddingRight: 16, marginBottom: 0 }}
              />
              <div style={styles.cfgContent}>
                {state.areaAtiva === "colaboradores" && (
                  <ColaboradoresPanel
                    unidadeId={state.unidadeAtivaId}
                    onOpenColab={(colabId) =>
                      dispatch({ type: "open-overlay", overlay: { kind: "colab-drawer", colabId } })
                    }
                    onImportFolgas={() =>
                      dispatch({ type: "open-overlay", overlay: { kind: "folgas-modal" } })
                    }
                  />
                )}
                {state.areaAtiva === "pdv" && (
                  <PdvPanel
                    unidadeId={state.unidadeAtivaId}
                    onOpenPdv={(pdvId) =>
                      dispatch({ type: "open-overlay", overlay: { kind: "pdv-drawer", pdvId } })
                    }
                    onImport={() => dispatch({ type: "open-overlay", overlay: { kind: "import-pdv-modal" } })}
                  />
                )}
                {state.areaAtiva === "horarios" && <HorariosPanel unidadeId={state.unidadeAtivaId} />}
                {state.areaAtiva === "feriados" && (
                  <FeriadosPanel
                    unidadeId={state.unidadeAtivaId}
                    onOpenFeriado={(feriadoId) =>
                      dispatch({ type: "open-overlay", overlay: { kind: "feriado-drawer", feriadoId } })
                    }
                    onImport={() =>
                      dispatch({ type: "open-overlay", overlay: { kind: "feriado-import-drawer" } })
                    }
                  />
                )}
                {state.areaAtiva === "previsoes" && (
                  <PrevisoesPanel
                    unidadeId={state.unidadeAtivaId}
                    onImport={() =>
                      dispatch({ type: "open-overlay", overlay: { kind: "previsoes-import-modal" } })
                    }
                  />
                )}
                {state.areaAtiva === "parametros" && (
                  <ParametrosPanel unidadeId={state.unidadeAtivaId} />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <PdvDrawer
        open={state.overlay.kind === "pdv-drawer"}
        pdvId={state.overlay.kind === "pdv-drawer" ? state.overlay.pdvId : undefined}
        unidadeId={state.unidadeAtivaId}
        onClose={closeOverlay}
      />
      <ColabDrawer
        open={state.overlay.kind === "colab-drawer"}
        colabId={state.overlay.kind === "colab-drawer" ? state.overlay.colabId : undefined}
        unidadeId={state.unidadeAtivaId}
        onClose={closeOverlay}
      />
      <FeriadoDrawer
        open={state.overlay.kind === "feriado-drawer"}
        feriadoId={state.overlay.kind === "feriado-drawer" ? state.overlay.feriadoId : undefined}
        unidadeId={state.unidadeAtivaId}
        onClose={closeOverlay}
      />
      <FeriadoImportDrawer
        open={state.overlay.kind === "feriado-import-drawer"}
        onClose={closeOverlay}
      />
      <ImportPdvModal
        open={state.overlay.kind === "import-pdv-modal"}
        onClose={closeOverlay}
      />
      <FolgasModal open={state.overlay.kind === "folgas-modal"} onClose={closeOverlay} />
      <PrevisoesImportModal
        open={state.overlay.kind === "previsoes-import-modal"}
        onClose={closeOverlay}
      />
    </AppShell>
  );
}
