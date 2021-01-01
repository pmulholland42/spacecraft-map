import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useDraggable } from "../../hooks/useDraggable";
import { RootState } from "../../redux/store";
import { setShowDebugInfo } from "../../redux/actionCreators";
import { Coordinate } from "../../interfaces";

interface DebugPanelProps {
  initialPosition: Coordinate;
}

const mapStateToProps = (state: RootState) => ({
  showDebugInfo: state.options.showDebugInfo,
  zoom: state.map.zoom,
});

const mapDispatchToProps = {
  setShowDebugInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = DebugPanelProps & PropsFromRedux;

export const DebugPanel = connector(({ initialPosition, showDebugInfo, setShowDebugInfo, zoom }: Props) => {
  const [panelRef] = useDraggable(initialPosition);

  return (
    <div className="panel" ref={panelRef} style={{ display: showDebugInfo ? undefined : "none", width: 150 }}>
      <div className="grippy"></div>
      <h3 className="panel-header" onClick={() => setShowDebugInfo(false)}>
        Debug
      </h3>
      <dl>
        <dt>zoom</dt>
        <dd>{zoom}</dd>
      </dl>
    </div>
  );
});
