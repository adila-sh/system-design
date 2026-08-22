import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "./avatar";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// Fallback e contador usam a mesma superfície muted, mas em tamanhos de fonte
// diferentes. O grupo mede os dois usos reais num único cenário.
descreverContrasteDosTextos({
  nome: "Avatar",
  montar: () => (
    <AvatarGroup>
      <Avatar size="sm">
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>BC</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+8</AvatarGroupCount>
    </AvatarGroup>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
