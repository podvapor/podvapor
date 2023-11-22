import type { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  return (
    <div class="d-flex align-items-center" style="gap: 2rem;">
      <Button class="btn-danger" onClick={() => props.count.value -= 1}>- 1</Button>
      <span class="h3 m-0">{props.count}</span>
      <Button class="btn-success" onClick={() => props.count.value += 1}>+ 1</Button>
    </div>
  );
}
