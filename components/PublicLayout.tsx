import { JSX } from "preact";

export function PublicLayout(props) {
  return <div class="container pt-3">
    { props.children }
  </div>
}