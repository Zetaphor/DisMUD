import { defineComponent } from "bitecs";
import Uint3 from "../structs/uInt3";

// This component represents the amount of damage
//  inflicted to a health or durability component
export const Damage = defineComponent(Uint3);

export default Damage;
