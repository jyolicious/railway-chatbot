import { useCascade } from "../context/CascadeContext";

export default function CascadeDebug() {

  const { cascadeState } = useCascade();

  return (
    <div style={{padding:20, border:"1px solid gray"}}>
      <h3>Cascade Debug</h3>
      <pre>{JSON.stringify(cascadeState, null, 2)}</pre>
    </div>
  );
}